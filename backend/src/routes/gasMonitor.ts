import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getGasMonitorList,
  getLatestGasData,
  iotUpload,
  manualEntry,
  updateGasRecord,
  deleteGasRecord,
  getGasTrend,
  getGasStats,
  getTicketGasRecords,
  linkTicket
} from '../controllers/gasMonitorController';

const router = Router();

/**
 * 气体监测管理路由
 * 支持IoT设备自动上报和手动录入两种模式
 */

// 列表查询
router.get('/', authenticateToken, getGasMonitorList);

// 最新监测数据（实时监测）
router.get('/latest', authenticateToken, getLatestGasData);

// 历史趋势
router.get('/trend', authenticateToken, getGasTrend);

// 统计数据
router.get('/stats', authenticateToken, getGasStats);

// 作业票关联的气体检测记录
router.get('/ticket/:ticketId', authenticateToken, getTicketGasRecords);

// IoT设备上报（使用API Key认证，不走JWT）
router.post('/iot-upload', iotUpload);

// 手动录入
router.post('/manual', authenticateToken, manualEntry);

// 关联作业票
router.post('/:id/link-ticket', authenticateToken, linkTicket);

// 更新记录
router.put('/:id', authenticateToken, updateGasRecord);

// 删除记录
router.delete('/:id', authenticateToken, deleteGasRecord);

export default router;