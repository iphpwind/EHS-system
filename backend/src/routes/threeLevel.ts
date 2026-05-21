import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  listThreeLevel,
  getThreeLevelDetail,
  addThreeLevel,
  updateThreeLevel,
  assessThreeLevel,
  deleteThreeLevel
} from '../controllers/threeLevelController';

const router = Router();

// 三级安全教育档案（P1-2 培训合规）
router.get('/', authenticateToken, listThreeLevel);
router.get('/:id', authenticateToken, getThreeLevelDetail);
router.post('/', authenticateToken, addThreeLevel);
router.put('/:id', authenticateToken, updateThreeLevel);
router.post('/:id/assess', authenticateToken, assessThreeLevel);
// router.delete('/:id', authenticateToken, deleteThreeLevel);  // 临时注释：deleteThreeLevel 未定义

export default router;
