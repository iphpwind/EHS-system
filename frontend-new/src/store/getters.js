const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    hide: state => state.app.hide,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    user: state => state.user.user,
    permissions: state => state.user.permissions,
    permission_routes: state => state.permission.routes,
    topbarRouters: state => state.permission.topbarRouters,
    defaultRoutes: state => state.permission.defaultRoutes,
    sidebarRouters: state => state.permission.sidebarRouters,
    enabledModules: state => {
        const mods = state.module.modules || []
        return mods.filter(m => m.enabled === 1).map(m => m.module_key)
    }
}
export default getters
