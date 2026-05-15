import request from '@/utils/request'

// ========== 气体监测 API ==========

// 获取气体监测列表
export const getGasMonitorList = (params: any) =>
  request.get('/api/gas-monitor', { params })

// 获取最新气体监测数据（实时监测）
export const getLatestGasData = (locationId?: number) =>
  request.get('/api/gas-monitor/latest', { params: { locationId } })

// 获取气体监测统计
export const getGasStats = (params: any) =>
  request.get('/api/gas-monitor/stats', { params })

// 获取气体监测历史趋势
export const getGasTrend = (params: any) =>
  request.get('/api/gas-monitor/trend', { params })

// 获取作业票关联的气体检测记录
export const getTicketGasRecords = (ticketId: number) =>
  request.get(`/api/gas-monitor/ticket/${ticketId}`)

// IoT设备上报气体数据（使用API Key）
export const iotUploadGasData = (data: {
  deviceId: string
  locationId: number
  oxygenPercent?: number
  flammablePercent?: number
  toxicPpm?: number
  toxicType?: string
  temperature?: number
  humidity?: number
  pressure?: number
  deviceCode?: string
}) => request.post('/api/gas-monitor/iot-upload', data)

// 手动录入气体检测记录
export const manualEntryGas = (data: {
  ticketId?: number
  locationId?: number
  checkType?: string
  oxygenPercent: number
  flammablePercent: number
  toxicPpm: number
  toxicType?: string
  checkLocation?: string
  checkerName?: string
  devicePhoto?: string
  scenePhoto?: string
  remark?: string
}) => request.post('/api/gas-monitor/manual', data)

// 更新气体检测记录
export const updateGasRecord = (id: number, data: any) =>
  request.put(`/api/gas-monitor/${id}`, data)

// 删除气体检测记录
export const deleteGasRecord = (id: number) =>
  request.delete(`/api/gas-monitor/${id}`)

// 关联作业票
export const linkTicket = (id: number, ticketId: number) =>
  request.post(`/api/gas-monitor/${id}/link-ticket`, { ticketId })
