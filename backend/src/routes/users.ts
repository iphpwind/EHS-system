import { Router, Request, Response, NextFunction } from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  resetPassword 
} from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

/**
 * 获取用户列表
 * GET /api/users
 * 权限：管理员及以上
 */
router.get('/', authenticateToken, authorizeRoles([1, 2]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getUsers(req, res, next);
  } catch (error) {
    console.error('Get users error:', error);
    next(error);
  }
});

/**
 * 获取单个用户详情
 * GET /api/users/:id
 * 权限：管理员及以上，或本人
 */
router.get('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserRole = (req as any).user.role;
    const currentUserId = (req as any).user.userId;
    const targetUserId = parseInt(req.params.id);

    // 普通用户只能查看自己
    if (currentUserRole >= 4 && currentUserId !== targetUserId) {
      return res.status(403).json({ success: false, message: '权限不足' });
    }

    await getUserById(req, res, next);
  } catch (error) {
    console.error('Get user by id error:', error);
    next(error);
  }
});

/**
 * 创建用户
 * POST /api/users
 * 权限：管理员及以上
 */
router.post('/', authenticateToken, authorizeRoles([1, 2]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createUser(req, res, next);
  } catch (error) {
    console.error('Create user error:', error);
    next(error);
  }
});

/**
 * 更新用户
 * PUT /api/users/:id
 * 权限：管理员及以上，或本人
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserRole = (req as any).user.role;
    const currentUserId = (req as any).user.userId;
    const targetUserId = parseInt(req.params.id);

    // 普通用户只能修改自己
    if (currentUserRole >= 4 && currentUserId !== targetUserId) {
      return res.status(403).json({ success: false, message: '权限不足' });
    }

    // 普通用户不能修改角色
    if (currentUserRole >= 4 && req.body.role) {
      return res.status(403).json({ success: false, message: '无权限修改角色' });
    }

    await updateUser(req, res, next);
  } catch (error) {
    console.error('Update user error:', error);
    next(error);
  }
});

/**
 * 删除用户
 * DELETE /api/users/:id
 * 权限：超级管理员
 */
router.delete('/:id', authenticateToken, authorizeRoles([1]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUser(req, res, next);
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
});

/**
 * 重置密码
 * POST /api/users/:id/reset-password
 * 权限：管理员及以上
 */
router.post('/:id/reset-password', authenticateToken, authorizeRoles([1, 2]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await resetPassword(req, res, next);
  } catch (error) {
    console.error('Reset password error:', error);
    next(error);
  }
});

export default router;
