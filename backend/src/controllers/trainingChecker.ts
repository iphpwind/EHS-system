import { getConnection } from '../config/database';
import { RowDataPacket } from 'mysql2';

/**
 * 作业类型 → 中文标签 → 证书/课程匹配映射
 * 兼容内部 ticketType（如 high_work）和前端短名（如 hotWork）
 */
const WORK_TYPE_LABELS: Record<string, string> = {
  hotWork: '动火', highWork: '高处', confinedSpace: '受限空间',
  electricWork: '临时用电', blindWork: '盲板抽堵', brokenWork: '断路',
  hoisting: '吊装', earthWork: '动土',
  hot_work: '动火', high_work: '高处', limited_space: '受限空间',
  temporary_electricity: '临时用电', blind_work: '盲板抽堵',
  road_work: '断路', hoisting_work: '吊装', excavation_work: '动土',
};

/**
 * 检查用户是否具有特定作业类型的培训资格
 * 
 * 规则：
 * 1. 查 certificates 表 — 是否有该类型、未过期的有效证书（status=1, expire_date > NOW()）
 * 2. 查 learning_progress 表 — 是否完成了类型相关的课程（is_completed=1）
 * 3. 如果系统中尚无该类型的证书配置或课程，默认放行（不影响现有流程）
 */
export async function checkTrainingEligibility(
  userId: number,
  workType: string
): Promise<{ eligible: boolean; reason?: string }> {
  const label = WORK_TYPE_LABELS[workType];
  if (!label) {
    return { eligible: true };
  }

  const conn = await getConnection();

  try {
    // ── 1. 检查该类型在系统中是否有配置记录 ──
    const [certTypeCount] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM certificate_type_dict WHERE name LIKE ? OR code LIKE ?`,
      [`%${label}%`, `%${label}%`]
    );
    const [courseCount] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM training_courses WHERE title LIKE ? AND status = 1`,
      [`%${label}%`]
    );

    const hasCertConfig = (certTypeCount[0] as any).cnt > 0;
    const hasCourseConfig = (courseCount[0] as any).cnt > 0;

    // 两个维度都没有配置记录 → 默认放行
    if (!hasCertConfig && !hasCourseConfig) {
      return { eligible: true };
    }

    // ── 2. 检查证书：有效期内 + 状态有效 ──
    let certOk = !hasCertConfig; // 无证书配置则跳过
    if (hasCertConfig) {
      const [certRows] = await conn.execute<RowDataPacket[]>(
        `SELECT c.id, c.cert_name, c.expire_date, ct.name AS cert_type_name
         FROM certificates c
         LEFT JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
         WHERE c.user_id = ? AND c.status = 1 AND c.expire_date > NOW()
           AND (c.cert_name LIKE ? OR ct.name LIKE ? OR ct.code LIKE ?)
         LIMIT 1`,
        [userId, `%${label}%`, `%${label}%`, `%${label}%`]
      );
      certOk = certRows && certRows.length > 0;
    }

    // ── 3. 检查课程学习：是否完成相关课程 ──
    let courseOk = !hasCourseConfig; // 无课程配置则跳过
    if (hasCourseConfig) {
      const [progressRows] = await conn.execute<RowDataPacket[]>(
        `SELECT lp.id FROM learning_progress lp
         INNER JOIN training_courses tc ON lp.course_id = tc.id
         WHERE lp.user_id = ? AND tc.title LIKE ? AND lp.is_completed = 1
         LIMIT 1`,
        [userId, `%${label}%`]
      );
      courseOk = progressRows && progressRows.length > 0;
    }

    // ── 4. 结果判断 ──
    if (!certOk && !courseOk) {
      const reasons: string[] = [];
      if (hasCertConfig && !certOk) reasons.push('无有效期内专项证书');
      if (hasCourseConfig && !courseOk) reasons.push('专项培训课程未完成');
      return { eligible: false, reason: reasons.join('；') };
    }

    return { eligible: true };
  } finally {
    conn.release();
  }
}
