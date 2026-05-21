import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

// ==================== 角色管理 ====================

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 10, keyword } = req.query;
    conn = await getConnection();

    let sql = 'SELECT id, name, code, data_scope, status, remark, created_at FROM roles_v2 WHERE 1=1';
    const params: any[] = [];

    if (keyword) {
      sql += ' AND (name LIKE ? OR code LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const [countRows] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM roles_v2');
    const total = countRows[0].total;

    sql += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    params.push(Number(pageSize), (Number(page) - 1) * Number(pageSize));

    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);
    
    res.json({ code: 200, msg: 'success', data: rows, total });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const getRoleOptions = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id, name FROM roles_v2 WHERE status = 1');
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { name, code, dataScope = 1, status = 1, remark = '' } = req.body;
    conn = await getConnection();
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO roles_v2 (name, code, data_scope, status, remark) VALUES (?, ?, ?, ?, ?)',
      [name, code, dataScope, status, remark]
    );
    res.json({ code: 200, msg: 'success', data: { id: result.insertId } });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    const { name, code, dataScope, status, remark } = req.body;
    conn = await getConnection();
    await conn.execute(
      'UPDATE roles_v2 SET name=?, code=?, data_scope=?, status=?, remark=? WHERE id=?',
      [name, code, dataScope, status, remark, id]
    );
    res.json({ code: 200, msg: 'success' });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    conn = await getConnection();
    await conn.execute('DELETE FROM roles_v2 WHERE id=?', [id]);
    await conn.execute('DELETE FROM user_roles WHERE role_id=?', [id]);
    await conn.execute('DELETE FROM role_menus WHERE role_id=?', [id]);
    res.json({ code: 200, msg: 'success' });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

// ==================== 菜单管理 ====================

export const getMenus = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM menus ORDER BY parent_id ASC, sort_order ASC');
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const getMenuTree = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id, name as label, parent_id as parentId FROM menus WHERE status=1 ORDER BY sort_order ASC');
    const tree = buildTree(rows as any[], 0);
    res.json({ code: 200, msg: 'success', data: tree });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

function buildTree(items: any[], parentId: number): any[] {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => ({
      id: item.id,
      label: item.label,
      children: buildTree(items, item.id)
    }));
}

export const createMenu = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { name, title, path, component, permission, icon, parentId, menuType, sortOrder } = req.body;
    conn = await getConnection();
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO menus (name, title, path, component, permission, icon, parent_id, menu_type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, title, path, component, permission, icon, parentId || 0, menuType, sortOrder || 0]
    );
    res.json({ code: 200, msg: 'success', data: { id: result.insertId } });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    const { name, title, path, component, permission, icon, parentId, menuType, sortOrder, status } = req.body;
    conn = await getConnection();
    await conn.execute(
      'UPDATE menus SET name=?, title=?, path=?, component=?, permission=?, icon=?, parent_id=?, menu_type=?, sort_order=?, status=? WHERE id=?',
      [name, title, path, component, permission, icon, parentId, menuType, sortOrder, status, id]
    );
    res.json({ code: 200, msg: 'success' });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    conn = await getConnection();
    await conn.execute('DELETE FROM menus WHERE id=?', [id]);
    await conn.execute('DELETE FROM role_menus WHERE menu_id=?', [id]);
    res.json({ code: 200, msg: 'success' });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

// ==================== 用户角色 ====================

export const getUserRoles = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { userId } = req.params;
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT r.id, r.name, r.code FROM roles_v2 r INNER JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?',
      [userId]
    );
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const assignUserRoles = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { userId } = req.params;
    const { roleIds } = req.body;
    conn = await getConnection();
    await conn.execute('DELETE FROM user_roles WHERE user_id = ?', [userId]);
    if (roleIds && roleIds.length > 0) {
      const placeholders = roleIds.map(() => '(?, ?)').join(',');
      const params = roleIds.flatMap((rid: any) => [userId, rid]);
      await conn.execute(`INSERT INTO user_roles (user_id, role_id) VALUES ${placeholders}`, params);
    }
    res.json({ code: 200, msg: 'success' });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

// ==================== 角色菜单 ====================

export const getRoleMenus = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { roleId } = req.params;
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT menu_id FROM role_menus WHERE role_id = ?',
      [roleId]
    );
    res.json({ code: 200, msg: 'success', data: rows.map((r: any) => r.menu_id) });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

export const assignRoleMenus = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { roleId } = req.params;
    const { menuIds } = req.body;
    conn = await getConnection();
    await conn.execute('DELETE FROM role_menus WHERE role_id = ?', [roleId]);
    if (menuIds && menuIds.length > 0) {
      const placeholders = menuIds.map(() => '(?, ?)').join(',');
      const params = menuIds.flatMap((mid: any) => [roleId, mid]);
      await conn.execute(`INSERT INTO role_menus (role_id, menu_id) VALUES ${placeholders}`, params);
    }
    res.json({ code: 200, msg: 'success' });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

// ==================== 核心：获取当前用户权限 ====================

export const getCurrentUserPermissions = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const userId = (req as any).user?.userId;
    conn = await getConnection();

    // 1. 查询用户角色
    const [userRoles] = await conn.execute<RowDataPacket[]>(
      'SELECT role_id FROM user_roles WHERE user_id = ?',
      [userId]
    );
    const roleIds = (userRoles as any[]).map(r => r.role_id);

    if (roleIds.length === 0) {
      return res.json({ code: 200, msg: 'success', data: { roles: [], permissions: [], menus: [], dataScope: 3 } });
    }

    // 2. 查询角色信息
    const [roles] = await conn.execute<RowDataPacket[]>(
      `SELECT id, name, code, data_scope FROM roles_v2 WHERE id IN (${roleIds.join(',')})`
    );

    // 3. 查询菜单权限（包括按钮权限标识）
    const [menus] = await conn.execute<RowDataPacket[]>(
      `SELECT DISTINCT m.id, m.name, m.title, m.path, m.component, m.permission, m.icon, m.parent_id, m.menu_type, m.sort_order
       FROM menus m
       INNER JOIN role_menus rm ON m.id = rm.menu_id
       WHERE rm.role_id IN (${roleIds.join(',')}) AND m.status = 1
       ORDER BY m.parent_id ASC, m.sort_order ASC`
    );

    // 4. 提取按钮权限标识
    const permissions = (menus as any[])
      .filter(m => m.menu_type === 'F' && m.permission)
      .map(m => m.permission);

    // 5. 数据权限（取最小范围）
    const dataScope = Math.min(...(roles as any[]).map(r => r.data_scope));

    // 6. 构建菜单树（只返回目录和菜单）
    const menuTree = buildMenuTree((menus as any[]).filter(m => m.menu_type !== 'F'), 0);

    res.json({
      code: 200,
      msg: 'success',
      data: {
        roles: roles,
        permissions: permissions,
        menus: menuTree,
        dataScope: dataScope || 3
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

function buildMenuTree(items: any[], parentId: number): any[] {
  return items
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      id: item.id,
      name: item.name,
      title: item.title,
      path: item.path,
      component: item.component,
      permission: item.permission,
      icon: item.icon,
      menuType: item.menu_type,
      sortOrder: item.sort_order,
      children: buildMenuTree(items, item.id)
    }));
}
