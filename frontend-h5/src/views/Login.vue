<template>
  <div class="login-page">
    <div class="login-header">
      <!-- logo.png 占位，未使用 -->
      <h2>安全生产移动作业</h2>
      <p>登录以继续使用</p>
    </div>

    <van-form @submit="onSubmit" class="login-form">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>

      <div style="margin: 20px 16px;">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          登录
        </van-button>
      </div>
    </van-form>

    <div class="login-footer">
      <p>安全生产移动作业 v1.0</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showNotify } from 'vant'
import request from '../api/request'

const router = useRouter()
const loading = ref(false)

const form = ref({
  username: '',
  password: ''
})

// 提交登录
async function onSubmit() {
  if (loading.value) return
  loading.value = true

  try {
    const res = await request.post('/auth/login', {
      username: form.value.username,
      password: form.value.password
    })

    if (res.data && res.data.access_token) {
      localStorage.setItem('token', res.data.access_token)
      if (res.data.user) {
        localStorage.setItem('userInfo', JSON.stringify(res.data.user))
      }
      showToast({ type: 'success', message: '登录成功' })
      router.replace('/')
    } else {
      showNotify({ type: 'danger', message: res.msg || '登录失败' })
    }
  } catch (error) {
    showNotify({ type: 'danger', message: error.message || '网络错误' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 如果已登录，跳转到首页
  if (localStorage.getItem('token')) {
    router.replace('/')
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.login-header h2 {
  font-size: 28px;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  opacity: 0.8;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.login-form {
  width: 100%;
  max-width: 400px;
}

.login-form .van-cell-group {
  border-radius: 12px;
  overflow: hidden;
}

.login-footer {
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}
</style>
