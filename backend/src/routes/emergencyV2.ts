import { Router, Request, Response, NextFunction } from 'express';
import { getSuppliesList, createSupply, updateSupply, deleteSupply, getContactsList, createContact, getLawList, getLawTypes, createLaw, getHazardReportList, createHazardReport } from '../controllers/emergencyController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// 应急物资
router.get('/supplies', authenticateToken, (req, res, next) => { getSuppliesList(req, res, next).catch(next); });
router.post('/supplies', authenticateToken, (req, res, next) => { createSupply(req, res, next).catch(next); });
router.put('/supplies/:id', authenticateToken, (req, res, next) => { updateSupply(req, res, next).catch(next); });
router.delete('/supplies/:id', authenticateToken, (req, res, next) => { deleteSupply(req, res, next).catch(next); });

// 应急通讯录
router.get('/contacts', authenticateToken, (req, res, next) => { getContactsList(req, res, next).catch(next); });
router.post('/contacts', authenticateToken, (req, res, next) => { createContact(req, res, next).catch(next); });

// 法律法规
router.get('/laws', authenticateToken, (req, res, next) => { getLawList(req, res, next).catch(next); });
router.get('/law-types', authenticateToken, (req, res, next) => { getLawTypes(req, res, next).catch(next); });
router.post('/laws', authenticateToken, (req, res, next) => { createLaw(req, res, next).catch(next); });

// 隐患举报
router.get('/hazard-reports', authenticateToken, (req, res, next) => { getHazardReportList(req, res, next).catch(next); });
router.post('/hazard-reports', authenticateToken, (req, res, next) => { createHazardReport(req, res, next).catch(next); });

export default router;
