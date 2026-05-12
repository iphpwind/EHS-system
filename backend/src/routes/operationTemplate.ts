import { Router } from 'express';
import { list, getById, create, update, remove, configure } from '../controllers/operationTemplateController';

const router = Router();

router.get('/list', list);
router.get('/:id', getById);
router.post('/', create);
router.put('/', update);
router.delete('/:id', remove);
router.post('/configure', configure);

export default router;
