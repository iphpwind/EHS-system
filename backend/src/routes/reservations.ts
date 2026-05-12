import { Router } from 'express';
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  approveReservation,
  rejectReservation,
  deleteReservation
} from '../controllers/reservationController';

const router = Router();
router.get('/', getReservations);
router.get('/:id', getReservationById);
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.post('/:id/approve', approveReservation);
router.post('/:id/reject', rejectReservation);
router.delete('/:id', deleteReservation);
export default router;
