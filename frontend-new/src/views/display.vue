<template>
  <div v-if="!isAuthenticated" class="not-authenticated">
    <h2>请先登录</h2>
    <p>访问此页面需要先登录系统。</p>
    <button @click="goLogin">前往登录</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()
const isAuthenticated = ref(false)

onMounted(() => {
  const token = getToken()
  if (!token) {
    isAuthenticated.value = false
    return
  }
  isAuthenticated.value = true
  // 已登录，正常展示大屏（原有展示逻辑在父路由/独立布局中处理）
})

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.not-authenticated {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 18px;
}
.not-authenticated button {
  margin-top: 16px;
  padding: 8px 24px;
  cursor: pointer;
}
</style>
