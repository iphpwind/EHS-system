import { Router } from 'express';
import { getEquipmentList, getEquipmentById, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController';
const router = Router();
router.get('/', getEquipmentList);
router.get('/:id', getEquipmentById);
router.post('/', createEquipment);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);
export default router;
