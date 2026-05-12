import router from './router'
import store from './store'
import {ElMessage} from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from '@/utils/auth'
import {isHttp} from '@/utils/validate'
import {isRelogin} from '@/utils/request'

NProgress.configure({showSpinner: false});

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/display_v2','/system/visitor/index','/system/visitor/form','/system/visitor/card'];
let siteNameFetched = false;

router.beforeEach((to, from, next) => {
    NProgress.start()
    // 启动时获取系统名称（仅执行一次）
    if (!siteNameFetched) {
        store.dispatch('settings/fetchSiteName').catch(() => {})
        siteNameFetched = true
    }
    if (getToken()) {
        to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
        /* has token*/
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else {
            if (store.getters.roles.length === 0) {
                isRelogin.show = true
                // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GetInfo').then(() => {
                    isRelogin.show = false
                    // 先加载模块配置，再生成路由
                    store.dispatch('LoadModules').catch(() => {}).finally(() => {
                        store.dispatch('GenerateRoutes').then(accessRoutes => {
                            // 根据roles权限生成可访问的路由表
                            accessRoutes.forEach(route => {
                                if (!isHttp(route.path)) {
                                    router.addRoute(route)
                                }
                            })
                            // 确保 sidebarRouters 有数据
                            const sidebarRouters = store.getters.sidebarRouters || []
                            if (sidebarRouters.length === 0) {
                                console.warn('[Permission] sidebarRouters is empty, resetting...')
                                store.commit('SET_SIDEBAR_ROUTERS', store.getters.defaultRoutes || [])
                            }
                            // 确保顶部导航显示
                            store.dispatch('app/topHide', true).catch(() => {})
                            store.dispatch('app/toggleSideBarHide', false).catch(() => {})
                            next({...to, replace: true})
                        }).catch(err => {
                            console.error('[Permission] GenerateRoutes failed:', err)
                            ElMessage.error('路由加载失败，请刷新页面重试')
                            next()
                        })
                    })
                }).catch(err => {
                    store.dispatch('LogOut').then(() => {
                        ElMessage.error(err)
                        next({path: '/'})
                    })
                })
            } else {
                next()
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1 || to.path === '/display') {
            // 在免登录白名单，直接进入
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
