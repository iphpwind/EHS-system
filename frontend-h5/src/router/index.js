import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/', component: () => import('../views/Home.vue'), meta: { requiresAuth: true } },

  // ===== 隐患管理 =====
  { path: '/hazards/list', component: () => import('../views/hazards/List.vue'), meta: { requiresAuth: true } },
  { path: '/hazard/report', component: () => import('../views/hazards/Report.vue'), meta: { requiresAuth: true } },
  { path: '/hazard/detail/:id', component: () => import('../views/hazards/Detail.vue'), meta: { requiresAuth: true } },

  // ===== 作业票（原有动火 + 新增通用） =====
  { path: '/apply', component: () => import('../views/HotWorkApply.vue'), meta: { requiresAuth: true } },
  { path: '/detail/:id', component: () => import('../views/HotWorkDetail.vue'), meta: { requiresAuth: true } },
  { path: '/gas/:id', component: () => import('../views/GasCheck.vue'), meta: { requiresAuth: true } },
  { path: '/workticket/apply', component: () => import('../views/WorkTicketApply.vue'), meta: { requiresAuth: true } },
  { path: '/workticket/list', component: () => import('../views/WorkTicketList.vue'), meta: { requiresAuth: true } },
  { path: '/workticket/detail/:id', component: () => import('../views/WorkTicketDetail.vue'), meta: { requiresAuth: true } },

  // ===== 签字 =====
  { path: '/sign/:bizType/:bizId/:signType', component: () => import('../views/Signature.vue'), meta: { requiresAuth: true } },

  // ===== 应急管理 =====
  { path: '/emergency', component: () => import('../views/EmergencyList.vue'), meta: { requiresAuth: true } },

  // ===== 培训教育 =====
  { path: '/training/learn/:id', component: () => import('../views/training/Learn.vue'), meta: { requiresAuth: true } },
  { path: '/training/exam/:paperId', component: () => import('../views/training/Exam.vue'), meta: { requiresAuth: true } },
  { path: '/training/certificates', component: () => import('../views/training/Certificate.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
