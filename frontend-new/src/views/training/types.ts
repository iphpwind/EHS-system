// ========== 培训计划类型 ==========
export interface TrainingPlan {
  id?: number
  name: string
  description?: string
  startDate: string
  endDate: string
  courseIds: number[]
  departmentIds: number[]
  status: 'pending' | 'ongoing' | 'completed'
  progress?: number
  createdAt?: string
  updatedAt?: string
}

// ========== 培训记录类型 ==========
export interface TrainingRecord {
  id?: number
  planId: number
  userId: number
  courseId: number
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  score?: number
  completedAt?: string
  createdAt?: string
}

// ========== 课程类型 ==========
export interface Course {
  id?: number
  title: string
  description?: string
  content?: string
  coverImage?: string
  videoUrl?: string
  duration: number
  categoryId?: number
  status: 'draft' | 'published' | 'archived'
  createdAt?: string
  updatedAt?: string
}

// ========== 题目类型 ==========
export interface Question {
  id?: number
  type: 'single' | 'multiple' | 'true_false' | 'short_answer'
  content: string
  options?: QuestionOption[]
  answer: string
  score: number
  categoryId?: number
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt?: string
}

export interface QuestionOption {
  label: string
  text: string
}

// ========== 试卷类型 ==========
export interface ExamPaper {
  id?: number
  title: string
  description?: string
  duration: number
  totalScore: number
  passingScore: number
  questionIds: number[]
  status: 'draft' | 'published' | 'archived'
  createdAt?: string
  updatedAt?: string
}

// ========== 考试结果类型 ==========
export interface ExamResult {
  id?: number
  paperId: number
  userId: number
  answers: Record<number, string>
  score?: number
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded'
  startedAt?: string
  submittedAt?: string
  createdAt?: string
}

// ========== 证书类型 ==========
export interface Certificate {
  id?: number
  userId: number
  courseId?: number
  paperId?: number
  certificateNo: string
  issueDate: string
  expiryDate: string
  status: 'valid' | 'expired' | 'revoked'
  createdAt?: string
}

// ========== 查询参数类型 ==========
export interface QueryParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
  startDate?: string
  endDate?: string
  [key: string]: any
}

// ========== API 响应类型 ==========
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data?: T
  total?: number
}
