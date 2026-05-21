/**
 * 安全生产责任制签署服务
 *
 * 实现逐级签署流程：
 *   主要负责人 → 分管领导 → 部门负责人 → 岗位员工
 *
 * 签署前强制完成责任制培训（前置校验）
 * 支持修订触发机制（法规变化、组织调整、事故后重新签署）
 */

import { getConnection } from '../config/database';
import { logger } from '../utils/logger';

/** 签署层级 */
export type SignLevel = 'main' | 'leadership' | 'dept' | 'post';

export const SIGN_LEVEL_LABEL: Record<SignLevel, string> = {
  main: '主要负责人',
  leadership: '分管领导',
  dept: '部门负责人',
  post: '岗位员工',
};

/** 签署层级流转顺序 */
export const SIGN_LEVEL_ORDER: SignLevel[] = ['main', 'leadership', 'dept', 'post'];

/** 责任制状态 */
export type ResponsibilityStatus = 'draft' | 'signing' | 'completed' | 'revision';

/** 责任制文档实体 */
export interface ResponsibilityDocument {
  id: number;
  title: string;
  version: string;
  content: string;
  status: ResponsibilityStatus;
  revisionReason?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

/** 签署记录实体 */
export interface SignRecord {
  id: number;
  responsibilityId: number;
  signerId: number;
  signerName: string;
  level: SignLevel;
  signatureData?: string; // 电子签名 base64
  signTime: string;
}

/**
 * 检查用户是否完成责任制培训
 */
async function checkResponsibilityTraining(userId: number): Promise<boolean> {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT is_passed FROM training_records 
       WHERE user_id = ? AND plan_id IN (SELECT id FROM training_plans WHERE category = 'safety_responsibility')
       AND is_passed = 1 LIMIT 1`,
      [userId]
    );
    return (rows as any[]).length > 0;
  } catch (error) {
    logger.error('[ResponsibilityService] 培训校验异常', { error, userId });
    return false;
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 确保 responsibilities 表存在
 */
async function ensureTables(): Promise<void> {
  let conn: any = null;
  try {
    conn = await getConnection();

    // 责任制文档表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS responsibilities (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL COMMENT '文档标题',
        version VARCHAR(20) DEFAULT 'V1.0' COMMENT '版本号',
        content TEXT COMMENT '文档内容',
        status ENUM('draft','signing','completed','revision') DEFAULT 'draft' COMMENT '状态',
        revision_reason VARCHAR(500) COMMENT '修订原因',
        created_by INT COMMENT '创建人ID',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_by (created_by)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='责任制文档表'
    `);

    // 签署记录表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS responsibility_signatures (
        id INT PRIMARY KEY AUTO_INCREMENT,
        responsibility_id INT NOT NULL COMMENT '责任制文档ID',
        signer_id INT NOT NULL COMMENT '签署人ID',
        signer_name VARCHAR(50) NOT NULL COMMENT '签署人姓名',
        sign_level ENUM('main','leadership','dept','post') NOT NULL COMMENT '签署层级',
        signature_data TEXT COMMENT '电子签名(base64)',
        sign_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '签署时间',
        is_valid TINYINT DEFAULT 1 COMMENT '是否有效(1有效,0因修订失效)',
        UNIQUE KEY uk_resp_user (responsibility_id, signer_id),
        INDEX idx INTITY (responsibility_id),
        INDEX idx_signer (signer_id),
        INDEX idx_level (sign_level)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='责任制签署记录表'
    `);
  } catch (error) {
    logger.error('[ResponsibilityService] 创建表失败', { error });
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 创建责任制文档
 */
export async function createResponsibilityDoc(
  title: string,
  content: string,
  createdBy: number,
  version: string = 'V1.0'
): Promise<{ docId: number }> {
  await ensureTables();

  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO responsibilities (title, content, version, status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, 'draft', ?, NOW(), NOW())`,
      [title, content, version, createdBy]
    );

    await conn.commit();

    logger.info(`[ResponsibilityService] 责任制文档已创建: ${title} (V${version})`, {
      docId: (result as any).insertId,
    });

    return { docId: (result as any).insertId };

  } catch (error) {
    if (conn) await conn.rollback();
    logger.error('[ResponsibilityService] 创建责任制文档失败', { error, title });
    throw new Error('创建责任制文档失败');
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 发布责任制文档（进入签署流程）
 * 发布后所有需要签署的用户按层级依次签署
 */
export async function publishResponsibilityDoc(docId: number): Promise<void> {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM responsibilities WHERE id = ?', [docId]);
    const doc = (rows as any[])[0];

    if (!doc) throw new Error('责任制文档不存在');
    if (doc.status !== 'draft') throw new Error('只有草稿状态可以发布');

    await conn.execute(
      `UPDATE responsibilities SET status = 'signing', updated_at = NOW() WHERE id = ?`,
      [docId]
    );

    logger.info(`[ResponsibilityService] 责任制文档已发布签署: #${docId}`);
  } catch (error) {
    logger.error('[ResponsibilityService] 发布责任制文档失败', { error, docId });
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 签署责任制
 * @param docId 文档ID
 * @param signerId 签署人ID
 * @param signerName 签署人姓名
 * @param level 签署层级
 * @param signatureData 电子签名(base64)
 */
export async function signResponsibility(
  docId: number,
  signerId: number,
  signerName: string,
  level: SignLevel,
  signatureData?: string
): Promise<void> {
  // 1. 培训前置校验
  const hasTrained = await checkResponsibilityTraining(signerId);
  if (!hasTrained) {
    throw new Error('必须完成安全生产责任制培训后才能签署');
  }

  let conn: any = null;
  try {
    conn = await getConnection();

    // 2. 验证文档状态
    const [docRows] = await conn.execute('SELECT * FROM responsibilities WHERE id = ?', [docId]);
    const doc = (docRows as any[])[0];
    if (!doc) throw new Error('责任制文档不存在');
    if (doc.status !== 'signing') throw new Error('文档不在签署状态');

    // 3. 验证签署层级顺序
    const levelIndex = SIGN_LEVEL_ORDER.indexOf(level);
    if (levelIndex === -1) throw new Error(`无效的签署层级: ${level}`);

    // 检查上一级是否已签署
    if (levelIndex > 0) {
      const prevLevel = SIGN_LEVEL_ORDER[levelIndex - 1];
      const [prevSigns] = await conn.execute(
        `SELECT id FROM responsibility_signatures 
         WHERE responsibility_id = ? AND sign_level = ? AND is_valid = 1`,
        [docId, prevLevel]
      );
      if ((prevSigns as any[]).length === 0) {
        throw new Error(`请等待${SIGN_LEVEL_LABEL[prevLevel]}先签署`);
      }
    }

    // 4. 检查是否已签署
    const [existing] = await conn.execute(
      `SELECT id FROM responsibility_signatures 
       WHERE responsibility_id = ? AND signer_id = ? AND sign_level = ?`,
      [docId, signerId, level]
    );
    if ((existing as any[]).length > 0) {
      throw new Error('您已经签署过该文档');
    }

    // 5. 执行签署
    await conn.beginTransaction();
    try {
      await conn.execute(
        `INSERT INTO responsibility_signatures 
         (responsibility_id, signer_id, signer_name, sign_level, signature_data, sign_time)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [docId, signerId, signerName, level, signatureData || null]
      );

      // 6. 若所有层级都签署完毕，标记文档为completed
      const signedLevels = SIGN_LEVEL_ORDER.slice(0, levelIndex + 1);
      if (signedLevels.length === SIGN_LEVEL_ORDER.length) {
        const [allSigns] = await conn.execute(
          `SELECT DISTINCT sign_level FROM responsibility_signatures 
           WHERE responsibility_id = ? AND is_valid = 1`,
          [docId]
        );
        const uniqueLevels = (allSigns as any[]).map((s: any) => s.sign_level);
        if (SIGN_LEVEL_ORDER.every(l => uniqueLevels.includes(l))) {
          await conn.execute(
            `UPDATE responsibilities SET status = 'completed', updated_at = NOW() WHERE id = ?`,
            [docId]
          );
          logger.info(`[ResponsibilityService] 责任制签署全部完成: #${docId}`);
        }
      }

      await conn.commit();

      logger.info(`[ResponsibilityService] 签署成功: #${docId} ${SIGN_LEVEL_LABEL[level]} ${signerName}`);

    } catch (error) {
      await conn.rollback();
      throw error;
    }

  } catch (error) {
    logger.error('[ResponsibilityService] 签署失败', { error, docId, signerId, level });
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 触发责任制修订（因法规变化/组织调整/事故）
 */
export async function triggerRevision(docId: number, reason: string): Promise<void> {
  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.beginTransaction();

    // 更新文档状态为修订中
    await conn.execute(
      `UPDATE responsibilities 
       SET status = 'revision', revision_reason = ?, updated_at = NOW() 
       WHERE id = ?`,
      [reason, docId]
    );

    // 将现有签署记录标记为失效
    await conn.execute(
      `UPDATE responsibility_signatures 
       SET is_valid = 0 
       WHERE responsibility_id = ?`,
      [docId]
    );

    await conn.commit();

    logger.info(`[ResponsibilityService] 责任制修订已触发: #${docId} 原因: ${reason}`);

  } catch (error) {
    if (conn) await conn.rollback();
    logger.error('[ResponsibilityService] 触发修订失败', { error, docId, reason });
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 获取用户待签署列表
 */
export async function getMySignTasks(userId: number, role: number): Promise<any[]> {
  let conn: any = null;
  try {
    conn = await getConnection();

    // 根据角色确定签署层级
    let level: SignLevel;
    if (role <= 1) level = 'main';
    else if (role <= 3) level = 'leadership';
    else if (role <= 4) level = 'dept';
    else level = 'post';

    const [rows] = await conn.execute(`
      SELECT r.*, rs.signer_name, rs.sign_time
      FROM responsibilities r
      LEFT JOIN responsibility_signatures rs ON r.id = rs.responsibility_id AND rs.signer_id = ? AND rs.sign_level = ?
      WHERE r.status = 'signing'
        AND rs.id IS NULL
      ORDER BY r.updated_at DESC
    `, [userId, level]);

    return rows as any[];
  } catch (error) {
    logger.error('[ResponsibilityService] 获取待签署列表失败', { error, userId });
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 获取责任制文档签署状态
 */
export async function getDocSignStatus(docId: number): Promise<any> {
  let conn: any = null;
  try {
    conn = await getConnection();

    const [docRows] = await conn.execute(
      `SELECT * FROM responsibilities WHERE id = ?`, [docId]
    );
    if (!(docRows as any[]).length) throw new Error('文档不存在');

    const [signRows] = await conn.execute(`
      SELECT rs.*, u.real_name, u.department
      FROM responsibility_signatures rs
      LEFT JOIN users u ON rs.signer_id = u.id
      WHERE rs.responsibility_id = ? AND rs.is_valid = 1
      ORDER BY FIELD(rs.sign_level, 'main','leadership','dept','post')`,
      [docId]
    );

    return {
      document: (docRows as any[])[0],
      signatures: signRows,
      levels: SIGN_LEVEL_ORDER.map(level => ({
        level,
        label: SIGN_LEVEL_LABEL[level],
        signed: (signRows as any[]).some((s: any) => s.sign_level === level),
        signer: (signRows as any[]).find((s: any) => s.sign_level === level) || null,
      })),
    };
  } catch (error) {
    logger.error('[ResponsibilityService] 获取签署状态失败', { error, docId });
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

export default {
  createResponsibilityDoc,
  publishResponsibilityDoc,
  signResponsibility,
  triggerRevision,
  getMySignTasks,
  getDocSignStatus,
};
