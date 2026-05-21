/**
 * 作业票-培训强绑定校验中间件
 *
 * 化工企业合规要求：
 * 1. 三级安全教育未完成(72学时) → 禁止申请任何作业票
 * 2. 年度再教育学时不足(危险化学品≥20学时) → 禁止
 * 3. 高危作业(受限空间/动火/盲板/吊装) → 需有效特种作业证书
 */

import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { checkThreeLevelCompletion } from '../services/threeLevelEducationService';
import { logger } from '../utils/logger';

interface ValidatorOptions {
  requireThreeLevel?: boolean;       // 是否要求完成三级教育（默认true）
  minAnnualHours?: number;           // 年度最低学时（默认20）
  requireSpecialCert?: boolean;      // 是否要求特种作业证书（默认false，高危作业自动启用）
}

/** 高危作业类型 */
const HIGH_RISK_TYPES = ['confined', 'hot', 'blind', 'hoisting'];

/**
 * 作业票培训合规校验中间件
 */
export function ticketTrainingValidator(options: ValidatorOptions = {}) {
  const {
    requireThreeLevel = true,
    minAnnualHours = 20,
    requireSpecialCert = false,
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    let conn: any = null;
    try {
      const userId = (req as any).user?.userId;
      const ticketType = req.body.ticketType || req.body.type || '';
      const isHighRisk = HIGH_RISK_TYPES.includes(ticketType) || requireSpecialCert;

      if (!userId) {
        return res.status(401).json({ code: 401, msg: '未获取到用户信息，请重新登录' });
      }

      conn = await getConnection();

      // ========== 1. 三级安全教育强制校验 ==========
      if (requireThreeLevel) {
        const threeLevelStatus = await checkThreeLevelCompletion(userId);

        if (!threeLevelStatus.completed) {
          logger.warn(`[TicketValidator] 三级教育未完成，拒绝创建作业票`, {
            userId,
            factory: threeLevelStatus.factory,
            workshop: threeLevelStatus.workshop,
            team: threeLevelStatus.team,
            total: threeLevelStatus.total,
          });

          return res.status(403).json({
            code: 403,
            msg: '三级安全教育未完成（需72学时），禁止申请作业票',
            data: {
              education: {
                factory: threeLevelStatus.factory,
                workshop: threeLevelStatus.workshop,
                team: threeLevelStatus.team,
                total: threeLevelStatus.total,
                required: { factory: 24, workshop: 24, team: 24, total: 72 },
              },
              advice: '请完成厂级(24学时)+车间级(24学时)+班组级(24学时)三级安全教育后再申请',
            },
          });
        }
      }

      // ========== 2. 年度再教育学时校验 ==========
      const [annualRows] = await conn.execute(
        `SELECT COALESCE(SUM(credit_hours), 0) as totalHours 
         FROM training_records 
         WHERE user_id = ? AND YEAR(COALESCE(updated_at, created_at)) = YEAR(CURDATE())`,
        [userId]
      );

      const currentHours = Number((annualRows as any[])[0]?.totalHours) || 0;

      if (currentHours < minAnnualHours) {
        logger.warn(`[TicketValidator] 年度学时不足，拒绝创建作业票`, {
          userId,
          currentHours,
          required: minAnnualHours,
        });

        return res.status(403).json({
          code: 403,
          msg: `年度安全再教育学时不足（当前 ${currentHours} 学时，需 ≥ ${minAnnualHours} 学时），禁止申请作业票`,
          data: {
            annual: {
              current: currentHours,
              required: minAnnualHours,
              gap: minAnnualHours - currentHours,
            },
            advice: `请参加在线培训或线下培训完成剩余 ${minAnnualHours - currentHours} 学时后再申请`,
          },
        });
      }

      // ========== 3. 高危作业特种证书校验 ==========
      if (isHighRisk) {
        const [certRows] = await conn.execute(
          `SELECT c.id, c.cert_no, c.cert_name, c.expire_date,
                  ct.name as cert_type_name,
                  DATEDIFF(c.expire_date, CURDATE()) as days_remaining
           FROM certificates c
           INNER JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
           WHERE c.user_id = ? AND c.status = 1 AND c.expire_date >= CURDATE()
           ORDER BY c.expire_date ASC LIMIT 1`,
          [userId]
        );

        const cert = (certRows as any[])[0];

        if (!cert) {
          logger.warn(`[TicketValidator] 无有效特种作业证书，拒绝创建高危作业票`, {
            userId,
            ticketType,
          });

          return res.status(403).json({
            code: 403,
            msg: `高危作业（${ticketType}）需持有效特种作业证书，当前未找到有效证书`,
            data: {
              ticketType,
              advice: '请先参加对应特种作业培训并通过考核获取证书后再申请',
            },
          });
        }

        if (cert.days_remaining <= 30) {
          logger.warn(`[TicketValidator] 特种证书即将到期提醒`, {
            userId,
            ticketType,
            certNo: cert.cert_no,
            daysRemaining: cert.days_remaining,
          });

          // 证书30天内到期 — 发出警告但允许申请（由业务方决定是否拦截）
          res.setHeader('X-Cert-Warning', `证书将于${cert.days_remaining}天后到期`);
        }
      }

      // 全部通过
      logger.info(`[TicketValidator] ✅ 培训合规校验通过`, {
        userId,
        ticketType,
        annualHours: currentHours,
      });

      next();

    } catch (error) {
      logger.error('[TicketValidator] 培训合规校验服务异常', { error, userId: (req as any).user?.userId });
      // 服务异常时记录但不阻塞（防止紧急作业无法创建）
      next();
    } finally {
      if (conn) conn.release();
    }
  };
}

/**
 * 预校验接口（GET请求，给前端提前检查用）
 */
export async function preCheckTrainingStatus(req: Request, res: Response) {
  let conn: any = null;
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ code: 401, msg: '未登录' });
    }

    conn = await getConnection();

    // 三级教育
    const threeLevel = await checkThreeLevelCompletion(userId);

    // 年度学时
    const [annualRows] = await conn.execute(
      `SELECT COALESCE(SUM(credit_hours), 0) as totalHours 
       FROM training_records 
       WHERE user_id = ? AND YEAR(COALESCE(updated_at, created_at)) = YEAR(CURDATE())`,
      [userId]
    );
    const annualHours = Number((annualRows as any[])[0]?.totalHours) || 0;

    // 特种证书
    const [certRows] = await conn.execute(
      `SELECT c.cert_no, c.cert_name, c.expire_date, ct.name as cert_type_name
       FROM certificates c
       INNER JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
       WHERE c.user_id = ? AND c.status = 1 AND c.expire_date >= CURDATE()
       ORDER BY c.expire_date ASC`,
      [userId]
    );

    res.json({
      code: 200,
      msg: 'success',
      data: {
        threeLevel,
        annual: {
          current: annualHours,
          required: 20,
          passed: annualHours >= 20,
        },
        certificates: (certRows as any[]).map((c: any) => ({
          certNo: c.cert_no,
          certName: c.cert_type_name || c.cert_name,
          expireDate: c.expire_date,
        })),
        allPassed: threeLevel.completed && annualHours >= 20 && (certRows as any[]).length > 0,
      },
    });
  } catch (error) {
    logger.error('[TicketValidator] 预校验失败', { error, userId: (req as any).user?.userId });
    res.status(500).json({ code: 500, msg: '预校验服务异常' });
  } finally {
    if (conn) conn.release();
  }
}

export default ticketTrainingValidator;
