import { Router } from 'express';
import { getModules, updateModuleStatus, batchUpdateModules } from '../controllers/moduleConfigController';

const router = Router();

// 获取所有模块配置
router.get('/', getModules);

// 更新单个模块状态
router.put('/:moduleKey', updateModuleStatus);

// 批量更新模块状态
router.put('/', batchUpdateModules);

export default router;
