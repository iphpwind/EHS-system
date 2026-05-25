import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getHazardList,
  getHazardById,
  createHazard,
  updateHazard,
  deleteHazard,
  submitRectification,
  completeRectification,
  acceptHazard,
  recheckHazard,
  closeHazard,
  getHazardStats,
  getOverdueHazards
} from '../controllers/hazardV2Controller';
import { uploadHazardImages, processUploadedImages, formatUploadResponse } from '../middleware/uploadMiddleware';

const router = Router();

// 隐患图片上传（Phase 3.1 增强：5MB限制 + 水印）
router.post('/upload-images',
  authenticateToken,
  uploadHazardImages.array('images', 5), // 最多5个文件，每个5MB
  processUploadedImages,
  formatUploadResponse
);

// 隐患列表
router.get('/', authenticateToken, getHazardList);

// 隐患详情
router.get('/:id', authenticateToken, getHazardById);

// 新增隐患
router.post('/', authenticateToken, createHazard);

// 更新隐患
router.put('/:id', authenticateToken, updateHazard);

// 删除隐患
router.delete('/:id', authenticateToken, deleteHazard);

// 提交整改（状态 1→2）
router.post('/:id/submit-rectification', authenticateToken, submitRectification);

// 完成整改（状态 2→3）
router.post('/:id/complete-rectification', authenticateToken, completeRectification);

// 验收隐患（状态 3→4 或 3→2）
router.post('/:id/accept', authenticateToken, acceptHazard);

// 复查隐患（状态 4→2）
router.post('/:id/recheck', authenticateToken, recheckHazard);

// 关闭隐患（状态 1→5）
router.post('/:id/close', authenticateToken, closeHazard);

// 隐患统计
router.get('/stats/overview', authenticateToken, getHazardStats);

// 逾期隐患列表
router.get('/stats/overdue', authenticateToken, getOverdueHazards);

export default router;