import { Router } from 'express';
import { getArchivedPermits, getArchiveById, createArchive, deleteArchive } from '../controllers/archiveController';
const router = Router();
router.get('/', getArchivedPermits);
router.get('/:id', getArchiveById);
router.post('/', createArchive);
router.delete('/:id', deleteArchive);
export default router;
