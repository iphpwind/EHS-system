import request from '@/utils/request'

// ========== 三级教育记录 CRUD ==========

/** 分页查询三级教育记录 */
export const listThreeLevel = (params: any) =>
  request.get('/api/training-compliance/records', { params })

/** 获取单条三级教育记录 */
export const getThreeLevelDetail = (id: number) =>
  request.get(`/api/training-compliance/records/${id}`)

/** 新增三级教育记录 */
export const addThreeLevel = (data: any) =>
  request.post('/api/training-compliance/records', data)

/** 更新三级教育记录 */
export const updateThreeLevel = (data: any) =>
  request.put(`/api/training-compliance/records/${data.id}`, data)

/** 提交考核结果 */
export const assessThreeLevel = (data: any) =>
  request.post(`/api/training-compliance/records/${data.id}/assess`, data)

// ========== 三级教育模板 ==========

/** 获取三级教育模板列表 */
export const getThreeLevelTemplates = () =>
  request.get('/api/training-compliance/templates')

/** 更新三级教育模板 */
export const updateThreeLevelTemplate = (id: number, data: any) =>
  request.put(`/api/training-compliance/templates/${id}`, data)

// ========== 分配 & 状态查询 ==========

/** 为用户分配三级教育 */
export const assignThreeLevelEducation = (data: any) =>
  request.post('/api/training-compliance/assign', data)

/** 获取当前登录用户三级教育状态 */
export const getMyEducationStatus = () =>
  request.get('/api/training-compliance/my-status')

/** 获取指定用户三级教育状态 */
export const getEducationStatus = (userId: number) =>
  request.get(`/api/training-compliance/status/${userId}`)

// ========== 年度学时报表 ==========

/** 获取年度学时报表 */
export const getAnnualCreditReport = (params: any) =>
  request.get('/api/training-compliance/annual-report', { params })

/** 学时换算计算器 */
export const getCreditCalculation = (minutes: number) =>
  request.get('/api/training-compliance/credit-calc', { params: { minutes } })
