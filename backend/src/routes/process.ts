import { Router } from 'express';
import { getProcessLogs, createProcessLog, deleteProcessLog } from '../controllers/processController';
const router = Router();
router.get('/', getProcessLogs);
router.get('/:id', getProcessLogs);
router.post('/', createProcessLog);
router.delete('/:id', deleteProcessLog);
export default router;
