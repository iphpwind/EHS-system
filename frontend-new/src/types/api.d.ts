// API 通用类型声明

/** 通用后端响应结构 */
export interface ApiResult<T = any> {
  code: number
  msg: string
  data: T
  total?: number
  rows?: T[]
}

/** 分页查询参数 */
export interface PageQuery {
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
}

/** 分页响应结构 */
export interface PageResult<T = any> {
  total: number
  rows: T[]
}

/** 登录响应 */
export interface LoginResult {
  access_token: string
  expires_in: number
  token_type?: string
}

/** 用户信息 */
export interface UserInfo {
  userId: number
  userName: string
  nickName?: string
  avatar?: string
  email?: string
  phonenumber?: string
  sex?: string
  dept?: DeptInfo
  roles?: RoleInfo[]
}

/** 部门信息 */
export interface DeptInfo {
  deptId: number
  deptName: string
  parentId?: number
}

/** 角色信息 */
export interface RoleInfo {
  roleId: number
  roleName: string
  roleKey: string
}

/** 路由元信息 */
export interface RouteMeta {
  title?: string
  icon?: string
  noCache?: boolean
  breadcrumb?: boolean
  activeMenu?: string
  hideTop?: boolean
  hideSidebar?: boolean
  affix?: boolean
  roles?: string[]
  permissions?: string[]
}

/** 动态路由项 */
export interface DynamicRoute {
  name: string
  path: string
  hidden?: boolean
  component?: string
  meta?: RouteMeta
  children?: DynamicRoute[]
  redirect?: string
  alwaysShow?: boolean
}

/** 模块配置 */
export interface ModuleConfig {
  moduleId: number
  moduleName: string
  moduleKey: string
  enabled: number
}
