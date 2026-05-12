import {constantRoutes} from '@/router'
import {getRouters} from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const permission = {
    state: {
        routes: [],
        addRoutes: [],
        defaultRoutes: [],
        topbarRouters: [],
        sidebarRouters: []
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        },
        SET_DEFAULT_ROUTES: (state, routes) => {
            state.defaultRoutes = constantRoutes.concat(routes)
        },
        SET_TOPBAR_ROUTES: (state, routes) => {
            state.topbarRouters = routes
        },
        SET_SIDEBAR_ROUTERS: (state, routes) => {
            state.sidebarRouters = routes
        },
    },
    actions: {
        // 生成路由
        GenerateRoutes({commit, rootState}) {
            return new Promise(resolve => {
                // 向后端请求路由数据
                getRouters().then(res => {
                    let data = res.data || []
                    // 根据模块开关过滤路由
                    const enabledModules = (rootState.module.modules || [])
                        .filter(m => m.enabled === 1).map(m => m.module_key)
                    if (enabledModules.length > 0) {
                        data = filterByModules(data, enabledModules)
                    }
                    const sdata = JSON.parse(JSON.stringify(data))
                    const rdata = JSON.parse(JSON.stringify(data))
                    const defaultData = JSON.parse(JSON.stringify(data))
                    const sidebarRoutes = filterAsyncRouter(sdata)
                    const rewriteRoutes = filterAsyncRouter(rdata, false, true)
                    const defaultRoutes = filterAsyncRouter(defaultData)
                    commit('SET_ROUTES', rewriteRoutes)
                    commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
                    commit('SET_DEFAULT_ROUTES', sidebarRoutes)
                    commit('SET_TOPBAR_ROUTES', defaultRoutes)
                    resolve(rewriteRoutes)
                })
            })
        }
    }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
    return asyncRouterMap.filter(route => {
        if (type && route.children) {
            route.children = filterChildren(route.children)
        }
        if (route.component) {
            // Layout ParentView 组件特殊处理
            if (route.component === 'Layout') {
                route.component = Layout
            } else if (route.component === 'ParentView') {
                route.component = ParentView
            } else if (route.component === 'InnerLink') {
                route.component = InnerLink
            } else {
                const viewLoader = loadView(route.component)
                if (!viewLoader) {
                    console.warn(`[Permission] 未找到组件: ${route.component}, 路径: ${route.path}`)
                    // 使用空组件降级，避免路由报错
                    route.component = { template: '<div style="padding:20px">页面组件加载失败</div>' }
                } else {
                    route.component = viewLoader
                }
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, route, type)
        } else {
            delete route['children']
            delete route['redirect']
        }
        return true
    })
}

function filterChildren(childrenMap, lastRouter = false) {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView' && !lastRouter) {
                el.children.forEach(c => {
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        children = children.concat(filterChildren(c.children, c))
                        return
                    }
                    children.push(c)
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        children = children.concat(el)
    })
    return children
}

// 组件路径缓存，避免每次循环查找
const viewCache = new Map()

export const loadView = (view) => {
    if (viewCache.has(view)) {
        return viewCache.get(view)
    }
    let res;
    for (const path in modules) {
        const dir = path.split('views/')[1].split('.vue')[0];
        if (dir === view) {
            res = () => modules[path]().catch(err => {
                console.error(`[Permission] 组件加载失败: ${view}`, err)
                // 返回一个空组件作为降级处理
                return { default: { template: '<div style="padding:20px;color:red">组件加载失败</div>' } }
            });
            break
        }
    }
    if (res) viewCache.set(view, res)
    return res;
}

// 根据模块开关过滤路由
function filterByModules(routes, enabledModules) {
    if (!enabledModules || enabledModules.length === 0) return routes
    const modulePathMap = {
        'safework': ['/safework'],
        'hazard': ['/hazard'],
        'equipment': ['/equipment'],
        'training': ['/training'],
        'emergency': ['/emergency'],
        'contractor': ['/contractor'],
        'energy': ['/energy'],
        'environment': ['/environment'],
        'sensor': ['/sensor'],
        'system': ['/system']
    }
    return routes.filter(route => {
        let keep = true
        for (const mod of Object.keys(modulePathMap)) {
            if (!enabledModules.includes(mod)) {
                const paths = modulePathMap[mod]
                for (const p of paths) {
                    if (route.path && route.path.startsWith(p)) {
                        keep = false
                        break
                    }
                }
            }
            if (!keep) break
        }
        if (keep && route.children && route.children.length) {
            route.children = filterByModules(route.children, enabledModules)
        }
        return keep
    })
}

export default permission
