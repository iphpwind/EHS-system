// 全局类型声明文件（TypeScript 渐进式引入）

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
declare module '*.scss'
declare module '*.css'
declare module '*.json'

// 扩展 Vue 全局属性
import { ComponentCustomProperties } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $echarts: typeof echarts
    $dayjs: typeof dayjs
    $download: (url: string, params: any, filename: string) => Promise<any>
    $parseTime: (time: string | number | Date, pattern?: string) => string
    $resetForm: (refName: string) => void
    $handleTree: (data: any[], id?: string, parentId?: string, children?: string) => any[]
    $addDateRange: (params: any, dateRange: string[], propName?: string) => any
    $selectDictLabel: (datas: any[], value: string | number) => string
    useDict: (...args: string[]) => any
  }
}

// Vite 环境变量声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_WS_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: (pattern: string) => Record<string, () => Promise<any>>
}
