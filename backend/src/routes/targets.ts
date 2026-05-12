import { Router } from 'express';
import {
  getTargetList, getTargetById, createTarget, updateTarget, deleteTarget, getTargetStats,
  getTemplateList, createTemplate, updateTemplate, deleteTemplate,
  getSigningList, initiateSigning, confirmSigning, approveSigning, rejectSigning
} from '../controllers/targetController';
const router = Router();

// ===== 非:id路由（必须放在/:id之前）=====
router.get('/stats', getTargetStats);
router.get('/templates/list', getTemplateList);
router.post('/templates', createTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);
router.get('/signings/list', getSigningList);
router.post('/signings/initiate', initiateSigning);
router.post('/signings/:id/confirm', confirmSigning);
router.post('/signings/:id/approve', approveSigning);
router.post('/signings/:id/reject', rejectSigning);

// ===== 目标责任书 CRUD（含/:id动态路由）=====
router.get('/', getTargetList);
router.get('/:id', getTargetById);
router.post('/', createTarget);
router.put('/:id', updateTarget);
router.delete('/:id', deleteTarget);

export default router;
