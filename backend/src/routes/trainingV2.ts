import { Router } from 'express';
import { getCourseList, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/training/courseController';
import { getQuestionList, createQuestion, updateQuestion, deleteQuestion, batchImportQuestions } from '../controllers/training/questionController';
import { getPaperList, getPaperById, createPaper, updatePaper, deletePaper } from '../controllers/training/examPaperController';
import { getExamResultList, startExam, submitExam } from '../controllers/training/examResultController';
import { getCertificateList, createCertificate, renewCertificate, deleteCertificate, getExpiringCertificates, getCertificateStats } from '../controllers/training/certificateController';
import { getRequiredCourses, getTrainingMatrix, getTrainingTasks } from '../controllers/training/tnaController';
import { getUserArchive, exportArchivePdf } from '../controllers/training/archiveController';

const router = Router();

// 注意：认证由 app.ts 中的全局 authenticateToken 中间件统一处理
// ===== 课程管理 =====
router.get('/courses', getCourseList);
router.get('/courses/:id', getCourseById);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// ===== 题库管理 =====
router.get('/questions', getQuestionList);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/questions/batch-import', batchImportQuestions);

// ===== 试卷管理 =====
router.get('/papers', getPaperList);
router.get('/papers/:id', getPaperById);
router.post('/papers', createPaper);
router.put('/papers/:id', updatePaper);
router.delete('/papers/:id', deletePaper);

// ===== 在线考试 =====
router.get('/exam-results', getExamResultList);
router.post('/exam/start', startExam);
router.post('/exam/submit', submitExam);

// ===== 证书管理 =====
router.get('/certificates/expiring', getExpiringCertificates);
router.get('/certificates/stats', getCertificateStats);
router.get('/certificates', getCertificateList);
router.post('/certificates', createCertificate);
router.post('/certificates/:id/renew', renewCertificate);
router.delete('/certificates/:id', deleteCertificate);

// ===== TNA 培训需求矩阵 =====
router.get('/tna/required-courses', getRequiredCourses);
router.get('/tna/matrix', getTrainingMatrix);
router.get('/tna/tasks', getTrainingTasks);

// ===== 培训档案 =====
router.get('/archive/:userId/pdf', exportArchivePdf);
router.get('/archive/:userId', getUserArchive);

export default router;
