import { Router } from 'express';
import { hazardToTraining, accidentToTraining, ptwCheck } from '../controllers/integrationController';

const router = Router();

// 隐患→培训联动
router.post('/hazard-to-training', hazardToTraining);

// 事故→培训联动
router.post('/accident-to-training', accidentToTraining);

// PTW 联动检查
router.get('/ptw-check', ptwCheck);

export default router;
