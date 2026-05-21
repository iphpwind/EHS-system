import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref<any[]>([])
  const cachedViews = ref<string[]>([])

  const addVisitedView = (view: any) => {
    if (visitedViews.value.some(v => v.path === view.path)) return
    visitedViews.value.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
  }

  const addCachedView = (view: any) => {
    if (cachedViews.value.includes(view.name)) return
    if (!view.meta?.noCache) {
      cachedViews.value.push(view.name)
    }
  }

  const addView = (view: any) => {
    addVisitedView(view)
    addCachedView(view)
  }

  const delVisitedView = (view: any) => {
    for (const [i, v] of visitedViews.value.entries()) {
      if (v.path === view.path) {
        visitedViews.value.splice(i, 1)
        break
      }
    }
  }

  const delCachedView = (view: any) => {
    const index = cachedViews.value.indexOf(view.name)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  const delView = (view: any) => {
    delVisitedView(view)
    delCachedView(view)
    return {
      visitedViews: [...visitedViews.value],
      cachedViews: [...cachedViews.value]
    }
  }

  const delOthersVisitedViews = (view: any) => {
    visitedViews.value = visitedViews.value.filter(v => {
      return v.meta?.affix || v.path === view.path
    })
  }

  const delOthersCachedViews = (view: any) => {
    const index = cachedViews.value.indexOf(view.name)
    if (index > -1) {
      cachedViews.value = cachedViews.value.slice(index, index + 1)
    } else {
      cachedViews.value = []
    }
  }

  const delOthersViews = (view: any) => {
    delOthersVisitedViews(view)
    delOthersCachedViews(view)
    return {
      visitedViews: [...visitedViews.value],
      cachedViews: [...cachedViews.value]
    }
  }

  const delAllVisitedViews = () => {
    const affixTags = visitedViews.value.filter(tag => tag.meta?.affix)
    visitedViews.value = affixTags
  }

  const delAllCachedViews = () => {
    cachedViews.value = []
  }

  const delAllViews = () => {
    delAllVisitedViews()
    delAllCachedViews()
    return {
      visitedViews: [...visitedViews.value],
      cachedViews: [...cachedViews.value]
    }
  }

  const updateVisitedView = (view: any) => {
    for (let v of visitedViews.value) {
      if (v.path === view.path) {
        Object.assign(v, view)
        break
      }
    }
  }

  const delRightViews = (view: any) => {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index === -1) return
    visitedViews.value = visitedViews.value.filter((item, idx) => {
      if (idx <= index || (item.meta && item.meta.affix)) {
        return true
      }
      const i = cachedViews.value.indexOf(item.name)
      if (i > -1) {
        cachedViews.value.splice(i, 1)
      }
      return false
    })
  }

  const delLeftViews = (view: any) => {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index === -1) return
    visitedViews.value = visitedViews.value.filter((item, idx) => {
      if (idx >= index || (item.meta && item.meta.affix)) {
        return true
      }
      const i = cachedViews.value.indexOf(item.name)
      if (i > -1) {
        cachedViews.value.splice(i, 1)
      }
      return false
    })
  }

  const delRightTags = (view: any) => {
    delRightViews(view)
    return [...visitedViews.value]
  }

  const delLeftTags = (view: any) => {
    delLeftViews(view)
    return [...visitedViews.value]
  }

  return {
    visitedViews,
    cachedViews,
    addView,
    addVisitedView,
    addCachedView,
    delView,
    delVisitedView,
    delCachedView,
    delOthersViews,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    updateVisitedView,
    delRightTags,
    delLeftTags
  }
})
