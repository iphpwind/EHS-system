/**
 * 作业票 API 动态加载工具
 * 根据作业类型动态导入对应的 API 模块
 */

const MODULE_MAP: Record<string, string> = {
  firework:      '@/api/safework/firework',
  restricted:    '@/api/safework/restrictedwork',
  highwork:      '@/api/safework/highwork',
  hoistingwork:  '@/api/safework/hoistingwork',
  earth:         '@/api/safework/earth',
  broken:        '@/api/safework/brokenInfo',
  blind:         '@/api/safework/blindConfirmation',
  electricwork:  '@/api/safework/electricwork',
}

/**
 * 动态加载作业票 API 模块
 * @param ticketType 作业类型
 * @returns API 模块
 */
export const loadWorkTicketApi = async (ticketType: string) => {
  const modulePath = MODULE_MAP[ticketType]
  if (!modulePath) {
    console.warn(`[apiHelper] 未知的作业类型: ${ticketType}，降级为 firework`)
    return await import(MODULE_MAP.firework)
  }
  return await import(/* @vite-ignore */ modulePath)
}

/**
 * 从模块中解析 add/create 函数
 */
export const resolveAddFn = (mod: any, ticketType: string) => {
  const map: Record<string, string> = {
    firework: 'addFirework',
    restricted: 'addRestrictedwork',
    highwork: 'addHighwork',
    hoistingwork: 'addHoistingwork',
    earth: 'addEarth',
    broken: 'addBrokenInfo',
    blind: 'addBlindConfirmation',
    electricwork: 'addElectricwork',
  }
  const fnName = map[ticketType]
  return fnName ? mod[fnName] : mod.addFirework
}

/**
 * 从模块中解析 update 函数
 */
export const resolveUpdateFn = (mod: any, ticketType: string) => {
  const map: Record<string, string> = {
    firework: 'updateFirework',
    restricted: 'updateRestrictedwork',
    highwork: 'updateHighwork',
    hoistingwork: 'updateHoistingwork',
    earth: 'updateEarth',
    broken: 'updateBrokenInfo',
    blind: 'updateBlindConfirmation',
    electricwork: 'updateElectricwork',
  }
  const fnName = map[ticketType]
  return fnName ? mod[fnName] : mod.updateFirework
}

/**
 * 从模块中解析 get/detail 函数
 */
export const resolveGetFn = (mod: any, ticketType: string) => {
  const map: Record<string, string> = {
    firework: 'getFirework',
    restricted: 'getRestrictedwork',
    highwork: 'getHighwork',
    hoistingwork: 'getHoistingwork',
    earth: 'getEarth',
    broken: 'getBrokenInfo',
    blind: 'getBlindConfirmation',
    electricwork: 'getElectricwork',
  }
  const fnName = map[ticketType]
  return fnName ? mod[fnName] : mod.getHotWork
}

/**
 * 从模块中解析 submit/审批提交流函数
 */
export const resolveSubmitFn = (mod: any, ticketType: string) => {
  const map: Record<string, string> = {
    firework: 'submitHotWork',
    restricted: 'submitRestrictedwork',
    highwork: 'submitHighwork',
    hoistingwork: 'submitHoistingwork',
    earth: 'submitEarth',
    broken: 'submitBrokenInfo',
    blind: 'submitBlindConfirmation',
    electricwork: 'submitElectricwork',
  }
  const fnName = map[ticketType]
  return fnName ? mod[fnName] : mod.submitHotWork
}
