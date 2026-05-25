<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="brand-line">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#1a56db"/>
            <path d="M7 7h5v5H7zM16 7h5v5h-5zM7 16h5v5H7z" fill="white"/>
            <circle cx="21" cy="21" r="3" fill="#93c5fd"/>
          </svg>
          <span class="brand-text">{{ siteName }}</span>
        </div>
        <h2 class="login-title">登录系统</h2>
        <p class="login-desc">欢迎使用安全生产管理平台</p>
      </div>

      <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            size="large"
            type="primary"
            class="login-btn"
            @click.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <span>还没有账号？</span>
        <router-link to="/register" class="register-link">立即注册</router-link>
      </div>

      <div class="login-copyright">
        &copy; {{ new Date().getFullYear() }} {{ siteName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user'
import { useSettingsStore } from '@/store/modules/settings'
import { ElMessage } from "element-plus";

const router = useRouter();

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
};

const loading = ref(false);
const redirect = ref(undefined);
const loginRef = ref(null);

const siteName = computed(() => useSettingsStore().siteName || '安全生产管理平台');

function handleLogin() {
  if (!loginRef.value) return;
  loginRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      const userStore = useUserStore()
      userStore.Login({
        username: loginForm.username,
        password: loginForm.password,
      }).then(() => {
        ElMessage.success("登录成功");
        router.push({ path: redirect.value || "/" });
      }).catch(() => {
        loading.value = false;
      });
    }
  });
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.brand-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.brand-text {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.login-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.login-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 0 14px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #cbd5e1 inset;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(26, 86, 219, 0.2), 0 0 0 1px #1a56db inset;
}

.login-form :deep(.el-input__inner) {
  height: 44px;
  font-size: 14px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1a56db 0%, #2563eb 100%);
  border: none;
  transition: all 0.3s;
}

.login-btn:hover {
  background: linear-gradient(135deg, #1648c0 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(26, 86, 219, 0.3);
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.register-link {
  color: #1a56db;
  text-decoration: none;
  margin-left: 4px;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.login-copyright {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #cbd5e1;
}

@media (max-width: 480px) {
  .login-card {
    width: 100%;
    max-width: 360px;
    padding: 32px 24px;
    margin: 20px;
  }
}
</style>
