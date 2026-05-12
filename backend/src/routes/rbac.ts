import { Router } from 'express';
import {
  getRoles, getRoleOptions, createRole, updateRole, deleteRole,
  getMenus, getMenuTree, createMenu, updateMenu, deleteMenu,
  getUserRoles, assignUserRoles,
  getRoleMenus, assignRoleMenus,
  getCurrentUserPermissions
} from '../controllers/rbacController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// 角色管理
router.get('/roles', authenticateToken, getRoles);
router.get('/roles/options', authenticateToken, getRoleOptions);
router.post('/roles', authenticateToken, createRole);
router.put('/roles/:id', authenticateToken, updateRole);
router.delete('/roles/:id', authenticateToken, deleteRole);

// 菜单管理
router.get('/menus', authenticateToken, getMenus);
router.get('/menus/tree', authenticateToken, getMenuTree);
router.post('/menus', authenticateToken, createMenu);
router.put('/menus/:id', authenticateToken, updateMenu);
router.delete('/menus/:id', authenticateToken, deleteMenu);

// 用户角色
router.get('/users/:userId/roles', authenticateToken, getUserRoles);
router.post('/users/:userId/roles', authenticateToken, assignUserRoles);

// 角色菜单
router.get('/roles/:roleId/menus', authenticateToken, getRoleMenus);
router.post('/roles/:roleId/menus', authenticateToken, assignRoleMenus);

// 当前用户权限（核心）
router.get('/permissions/me', authenticateToken, getCurrentUserPermissions);

export default router;
