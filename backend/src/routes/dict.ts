import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getDictTypeList,
  getDictTypeById,
  createDictType,
  updateDictType,
  deleteDictType,
  getDictDataByType,
  getDictDataList,
  createDictData,
  updateDictData,
  deleteDictData
} from '../controllers/dictController';

const router = Router();

// 字典类型管理
router.get('/type/list', authenticateToken, getDictTypeList);
router.get('/type/:id', authenticateToken, getDictTypeById);
router.post('/type', authenticateToken, createDictType);
router.put('/type/:id', authenticateToken, updateDictType);
router.delete('/type/:id', authenticateToken, deleteDictType);

// 字典数据管理
router.get('/data/list', authenticateToken, getDictDataList);
router.get('/data/type/:dictType', authenticateToken, getDictDataByType);
router.post('/data', authenticateToken, createDictData);
router.put('/data/:id', authenticateToken, updateDictData);
router.delete('/data/:id', authenticateToken, deleteDictData);

export default router;
