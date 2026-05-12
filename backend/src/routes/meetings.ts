import { Router } from 'express';
import { getMeetingList, getMeetingById, createMeeting, updateMeeting, deleteMeeting } from '../controllers/meetingController';
const router = Router();
router.get('/', getMeetingList);
router.get('/:id', getMeetingById);
router.post('/', createMeeting);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);
export default router;
