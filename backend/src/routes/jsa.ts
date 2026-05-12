import { Router } from 'express';
import { 
  getJsaAnalysisList,
  getJsaAnalysisById,
  createJsaAnalysis,
  updateJsaAnalysis,
  deleteJsaAnalysis,
  approveJsaAnalysis
} from '../controllers/jsaController';

const router = Router();

router.get('/', getJsaAnalysisList);
router.get('/:id', getJsaAnalysisById);
router.post('/', createJsaAnalysis);
router.put('/:id', updateJsaAnalysis);
router.delete('/:id', deleteJsaAnalysis);
router.post('/:id/approve', approveJsaAnalysis);

export default router;
