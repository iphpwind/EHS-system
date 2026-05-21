import { defineStore } from 'pinia'
import { ref } from 'vue'
import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

const modules = import.meta.glob('./../../views/**/*.vue')

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<any[]>([])
  const addRoutes = ref<any[]>([])
  const defaultRoutes = ref<any[]>([])
  const topbarRouters = ref<any[]>([])
  const sidebarRouters = ref<any[]>([])

  const GenerateRoutes = async (enabledModules?: string[]) => {
    const res = await getRouters()
    let data = res.data || []
    
    if (enabledModules && enabledModules.length > 0) {
      data = filterByModules(data, enabledModules)
    }
    
    const sdata = JSON.parse(JSON.stringify(data))
    const rdata = JSON.parse(JSON.stringify(data))
    const defaultData = JSON.parse(JSON.stringify(data))
    
    const sidebarRoutes = filterAsyncRouter(sdata)
    const rewriteRoutes = filterAsyncRouter(rdata, false, true)
    const defaultRoutesData = filterAsyncRouter(defaultData)
    
    addRoutes.value = rewriteRoutes
    routes.value = constantRoutes.concat(rewriteRoutes)
    sidebarRouters.value = constantRoutes.concat(sidebarRoutes)
    defaultRoutes.value = sidebarRoutes
    topbarRouters.value = defaultRoutesData
    
    return rewriteRoutes
  }

  const filterAsyncRouter = (asyncRouterMap: any[], lastRouter = false, type = false) => {
    return asyncRouterMap.filter(route => {
      if (type && route.children) {
        route.children = filterChildren(route.children)
      }
      if (route.component) {
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

  const filterChildren = (childrenMap: any[], lastRouter = false) => {
    const children: any[] = []
    childrenMap.forEach((el) => {
      if (el.children && el.children.length) {
        if (el.component === 'ParentView' && !lastRouter) {
          el.children.forEach(c => {
            c.path = el.path + '/' + c.path
            if (c.children && c.children.length) {
              children.push(...filterChildren(c.children, c))
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
      children.push(el)
    })
    return children
  }

  const viewCache = new Map()

  const loadView = (view: string) => {
    if (viewCache.has(view)) {
      return viewCache.get(view)
    }
    let res
    for (const path in modules) {
      const dir = path.split('views/')[1].split('.vue')[0]
      if (dir === view) {
        res = () => modules[path]().catch(err => {
          console.error(`[Permission] 组件加载失败: ${view}`, err)
          return { default: { template: '<div style="padding:20px;color:red">组件加载失败</div>' } }
        })
        break
      }
    }
    if (res) viewCache.set(view, res)
    return res
  }

  const filterByModules = (routes: any[], enabledModules: string[]) => {
    if (!enabledModules || enabledModules.length === 0) return routes
    const modulePathMap: Record<string, string[]> = {
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

  return {
    routes,
    addRoutes,
    defaultRoutes,
    topbarRouters,
    sidebarRouters,
    GenerateRoutes,
    loadView
  }
})
