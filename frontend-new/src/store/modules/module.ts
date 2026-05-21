import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listModules } from '@/api/system/moduleConfig'

export const useModuleStore = defineStore('module', () => {
  const modules = ref<any[]>([])

  const LoadModules = async () => {
    const res = await listModules()
    const data = res.data || []
    modules.value = data
    return data
  }

  const getEnabledModuleKeys = () => {
    return modules.value.filter(m => m.enabled === 1).map(m => m.module_key)
  }

  return {
    modules,
    LoadModules,
    getEnabledModuleKeys
  }
})
