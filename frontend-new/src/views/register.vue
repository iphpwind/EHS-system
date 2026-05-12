<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { register } from '@/api/login';
import store from '@/store';
import WaveBg from './login/components/WaveBg.vue';

const router = useRouter();
const siteName = computed(() => store.state.settings.siteName || '安全生产管理平台');

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.password !== value) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { validator: equalToPassword, trigger: 'blur' }
  ]
};

const loading = ref(false);
const registerRef = ref(null);
const themeColor = ref('#1a56db');

function handleRegister() {
  registerRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      register(registerForm).then(res => {
        const username = registerForm.username;
        ElMessageBox.alert(
          `<span style="color:#1a56db;font-weight:600;">恭喜！账号 ${username} 注册成功！</span>`,
          '注册成功',
          {
            dangerouslyUseHTMLString: true,
            type: 'success',
          }
        ).then(() => {
          router.push('/login');
        });
      }).catch(() => {
        loading.value = false;
      });
    }
  });
}
</script>

<template>
  <div class="register-page">
    <WaveBg :theme-color="themeColor" />

    <div class="register-card-wrapper">
      <div class="register-card">
        <!-- 头部 -->
        <header class="register-header">
          <div class="logo-area">
            <div class="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#1a56db"/>
                <path d="M12 12h7v7h-7zM23 12h7v7h-7zM12 23h7v7h-7z" fill="white"/>
                <circle cx="30" cy="30" r="4" fill="#93c5fd"/>
              </svg>
            </div>
            <h1 class="site-name">{{ siteName }}</h1>
          </div>
        </header>

        <!-- 标题 -->
        <div class="register-title-area">
          <h2 class="module-title">账号注册</h2>
          <p class="module-desc">创建您的账号，开始使用平台</p>
        </div>

        <!-- 表单 -->
        <el-form
          ref="registerRef"
          :model="registerForm"
          :rules="registerRules"
          size="large"
          :show-label="false"
          class="register-form"
          @keyup.enter="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入账号"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
              clearable
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="register-submit-btn"
              :loading="loading"
              @click="handleRegister"
            >
              <span v-if="!loading">注 册</span>
              <span v-else>注册中...</span>
            </el-button>
          </el-form-item>

          <div class="login-link">
            <span>已有账号？</span>
            <el-button text type="primary" size="small" @click="router.push('/login')">
              返回登录
            </el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="register-footer">
      <p> {{ new Date().getFullYear() }} {{ siteName }} 版权所有</p>
    </footer>
  </div>
</template>

<style scoped>
.register-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f0f5ff;
}

.register-card-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 460px;
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px 36px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.register-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.site-name {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.register-title-area {
  text-align: center;
  margin-bottom: 28px;
}

.module-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px;
}

.module-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.register-form :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 0 14px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  background: #f8fafc;
  transition: all 0.25s ease;
}

.register-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #cbd5e1 inset;
}

.register-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(26, 86, 219, 0.2), 0 0 0 1px #1a56db inset;
}

.register-form :deep(.el-input__inner) {
  height: 46px;
  font-size: 14px;
}

.register-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.register-submit-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
  letter-spacing: 4px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a56db 0%, #2563eb 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(26, 86, 219, 0.35);
}

.register-submit-btn:hover {
  background: linear-gradient(135deg, #1648c0 0%, #1d4ed8 100%);
  box-shadow: 0 6px 20px rgba(26, 86, 219, 0.45);
  transform: translateY(-1px);
}

.login-link {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.register-footer {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 2;
}

.register-footer p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

@media (max-width: 480px) {
  .register-card-wrapper {
    padding: 16px;
  }
  .register-card {
    padding: 28px 20px 24px;
    border-radius: 16px;
  }
}
</style>
