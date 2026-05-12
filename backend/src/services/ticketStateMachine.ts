/**
 * 统一作业票状态机服务
 *
 * 适用全部7类作业票（动火/受限空间/高处/吊装/动土/断路/盲板抽堵）
 * 减少7类票证控制器中的重复代码，统一状态流转规则
 *
 * 状态流转：
 *   draft → submitted → dept_approved → safety_approved → approved → working → pending_accept → completed
 *                ↓                 ↓                ↓                                                      ↑
 *              (可驳回至draft)  (可驳回至draft)  (可驳回至draft)                                        (从working完成)
 */

import {
  TicketStatus,
  TicketAction,
  TicketEntity,
  TicketUser,
  Transition,
  STATUS_LABEL,
  STATUS_TO_CODE,
  STATUS_CODE_MAP,
} from '../types/ticket';

import { logger } from '../utils/logger';

// ============ 全部合法的状态流转 ============
const TRANSITIONS: Transition[] = [
  // 提交
  {
    from: ['draft', 'rejected'],
    to: 'submitted',
    action: 'submit',
    allowedRoles: [1, 2, 3, 4, 5], // 所有角色可提交（但只能提交自己的）
    label: '提交审批',
  },
  // 部门审批
  {
    from: ['submitted'],
    to: 'dept_approved',
    action: 'dept_approve',
    allowedRoles: [1, 2, 3, 4], // 部门负责人及上级
    label: '部门审批通过',
  },
  // 安全审批
  {
    from: ['dept_approved'],
    to: 'safety_approved',
    action: 'safety_approve',
    allowedRoles: [1, 2, 3], // 安全部门及以上
    label: '安全审批通过',
  },
  // 最终批准
  {
    from: ['safety_approved'],
    to: 'approved',
    action: 'final_approve',
    allowedRoles: [1, 2], // 安全主管/超管
    label: '最终批准',
  },
  // 驳回（任意审批阶段 → 草稿）
  {
    from: ['submitted', 'dept_approved', 'safety_approved'],
    to: 'rejected',
    action: 'reject',
    allowedRoles: [1, 2, 3, 4], // 审批者可驳回
    label: '驳回',
  },
  // 开始作业
  {
    from: ['approved'],
    to: 'working',
    action: 'start',
    allowedRoles: [1, 2, 3, 4, 5],
    label: '开始作业',
  },
  // 完成作业（作业中 → 待验收）
  {
    from: ['working'],
    to: 'pending_accept',
    action: 'finish',
    allowedRoles: [1, 2, 3, 4, 5],
    label: '完成作业',
  },
  // 验收通过（待验收 → 已完成）
  {
    from: ['pending_accept'],
    to: 'completed',
    action: 'accept',
    allowedRoles: [1, 2, 3, 4],
    label: '验收通过',
  },
  // 取消
  {
    from: ['draft', 'submitted', 'dept_approved', 'safety_approved', 'approved'],
    to: 'cancelled',
    action: 'cancel',
    allowedRoles: [1, 2, 3], // 安全部门及以上可取消
    label: '取消',
  },
];

// ============ 状态机核心 ============
export class TicketStateMachine {
  private static instance: TicketStateMachine;
  private extraTransitions: Transition[] = [];

  private constructor() {}

  /** 单例模式 */
  static getInstance(): TicketStateMachine {
    if (!TicketStateMachine.instance) {
      TicketStateMachine.instance = new TicketStateMachine();
    }
    return TicketStateMachine.instance;
  }

  /** 注册额外的流转规则（用于特定票种的特殊流程） */
  registerTransition(transition: Transition): void {
    this.extraTransitions.push(transition);
    logger.info(`[StateMachine] 注册自定义流转: ${transition.action}`, { from: transition.from, to: transition.to });
  }

  /** 获取所有流转规则 */
  private getAllTransitions(): Transition[] {
    return [...TRANSITIONS, ...this.extraTransitions];
  }

  /**
   * 解析状态（兼容旧数字编码和新字符串状态）
   */
  private normalizeStatus(status: string | number): TicketStatus {
    const key = String(status);
    return STATUS_CODE_MAP[key] || (key as TicketStatus);
  }

  /**
   * 执行状态流转
   * @param ticket 作业票实体
   * @param user 操作用户
   * @param action 执行动作
   * @param context 附加上下文（如审批意见等）
   * @returns { newStatus, label, allowed }
   */
  async transition(
    ticket: TicketEntity,
    user: TicketUser,
    action: TicketAction,
    context?: any
  ): Promise<{ allowed: boolean; newStatus?: TicketStatus; label?: string; message?: string }> {
    const currentStatus = this.normalizeStatus(ticket.status);
    const allTransitions = this.getAllTransitions();

    // 查找匹配的流转规则
    const transition = allTransitions.find(
      t => t.action === action && t.from.includes(currentStatus)
    );

    if (!transition) {
      const allowedActions = this.getAvailableActions(ticket, user);
      return {
        allowed: false,
        message: `当前状态[${STATUS_LABEL[currentStatus]}]不允许执行[${action}]操作。` +
          `允许的操作: ${allowedActions.map(a => a.label).join('、') || '无'}`,
      };
    }

    // 权限校验
    if (!transition.allowedRoles.includes(user.role)) {
      return {
        allowed: false,
        message: `角色权限不足，[${transition.label}]需要角色等级≤${Math.max(...transition.allowedRoles)}`,
      };
    }

    // 前置条件校验
    if (transition.validate) {
      const validation = await transition.validate(ticket, user, context);
      if (!validation.valid) {
        return {
          allowed: false,
          message: validation.message || '前置条件校验失败',
        };
      }
    }

    logger.info(`[StateMachine] 状态流转: ${ticket.ticketNo} [${STATUS_LABEL[currentStatus]}] → [${STATUS_LABEL[transition.to]}]`, {
      ticketNo: ticket.ticketNo,
      action,
      userId: user.userId,
      fromStatus: currentStatus,
      toStatus: transition.to,
    });

    return {
      allowed: true,
      newStatus: transition.to,
      label: transition.label,
    };
  }

  /**
   * 获取当前用户可执行的操作列表
   * 用于前端动态显示按钮
   */
  getAvailableActions(ticket: TicketEntity, user: TicketUser): { action: TicketAction; label: string; statusCode?: string }[] {
    const currentStatus = this.normalizeStatus(ticket.status);
    const allTransitions = this.getAllTransitions();

    const actions = allTransitions
      .filter(t => t.from.includes(currentStatus) && t.allowedRoles.includes(user.role))
      .map(t => ({
        action: t.action,
        label: t.label,
        statusCode: STATUS_TO_CODE[t.to],
      }));

    return actions;
  }

  /**
   * 获取状态中文名
   */
  getStatusLabel(status: string | number): string {
    return STATUS_LABEL[this.normalizeStatus(status)] || String(status);
  }

  /**
   * 获取下一审批节点信息
   */
  getNextApprovalNode(currentStatus: string | number): { nodeId?: number; nodeName?: string; nextStatus?: TicketStatus } | null {
    const status = this.normalizeStatus(currentStatus);

    if (status === 'submitted') {
      return { nodeId: 1, nodeName: '部门审批', nextStatus: 'dept_approved' };
    }
    if (status === 'dept_approved') {
      return { nodeId: 2, nodeName: '安全审批', nextStatus: 'safety_approved' };
    }
    if (status === 'safety_approved') {
      return { nodeId: 3, nodeName: '最终批准', nextStatus: 'approved' };
    }
    return null;
  }

  /**
   * 获取状态映射（用于前端表格渲染）
   */
  getStatusMap(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const [code, status] of Object.entries(STATUS_CODE_MAP)) {
      map[code] = STATUS_LABEL[status];
    }
    return map;
  }
}

// 导出单例
export const ticketStateMachine = TicketStateMachine.getInstance();
export default { ticketStateMachine, TicketStateMachine };
