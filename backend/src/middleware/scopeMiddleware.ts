import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket } from 'mysql2';

/**
 * 数据权限 Scope 中间件
 *
 * 从 users 表读取用户的数据权限范围和所属部门，
 * 注入到 req.scope 和 req.userDeptName，供各 Controller 过滤数据使用。
 *
 * Scope 级别：
 *   SELF  — 仅本人数据
 *   DEPT  — 本部门数据（默认）
 *   ALL   — 全部数据
 */
export const scopeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return next();
    }

    const conn = await getConnection();
    try {
      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT id, department, scope FROM users WHERE id = ?`,
        [userId]
      );

      if (rows && rows.length > 0) {
        const user = rows[0] as any;
        // users表使用department(varchar)而非department_id(int)
        (req as any).userDeptName = user.department || '';
        (req as any).scope = user.scope || 'DEPT'; // 默认部门级
      } else {
        (req as any).userDeptName = '';
        (req as any).scope = 'DEPT';
      }
    } finally {
      conn.release();
    }

    next();
  } catch (error) {
    console.error('[ScopeMiddleware] 获取用户数据权限失败:', error);
    // 出错时默认最小权限
    (req as any).userDeptName = '';
    (req as any).scope = 'DEPT';
    next();
  }
};

/**
 * 根据 scope 生成 SQL WHERE 条件片段
 * 
 * @param req    Express Request（需已通过 scopeMiddleware 注入 scope 和 userDeptName）
 * @param tableAlias  表别名，默认空（如 'u' 代表 users 表）
 * @param userIdField 用户ID字段，默认 'user_id'
 * @param deptIdField 部门ID字段，默认 'department_id'
 * @returns WHERE 条件字符串和参数数组
 */
export function buildScopeWhere(
  req: Request,
  tableAlias: string = '',
  userIdField: string = 'user_id',
  deptIdField: string = 'department'
): { where: string; params: any[] } {
  const scope = (req as any).scope || 'DEPT';
  const userId = (req as any).user?.userId;
  const userDeptName = (req as any).userDeptName || '';

  const prefix = tableAlias ? `${tableAlias}.` : '';

  switch (scope) {
    case 'SELF':
      return { where: ` AND ${prefix}${userIdField} = ?`, params: [userId] };
    case 'DEPT':
      return { where: ` AND ${prefix}${deptIdField} = ?`, params: [userDeptName] };
    case 'ALL':
    default:
      return { where: '', params: [] };
  }
}
