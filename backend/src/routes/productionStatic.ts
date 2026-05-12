import { Router } from 'express';
import { getProductionStaticList, getProductionStaticById, createProductionStatic, updateProductionStatic, deleteProductionStatic } from '../controllers/productionStaticController';
const router = Router();
router.get('/', getProductionStaticList);
router.get('/:id', getProductionStaticById);
router.post('/', createProductionStatic);
router.put('/:id', updateProductionStatic);
router.delete('/:id', deleteProductionStatic);
export default router;
