import router from './router'
import { useUserStore } from './store/modules/user.ts'
import { usePermissionStore } from './store/modules/permission.ts'
import { useSettingsStore } from './store/modules/settings.ts'
import { useAppStore } from './store/modules/app.ts'
import { useModuleStore } from './store/modules/module.ts'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/display_v2', '/system/visitor/index', '/system/visitor/form', '/system/visitor/card'];
let siteNameFetched = false;

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    const settingsStore = useSettingsStore()
    const appStore = useAppStore()
    const moduleStore = useModuleStore()

    if (!siteNameFetched) {
        settingsStore.fetchSiteName().catch(() => {})
        siteNameFetched = true
    }

    if (getToken()) {
        to.meta.title && settingsStore.setTitle(to.meta.title)
        
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            if (userStore.roles.length === 0) {
                isRelogin.show = true
                try {
                    await userStore.GetInfo()
                    isRelogin.show = false
                    
                    await moduleStore.LoadModules().catch(() => {})
                    
                    const accessRoutes = await permissionStore.GenerateRoutes(moduleStore.getEnabledModuleKeys())
                    
                    accessRoutes.forEach(route => {
                        if (!isHttp(route.path)) {
                            router.addRoute(route)
                        }
                    })
                    
                    const sidebarRouters = permissionStore.sidebarRouters || []
                    if (sidebarRouters.length === 0) {
                        console.warn('[Permission] sidebarRouters is empty')
                    }
                    
                    appStore.topHide(true)
                    
                    next({ ...to, replace: true })
                } catch (err) {
                    console.error('[Permission] Route generation failed:', err)
                    await userStore.LogOut()
                    ElMessage.error(err.message || '登录状态失效，请重新登录')
                    next({ path: '/' })
                }
            } else {
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1 || to.path === '/display') {
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
