import { Router } from 'express';
import { getCompanyInfo, updateCompanyInfo } from '../controllers/companyController';
const router = Router();
router.get('/', getCompanyInfo);
router.put('/', updateCompanyInfo);
export default router;
