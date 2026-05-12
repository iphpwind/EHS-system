<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { register } from '@/api/login';

const emit = defineEmits(['back']);
const router = useRouter();

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

function handleRegister() {
  registerRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      register(registerForm).then(res => {
        const username = registerForm.username;
        ElMessageBox.alert(
          `<div style="text-align:center">
            <div style="font-size:42px;margin-bottom:12px;">🎉</div>
            <div style="color:#1a56db;font-weight:600;font-size:16px;">账号 ${username} 注册成功！</div>
           </div>`,
          '注册成功',
          {
            dangerouslyUseHTMLString: true,
            type: 'success',
            confirmButtonText: '去登录',
            customClass: 'register-success-dialog'
          }
        ).then(() => {
          emit('back');
        });
      }).catch(() => {
        loading.value = false;
      });
    }
  });
}
</script>

<template>
  <el-form
    ref="registerRef"
    :model="registerForm"
    :rules="registerRules"
    size="large"
    class="register-form"
    @keyup.enter="handleRegister"
  >
    <el-form-item prop="username">
      <el-input
        v-model="registerForm.username"
        placeholder="请输入账号"
        clearable
        class="modern-input"
      />
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="registerForm.password"
        type="password"
        placeholder="请输入密码"
        show-password
        clearable
        class="modern-input"
      />
    </el-form-item>

    <el-form-item prop="confirmPassword">
      <el-input
        v-model="registerForm.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        show-password
        clearable
        class="modern-input"
      />
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

    <div class="back-link">
      <span>已有账号？</span>
      <el-button text type="primary" size="small" class="link-btn" @click="emit('back')">
        返回登录
      </el-button>
    </div>
  </el-form>
</template>

<style scoped>
.register-form :deep(.el-input__inner) {
  border-radius: 10px;
  height: 44px;
  font-size: 14px;
  background: #f8fafc;
  border-color: #e2e8f0;
  transition: all 0.25s ease;
}

.register-form :deep(.el-input__inner:hover) {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.register-form :deep(.el-input__inner:focus) {
  border-color: #1a56db;
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.08);
  background: #fff;
}

.register-form :deep(.el-input__icon) {
  font-size: 16px;
  color: #94a3b8;
}

.register-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.register-submit-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 3px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a56db 0%, #2563eb 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(26, 86, 219, 0.3);
}

.register-submit-btn:hover {
  background: linear-gradient(135deg, #1648c0 0%, #1d4ed8 100%);
  box-shadow: 0 6px 20px rgba(26, 86, 219, 0.4);
  transform: translateY(-1px);
}

.register-submit-btn:active {
  transform: translateY(0);
}

.back-link {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.link-btn {
  font-weight: 500;
}
</style>
