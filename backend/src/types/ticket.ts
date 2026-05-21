/**
 * 作业票状态机类型定义
 * 统一7类作业票（动火/受限空间/高处/吊装/动土/断路/盲板抽堵）的状态管理
 */

/** 作业票状态枚举 */
export type TicketStatus =
  | 'draft'            // 草稿
  | 'submitted'        // 已提交
  | 'dept_approved'    // 部门审批通过
  | 'safety_approved'  // 安全审批通过
  | 'approved'         // 已批准
  | 'working'          // 作业中
  | 'pending_accept'   // 待验收
  | 'completed'        // 已完成
  | 'rejected'         // 已拒绝
  | 'cancelled';       // 已取消

/** 状态码映射（兼容旧数字状态） */
export const STATUS_CODE_MAP: Record<string, TicketStatus> = {
  '1': 'draft',
  '2': 'submitted',
  '3': 'dept_approved',
  '4': 'safety_approved',
  '5': 'approved',
  '6': 'working',
  '7': 'pending_accept',
  '8': 'completed',
  '0': 'rejected',
  '-1': 'cancelled',
};

/** 状态码到状态名的反向映射 */
export const STATUS_TO_CODE: Record<TicketStatus, string> = {
  draft: '1',
  submitted: '2',
  dept_approved: '3',
  safety_approved: '4',
  approved: '5',
  working: '6',
  pending_accept: '7',
  completed: '8',
  rejected: '0',
  cancelled: '-1',
};

/** 状态中文标签 */
export const STATUS_LABEL: Record<TicketStatus, string> = {
  draft: '草稿',
  submitted: '已提交',
  dept_approved: '部门审批通过',
  safety_approved: '安全审批通过',
  approved: '已批准',
  working: '作业中',
  pending_accept: '待验收',
  completed: '已完成',
  rejected: '已拒绝',
  cancelled: '已取消',
};

/** 作业票操作定义 */
export type TicketAction =
  | 'submit'           // 提交
  | 'dept_approve'     // 部门审批
  | 'safety_approve'   // 安全审批
  | 'final_approve'    // 最终批准
  | 'reject'           // 驳回
  | 'start'            // 开始作业
  | 'finish'           // 完成作业
  | 'accept'           // 验收通过
  | 'cancel';          // 取消

/** 用户角色ID（数字越小权限越高） */
export interface TicketUser {
  userId: number;
  username?: string;
  realName?: string;
  role: number;       // 1=超管 2=安全主管 3=安全员 4=部门负责人 5=员工
  deptId?: number;
}

/** 作业票实体（简化版，用于状态机） */
export interface TicketEntity {
  id: number;
  ticketNo: string;
  ticketType: string;
  status: string | TicketStatus;
  currentNode: number;
  applicantId: number;
  orgId?: number;
}

/** 流转转换定义 */
export interface Transition {
  from: TicketStatus[];          // 源状态
  to: TicketStatus;               // 目标状态
  action: TicketAction;           // 触发动作
  allowedRoles: number[];         // 允许的角色ID（数字，越小权限越高）
  label: string;                  // 操作标签（中文）
  validate?: (ticket: TicketEntity, user: TicketUser, context?: any) => Promise<{ valid: boolean; message?: string }>;
}

/** 审批节点信息 */
export interface ApprovalNode {
  nodeId: number;
  nodeName: string;
  status: TicketStatus;
  allowedRoles: number[];
}

export const APPROVAL_NODES: ApprovalNode[] = [
  { nodeId: 1, nodeName: '部门审批', status: 'dept_approved', allowedRoles: [3, 4] },
  { nodeId: 2, nodeName: '安全审批', status: 'safety_approved', allowedRoles: [2, 3] },
  { nodeId: 3, nodeName: '最终批准', status: 'approved', allowedRoles: [1, 2] },
];

/** 风险等级类型（GB 30871-2022） */
export type RiskLevel = 'special' | 'level1' | 'level2';

/** 风险等级中文映射 */
export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  'special': '特级',
  'level1': '一级',
  'level2': '二级'
};

/**
 * 根据风险等级获取审批层级数
 * - 特级：3级审批（部门→安全总监→分管领导）
 * - 一级：2级审批（部门→安全总监）
 * - 二级：1级审批（部门负责人）
 */
export const getApprovalLevels = (riskLevel: RiskLevel): number => {
  if (riskLevel === 'special') return 3;  // 特级：3级审批
  if (riskLevel === 'level1') return 2;   // 一级：2级审批
  return 1;                               // 二级：1级审批
};

/**
 * 根据审批层级获取审批人角色
 * - 1=超管 2=安全主管 3=安全员 4=部门负责人 5=员工
 */
export const getApproverRole = (approvalLevel: number): number => {
  // 审批层级：1=部门负责人(role=4), 2=安全总监(role=3), 3=分管领导(role=2)
  const roleMap: Record<number, number> = {
    1: 4,  // 第1级：部门负责人
    2: 3,  // 第2级：安全总监
    3: 2   // 第3级：分管领导
  };
  return roleMap[approvalLevel] || 4;
};
