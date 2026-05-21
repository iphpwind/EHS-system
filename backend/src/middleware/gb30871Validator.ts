/**
 * GB 30871-2022 强制校验中间件
 *
 * 依据《化学品生产单位特殊作业安全规范》(GB 30871-2022)
 * 对7类特殊作业票进行合规性强制校验
 *
 * 主要校验项：
 * - 受限空间：气体检测记录、隔离/通风措施、有效期≤24h
 * - 动火作业：一级动火必须上传视频监控、动火等级合法性
 * - 通用校验：时间有效性、安全措施完整性
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/** 支持的票证类型 */
type TicketCategory =
  | 'confined'      // 受限空间
  | 'hot'           // 动火作业
  | 'high'          // 高处作业
  | 'hoisting'      // 吊装作业
  | 'earth'         // 动土作业
  | 'broken'        // 断路作业
  | 'blind'         // 盲板抽堵
  | 'electric';     // 临时用电

/** 校验错误收集 */
interface ValidationError {
  field: string;
  message: string;
  rule: string;
}

/**
 * GB 30871-2022 校验中间件工厂函数
 * @param category 作业票类型
 * @returns Express 中间件
 */
export function gb30871Validator(category: TicketCategory) {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const errors: ValidationError[] = [];

    // ============= 通用校验（所有票种） =============

    // 1. 作业时间校验
    if (body.startTime && body.endTime) {
      const start = new Date(body.startTime);
      const end = new Date(body.endTime);
      if (isNaN(start.getTime())) {
        errors.push({ field: 'startTime', message: '计划开始时间格式无效', rule: 'GB30871-共通' });
      }
      if (isNaN(end.getTime())) {
        errors.push({ field: 'endTime', message: '计划结束时间格式无效', rule: 'GB30871-共通' });
      }
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        if (start >= end) {
          errors.push({ field: 'endTime', message: '计划结束时间必须晚于开始时间', rule: 'GB30871-共通' });
        }
        if (new Date() > end) {
          errors.push({ field: 'endTime', message: '计划结束时间不能早于当前时间', rule: 'GB30871-共通' });
        }
      }
    } else {
      errors.push({ field: 'startTime/endTime', message: '作业时间不能为空', rule: 'GB30871-共通' });
    }

    // 2. 安全措施校验
    if (body.safetyMeasures) {
      try {
        const measures = typeof body.safetyMeasures === 'string'
          ? JSON.parse(body.safetyMeasures)
          : body.safetyMeasures;
        if (!Array.isArray(measures) || measures.length === 0) {
          errors.push({ field: 'safetyMeasures', message: '安全措施不能为空', rule: 'GB30871-4.1' });
        }
      } catch {
        errors.push({ field: 'safetyMeasures', message: '安全措施格式无效', rule: 'GB30871-4.1' });
      }
    } else {
      errors.push({ field: 'safetyMeasures', message: '必须提交安全措施清单', rule: 'GB30871-4.1' });
    }

    // ============= 受限空间专项校验 =============
    if (category === 'confined') {
      // 气体检测强制校验 (GB 30871-2022 第6条)
      const gasAnalysis = body.gasAnalysis || body.gas_analysis;
      if (!gasAnalysis || !Array.isArray(gasAnalysis) || gasAnalysis.length === 0) {
        errors.push({
          field: 'gasAnalysis',
          message: '受限空间作业必须提供气体检测记录（含氧量、有毒气体、可燃气体）',
          rule: 'GB30871-6.1',
        });
      } else {
        // 检查是否包含必要的气体检测项
        const gasTypes = gasAnalysis.map((g: any) => g.gasType || g.gas_type || g.type || '').join(',');
        const hasOxygen = gasTypes.includes('氧') || gasTypes.includes('O2') || gasTypes.includes('o2');
        const hasToxic = gasTypes.includes('有毒') || gasTypes.includes('toxic') || gasTypes.includes('H2S') || gasTypes.includes('CO');
        const hasCombustible = gasTypes.includes('可燃') || gasTypes.includes('combustible') || gasTypes.includes('LEL');

        if (!hasOxygen) {
          errors.push({ field: 'gasAnalysis', message: '缺少氧气浓度检测项', rule: 'GB30871-6.1(a)' });
        }
        if (!hasToxic) {
          errors.push({ field: 'gasAnalysis', message: '缺少有毒气体检测项（如H2S、CO等）', rule: 'GB30871-6.1(b)' });
        }
        if (!hasCombustible) {
          errors.push({ field: 'gasAnalysis', message: '缺少可燃气体检测项（LEL）', rule: 'GB30871-6.1(c)' });
        }
      }

      // 隔离措施校验 (GB 30871-2022 第6.2条)
      const isolation = body.powerIsolation || body.power_isolation || body.isolation;
      if (isolation !== true && isolation !== 1 && isolation !== '1') {
        errors.push({
          field: 'powerIsolation/isolation',
          message: '受限空间作业必须确认能源隔离措施（盲板隔离/阀门关闭/电源切断等）',
          rule: 'GB30871-6.2',
        });
      }

      // 通风措施校验 (GB 30871-2022 第6.3条)
      const ventilation = body.ventilationMethod || body.ventilation_method;
      if (!ventilation || (typeof ventilation === 'string' && ventilation.trim() === '')) {
        errors.push({
          field: 'ventilationMethod',
          message: '受限空间作业必须指定通风方式（自然通风/机械通风/强制送风）',
          rule: 'GB30871-6.3',
        });
      }

      // 有效期≤24小时校验 (GB 30871-2022 第6.6条)
      if (body.startTime && body.endTime) {
        const start = new Date(body.startTime);
        const end = new Date(body.endTime);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          if (durationHours > 24) {
            errors.push({
              field: 'endTime',
              message: `受限空间作业有效期不得超过24小时（当前${durationHours.toFixed(1)}小时）`,
              rule: 'GB30871-6.6',
            });
          }
        }
      }
    }

    // ============= 动火作业专项校验 =============
    if (category === 'hot') {
      // 动火等级校验
      const hotLevel = body.hotLevel || body.hot_level;
      const validLevels = ['一级', '二级', '三级', '特级'];
      if (!hotLevel || !validLevels.includes(hotLevel)) {
        errors.push({
          field: 'hotLevel',
          message: `动火等级必须在[${validLevels.join('、')}]范围内`,
          rule: 'GB30871-5.1',
        });
      }

      // 一级/特级动火必须上传视频监控记录 (GB 30871-2022 第5.2.4条)
      if (hotLevel === '一级' || hotLevel === '特级') {
        const videoAttachment = body.videoAttachment || body.video_attachment;
        if (!videoAttachment) {
          errors.push({
            field: 'videoAttachment',
            message: `${hotLevel}动火作业必须上传视频监控记录`,
            rule: 'GB30871-5.2.4',
          });
        }
      }

      // 动火前气体分析 (GB 30871-2022 第5.3.1条)
      const gasAnalysis = body.gasAnalysis || body.gas_analysis;
      if (!gasAnalysis || !Array.isArray(gasAnalysis) || gasAnalysis.length === 0) {
        errors.push({
          field: 'gasAnalysis',
          message: '动火作业前必须进行可燃气体分析',
          rule: 'GB30871-5.3.1',
        });
      }
    }

    // ============= 高处作业专项校验 =============
    if (category === 'high') {
      const workHeight = body.workHeight || body.work_height;
      if (!workHeight || isNaN(Number(workHeight))) {
        errors.push({
          field: 'workHeight',
          message: '高处作业必须填写作业高度',
          rule: 'GB30871-8.1',
        });
      } else {
        const height = Number(workHeight);
        if (height >= 30) {
          // 特级高处作业要求
          if (!body.emergencyPlan) {
            errors.push({
              field: 'emergencyPlan',
              message: '≥30m特级高处作业必须制定应急预案',
              rule: 'GB30871-8.2',
            });
          }
        }
      }
    }

    // ============= 吊装作业专项校验 =============
    if (category === 'hoisting') {
      const tonnage = body.tonnage || body.liftingWeight || body.lifting_weight;
      if (!tonnage || isNaN(Number(tonnage))) {
        errors.push({
          field: 'tonnage',
          message: '吊装作业必须填写吊装吨位',
          rule: 'GB30871-9.1',
        });
      } else if (Number(tonnage) >= 100) {
        // 大型吊装需专项方案
        if (!body.specialPlan) {
          errors.push({
            field: 'specialPlan',
            message: '≥100吨大型吊装作业必须编制专项施工方案',
            rule: 'GB30871-9.3',
          });
        }
      }
    }

    // ============= 若有校验错误则拒绝 =============
    if (errors.length > 0) {
      logger.warn(`[GB30871] 校验失败 (${category})`, {
        errors: errors.map(e => `${e.field}: ${e.message}`),
        userId: (req as any).user?.userId,
        path: req.path,
      });

      return res.status(400).json({
        code: 400,
        msg: 'GB 30871-2022 合规校验未通过',
        validationErrors: errors.map(e => ({
          ...e,
          reference: e.rule,
        })),
        advice: '请根据GB 30871-2022规范完善作业票信息后重新提交',
      });
    }

    logger.info(`[GB30871] 校验通过 (${category})`, {
      userId: (req as any).user?.userId,
      path: req.path,
    });

    next();
  };
}

/**
 * GB 30871 审批前特殊校验（审批节点专用）
 * 例如：受限空间必须完成气体检测才能进入安全审批
 */
export function gb30871ApproveValidator(category: TicketCategory) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let conn: any = null;
    const { action } = req.body;

    // 仅在特定审批节点强制校验
    if (category === 'confined' && (action === 'safety' || action === 'final')) {
      const { getConnection } = require('../config/database');
      try {
        conn = await getConnection();
        const ticketId = req.params.id;

        // 检查气体检测记录是否存在
        const [rows] = await conn.execute(
          `SELECT oxygen_content, toxic_content FROM restrictedwork_tickets WHERE permit_id = ?`,
          [ticketId]
        );
        const ext = (rows as any[])[0];
        if (!ext || (!ext.oxygen_content && !ext.toxic_content)) {
          return res.status(400).json({
            code: 400,
            msg: '审批前必须完成受限空间气体检测并填写检测结果',
            rule: 'GB30871-6.5',
          });
        }
      } catch (error) {
        logger.error('[GB30871] 审批前置校验异常', { error, ticketId: req.params.id });
      } finally {
        if (conn) conn.release();
      }
    }

    next();
  };
}

export default gb30871Validator;
