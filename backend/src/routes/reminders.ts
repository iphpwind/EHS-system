import { Router } from 'express';
import { getReminderSettings, createReminderSetting, updateReminderSetting, deleteReminderSetting, getExpiringItems } from '../controllers/reminderController';
const router = Router();
router.get('/expiring', getExpiringItems);
router.get('/', getReminderSettings);
router.post('/', createReminderSetting);
router.put('/:id', updateReminderSetting);
router.delete('/:id', deleteReminderSetting);
export default router;
