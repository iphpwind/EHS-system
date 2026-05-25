import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getCOSUploadSignature,
  onVideoUploaded,
  getVideoPlayAuth,
  logExamViolation,
  getExamViolations
} from '../controllers/trainingVideoController';

const router = Router();

// ============ 视频上传（腾讯云 COS） ============

// 获取上传签名（前端直传 COS 用）
router.post('/video/upload-signature', authenticateToken, getCOSUploadSignature);

// 视频上传成功回调（前端直传 COS 后调用）
router.post('/video/uploaded', authenticateToken, onVideoUploaded);

// 获取视频播放地址（带签名，防止盗链）
router.get('/video/play-auth', authenticateToken, getVideoPlayAuth);

// ============ 考试防作弊（异常行为记录） ============

// 记录考试异常行为
router.post('/exam/violation', authenticateToken, logExamViolation);

// 获取考试异常行为记录（教师查看）
router.get('/exam/:examId/violations', authenticateToken, getExamViolations);

export default router;
