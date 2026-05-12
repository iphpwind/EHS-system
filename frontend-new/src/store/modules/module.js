import { listModules } from '@/api/system/moduleConfig'

const moduleStore = {
  state: {
    modules: []
  },
  mutations: {
    SET_MODULES: (state, modules) => {
      state.modules = modules
    }
  },
  actions: {
    LoadModules({ commit }) {
      return new Promise((resolve, reject) => {
        listModules().then(res => {
          const data = res.data || []
          commit('SET_MODULES', data)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default moduleStore
