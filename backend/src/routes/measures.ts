import { Router } from 'express';
import { getMeasureLib, createMeasure, updateMeasure, deleteMeasure } from '../controllers/measureController';
const router = Router();
router.get('/lib', getMeasureLib);
router.post('/', createMeasure);
router.put('/:id', updateMeasure);
router.delete('/:id', deleteMeasure);
export default router;
