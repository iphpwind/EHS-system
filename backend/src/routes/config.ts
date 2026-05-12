import { Router } from 'express';
import { getConfig, updateConfig, batchUpdateConfig } from '../controllers/configController';
const router = Router();
router.get('/:key', getConfig);
router.get('/', getConfig);
router.put('/:key', updateConfig);
router.post('/batch', batchUpdateConfig);
export default router;
