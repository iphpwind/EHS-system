<script setup>
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/modules/user';

const emit = defineEmits(['register', 'forgot']);
const userStore = useUserStore()

const router = useRouter();
const loginForm = reactive({
  username: '',
  password: ''
});

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
};

const loading = ref(false);
const rememberMe = ref(false);
const loginRef = ref(null);

// 快速账号（开发环境）
const isDev = import.meta.env.DEV;
const accounts = isDev ? [
  { label: '超级管理员', username: 'admin', password: 'admin123' },
  { label: '普通用户', username: 'ry', password: '123456' }
] : [];

onMounted(() => {
  const saved = localStorage.getItem('login-remember');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      loginForm.username = data.username || '';
      loginForm.password = data.password || '';
      rememberMe.value = true;
    } catch (e) {
      localStorage.removeItem('login-remember');
    }
  }
});

function handleLogin() {
  if (!loginRef.value) return;
  loginRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      userStore.Login({
        username: loginForm.username,
        password: loginForm.password
      }).then(() => {
        ElMessage.success({ message: '登录成功', plain: true });
        if (rememberMe.value) {
          localStorage.setItem('login-remember', JSON.stringify({
            username: loginForm.username,
            password: loginForm.password
          }));
        } else {
          localStorage.removeItem('login-remember');
        }
        router.push({ path: '/' });
      }).catch(() => {
        loading.value = false;
      });
    }
  });
}

function handleAccountLogin(account) {
  loginForm.username = account.username;
  loginForm.password = account.password;
  handleLogin();
}
</script>

<template>
  <el-form
    ref="loginRef"
    :model="loginForm"
    :rules="loginRules"
    size="large"
    class="pwd-login-form"
    @keyup.enter="handleLogin"
  >
    <!-- 账号 -->
    <el-form-item prop="username">
      <div class="field-label">用户账号</div>
      <el-input
        v-model="loginForm.username"
        placeholder="请输入账号"
        clearable
        class="modern-input"
      />
    </el-form-item>

    <!-- 密码 -->
    <el-form-item prop="password">
      <div class="field-label">登录密码</div>
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="请输入密码"
        show-password
        clearable
        class="modern-input"
      />
    </el-form-item>

    <!-- 登录按钮 -->
    <el-form-item>
      <el-button
        type="primary"
        size="large"
        class="login-submit-btn"
        :loading="loading"
        @click="handleLogin"
      >
        <span v-if="!loading">登录系统</span>
        <span v-else>登录中...</span>
      </el-button>
    </el-form-item>

    <!-- 记住密码 + 忘记密码 -->
    <div class="login-options">
      <el-checkbox v-model="rememberMe" class="remember-check">记住密码</el-checkbox>
      <el-button text type="primary" size="small" class="forgot-btn" @click="emit('forgot')">
        忘记密码？
      </el-button>
    </div>

    <!-- 快捷登录（开发环境） -->
    <div v-if="accounts.length > 0" class="quick-login">
      <el-divider>
        <span class="divider-text">快捷登录</span>
      </el-divider>
      <div class="quick-btns">
        <el-button
          v-for="item in accounts"
          :key="item.username"
          size="default"
          type="primary"
          plain
          class="quick-btn"
          @click="handleAccountLogin(item)"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>

    <!-- 注册入口 -->
    <div class="register-link">
      <span>还没有账号？</span>
      <el-button text type="primary" size="small" class="link-btn" @click="emit('register')">
        立即注册
      </el-button>
    </div>
  </el-form>
</template>

<style scoped>
.field-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 500;
}

.pwd-login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.pwd-login-form :deep(.el-form-item__error) {
  padding-top: 4px;
  font-size: 12px;
}

/* 输入框 */
.pwd-login-form :deep(.el-input__wrapper) {
  border-radius: 14px;
  height: 54px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  box-shadow: none;
  padding: 0 16px;
  transition: all 0.25s ease;
}

.pwd-login-form :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.pwd-login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #1a56db;
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.08);
  background: #fff;
}

.pwd-login-form :deep(.el-input__inner) {
  font-size: 15px;
  color: #374151;
}

.pwd-login-form :deep(.el-input__inner::placeholder) {
  color: #94a3b8;
}

/* 登录按钮 */
.login-submit-btn {
  width: 100%;
  height: 54px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.3);
  margin-top: 4px;
}

.login-submit-btn:hover {
  background: linear-gradient(135deg, #1a2535 0%, #254a73 100%);
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.4);
  transform: translateY(-1px);
}

.login-submit-btn:active {
  transform: translateY(0);
}

/* 选项行 */
.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.remember-check :deep(.el-checkbox__label) {
  font-size: 13px;
  color: #64748b;
}

.forgot-btn {
  font-size: 13px;
  font-weight: 500;
}

/* 快捷登录 */
.quick-login {
  margin-top: 8px;
}

.divider-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
}

.quick-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.quick-btn {
  flex: 1;
  border-radius: 10px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(26, 86, 219, 0.15);
}

/* 注册入口 */
.register-link {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.link-btn {
  font-weight: 500;
}
</style>
