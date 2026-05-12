import request from '@/utils/request'

// ========== 培训计划 API ==========
export const getTrainingPlans = (params: any) =>
  request.get('/api/training/plans', { params })

export const getTrainingPlanDetail = (id: number) =>
  request.get(`/api/training/plans/${id}`)

export const createTrainingPlan = (data: any) =>
  request.post('/api/training/plans', data)

export const updateTrainingPlan = (id: number, data: any) =>
  request.put(`/api/training/plans/${id}`, data)

export const deleteTrainingPlan = (id: number) =>
  request.delete(`/api/training/plans/${id}`)

// ========== 培训记录 API ==========
export const getTrainingRecords = (params: any) =>
  request.get('/api/training-records', { params })

export const createTrainingRecord = (data: any) =>
  request.post('/api/training-records', data)

export const updateTrainingRecord = (id: number, data: any) =>
  request.put(`/api/training-records/${id}`, data)

export const deleteTrainingRecord = (id: number) =>
  request.delete(`/api/training-records/${id}`)

// ========== V2 课程管理 API ==========
export const getCourses = (params: any) =>
  request.get('/api/training-v2/courses', { params })

export const getCourseDetail = (id: number) =>
  request.get(`/api/training-v2/courses/${id}`)

export const createCourse = (data: any) =>
  request.post('/api/training-v2/courses', data)

export const updateCourse = (id: number, data: any) =>
  request.put(`/api/training-v2/courses/${id}`, data)

export const deleteCourse = (id: number) =>
  request.delete(`/api/training-v2/courses/${id}`)

// ========== V2 题库管理 API ==========
export const getQuestions = (params: any) =>
  request.get('/api/training-v2/questions', { params })

export const createQuestion = (data: any) =>
  request.post('/api/training-v2/questions', data)

export const updateQuestion = (id: number, data: any) =>
  request.put(`/api/training-v2/questions/${id}`, data)

export const deleteQuestion = (id: number) =>
  request.delete(`/api/training-v2/questions/${id}`)

export const batchImportQuestions = (data: any) =>
  request.post('/api/training-v2/questions/batch-import', data)

// ========== V2 试卷管理 API ==========
export const getPapers = (params: any) =>
  request.get('/api/training-v2/papers', { params })

export const getPaperDetail = (id: number) =>
  request.get(`/api/training-v2/papers/${id}`)

export const createPaper = (data: any) =>
  request.post('/api/training-v2/papers', data)

export const updatePaper = (id: number, data: any) =>
  request.put(`/api/training-v2/papers/${id}`, data)

export const deletePaper = (id: number) =>
  request.delete(`/api/training-v2/papers/${id}`)

// ========== V2 在线考试 API ==========
export const getExamResults = (params: any) =>
  request.get('/api/training-v2/exam-results', { params })

export const startExam = (paperId: number) =>
  request.post(`/api/training-v2/exam/start/${paperId}`)

export const submitExam = (data: any) =>
  request.post('/api/training-v2/exam/submit', data)

// ========== V2 证书管理 API ==========
export const getCertificates = (params: any) =>
  request.get('/api/training-v2/certificates', { params })

export const getExpiringCertificates = () =>
  request.get('/api/training-v2/certificates/expiring')

export const getCertificateStats = () =>
  request.get('/api/training-v2/certificates/stats')

export const createCertificate = (data: any) =>
  request.post('/api/training-v2/certificates', data)

export const renewCertificate = (id: number) =>
  request.post(`/api/training-v2/certificates/${id}/renew`)

export const deleteCertificate = (id: number) =>
  request.delete(`/api/training-v2/certificates/${id}`)

// ========== V2 TNA 培训需求矩阵 API ==========
export const getRequiredCourses = (params: any) =>
  request.get('/api/training-v2/tna/required-courses', { params })

export const getTrainingMatrix = (params: any) =>
  request.get('/api/training-v2/tna/matrix', { params })

export const getTrainingTasks = (params: any) =>
  request.get('/api/training-v2/tna/tasks', { params })

// ========== 培训进度 API ==========
export const saveTrainingProgress = (data: any) =>
  request.post('/api/training/progress', data)

export const getTrainingProgress = (recordId: number) =>
  request.get(`/api/training/progress/${recordId}`)

// ========== 考试进度保存 ==========
export const saveExamProgress = (data: {
  paperId: number
  answers: any
  timeLeft: number
}) =>
  request.post('/api/training-v2/exam/save-progress', data)

// ========== 培训统计 API ==========
export const getTrainingStatistics = (params: any) =>
  request.get('/api/training/statistics', { params })

// ========== 培训合规 API（三级教育+年度学时） ==========
export const getThreeLevelTemplates = () => request.get('/api/training-compliance/templates')
export const getMyEducationStatus = () => request.get('/api/training-compliance/my-status')
export const assignThreeLevelEducation = (data: any) => request.post('/api/training-compliance/assign', data)
export const getAnnualCreditReport = (params: any) => request.get('/api/training-compliance/annual-report', { params })
export const preCheckTraining = () => request.get('/api/training-compliance/precheck')
