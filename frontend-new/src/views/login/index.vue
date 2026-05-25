<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useSettingsStore } from '@/store/modules/settings';
import PwdLogin from './components/PwdLogin.vue';
import RegisterForm from './components/RegisterForm.vue';

const settingsStore = useSettingsStore();

const router = useRouter();

// 当前激活的模块
const activeModule = ref('pwd-login');

// 主题色
const themeColor = ref('#1a56db');
const isDark = ref(false);

// 是否移动端
const isH5 = ref(false);
function checkH5() {
  isH5.value = window.innerWidth < 768;
}
onMounted(() => {
  checkH5();
  window.addEventListener('resize', checkH5);
});
onUnmounted(() => {
  window.removeEventListener('resize', checkH5);
});

// 站点名称
const siteName = computed(() => settingsStore.siteName || '安全生产管理系统');
const siteLogo = computed(() => settingsStore.siteLogo || '');

// 切换主题
function toggleTheme() {
  isDark.value = !isDark.value;
  localStorage.setItem('login-theme-dark', isDark.value ? '1' : '0');
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// 初始化主题
onMounted(() => {
  const saved = localStorage.getItem('login-theme-dark');
  if (saved !== null) {
    isDark.value = saved === '1';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  }
});

function switchModule(module) {
  activeModule.value = module;
}

const modules = [
  { key: 'pwd-login', label: '密码登录' },
  { key: 'register', label: '账号注册' }
];
</script>

<template>
  <!-- ========== PC 端登录 ========== -->
  <div v-if="!isH5" class="login-pc">
    <!-- 左侧品牌展示区 -->
    <div class="brand-panel">
      <div class="brand-top">
        <div class="brand-tagline">CHEMICAL EHS PLATFORM</div>
        <h1 class="brand-title">
          化工企业<br />安全生产平台
        </h1>
        <p class="brand-desc">
          作业票管理 · 隐患治理 · 教育培训<br />
          双重预防机制 · 安全责任制 · 风险预警
        </p>
      </div>

      <div class="brand-stats">
        <div class="stat-card">
          <div class="stat-value">96%</div>
          <div class="stat-label">隐患闭环率</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">128</div>
          <div class="stat-label">本月作业票</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">88%</div>
          <div class="stat-label">培训完成率</div>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="form-panel">
      <div class="login-card-pc">
        <!-- Logo -->
        <div class="login-logo">
          <div class="logo-icon">🏭</div>
          <h2 class="login-title">欢迎登录</h2>
          <p class="login-subtitle">化工企业安全生产全过程数字化平台</p>
        </div>

        <!-- 模块切换 -->
        <div class="module-tabs">
          <button
            v-for="mod in modules"
            :key="mod.key"
            class="tab-btn"
            :class="{ active: activeModule === mod.key }"
            @click="switchModule(mod.key)"
          >
            {{ mod.label }}
          </button>
          <div class="tab-indicator" :style="{ transform: activeModule === 'pwd-login' ? 'translateX(0)' : 'translateX(100%)' }"></div>
        </div>

        <!-- 表单 -->
        <div class="login-main">
          <PwdLogin
            v-if="activeModule === 'pwd-login'"
            @register="switchModule('register')"
            @forgot="ElMessage.info('请联系管理员重置密码')"
          />
          <RegisterForm
            v-else
            @back="switchModule('pwd-login')"
          />
        </div>

        <!-- 底部文字 -->
        <div class="login-card-footer">
          GB30871-2022 特殊作业管理<br />
          双重预防机制 + EHS闭环管理
        </div>
      </div>
    </div>
  </div>

  <!-- ========== H5 移动端登录 ========== -->
  <div v-else class="login-h5">
    <div class="h5-bg">
      <div class="h5-top">
        <div class="h5-tagline">CHEMICAL EHS PLATFORM</div>
        <h1 class="h5-title">
          安全生产<br />移动平台
        </h1>
        <p class="h5-desc">
          作业票审批 · 隐患排查<br />
          在线培训 · 电子签章
        </p>
      </div>

      <div class="h5-card">
        <h2 class="h5-card-title">用户登录</h2>

        <!-- 模块切换 -->
        <div class="module-tabs">
          <button
            v-for="mod in modules"
            :key="mod.key"
            class="tab-btn"
            :class="{ active: activeModule === mod.key }"
            @click="switchModule(mod.key)"
          >
            {{ mod.label }}
          </button>
          <div class="tab-indicator" :style="{ transform: activeModule === 'pwd-login' ? 'translateX(0)' : 'translateX(100%)' }"></div>
        </div>

        <!-- 表单 -->
        <div class="login-main">
          <PwdLogin
            v-if="activeModule === 'pwd-login'"
            @register="switchModule('register')"
            @forgot="ElMessage.info('请联系管理员重置密码')"
          />
          <RegisterForm
            v-else
            @back="switchModule('pwd-login')"
          />
        </div>

        <div class="h5-card-footer">
          <label class="remember-row">
            <input type="checkbox" /> 记住密码
          </label>
          <span class="forgot-link" @click="ElMessage.info('请联系管理员重置密码')">忘记密码</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==================== PC 端 ==================== */
.login-pc {
  display: flex;
  min-height: 100vh;
  background: #e2e8f0;
}

/* 左侧品牌面板 */
.brand-panel {
  width: 48%;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e293b 100%);
  color: #fff;
  padding: 56px 56px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-tagline {
  font-size: 12px;
  letter-spacing: 6px;
  opacity: 0.7;
}

.brand-title {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.25;
  margin: 32px 0 0;
}

.brand-desc {
  font-size: 16px;
  color: #94a3b8;
  line-height: 2;
  margin: 32px 0 0;
}

.brand-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border-radius: 24px;
  padding: 24px 20px;
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
}

.stat-label {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 8px;
}

/* 右侧表单面板 */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.login-card-pc {
  width: 460px;
  background: #fff;
  border-radius: 36px;
  border: 1px solid #e2e8f0;
  padding: 40px 36px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.login-logo {
  text-align: center;
}

.logo-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, #1e3a5f, #1a56db);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: 0 4px 16px rgba(26, 86, 219, 0.3);
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 20px 0 0;
}

.login-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 10px 0 0;
}

/* 模块标签 */
.module-tabs {
  position: relative;
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  margin: 28px 0 24px;
}

.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 9px 0;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: color 0.3s;
  border-radius: 8px;
}

.tab-btn.active {
  color: #1a56db;
}

.tab-indicator {
  position: absolute;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

.login-main {
  min-height: 220px;
}

.login-card-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.8;
}

/* ==================== H5 移动端 ==================== */
.login-h5 {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.h5-bg {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #1e293b 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.h5-top {
  padding: 60px 32px 0;
}

.h5-tagline {
  font-size: 11px;
  letter-spacing: 4px;
  opacity: 0.7;
}

.h5-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  margin: 24px 0 0;
}

.h5-desc {
  font-size: 15px;
  color: #94a3b8;
  line-height: 2;
  margin: 24px 0 0;
}

.h5-card {
  margin: 40px 20px 40px;
  background: #fff;
  border-radius: 36px;
  padding: 32px 24px 28px;
  color: #1e293b;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.h5-card-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 24px;
}

.h5-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #64748b;
  padding-top: 12px;
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.remember-row input {
  width: 16px;
  height: 16px;
  accent-color: #1a56db;
}

.forgot-link {
  cursor: pointer;
  color: #1a56db;
}

/* 响应式 */
@media (max-width: 1024px) {
  .brand-title {
    font-size: 40px;
  }
  .brand-panel {
    padding: 36px 32px 28px;
  }
}

@media (max-width: 480px) {
  .h5-card {
    margin: 24px 12px 32px;
    padding: 24px 16px 22px;
    border-radius: 28px;
  }
  .h5-top {
    padding: 40px 20px 0;
  }
  .h5-title {
    font-size: 34px;
  }
}
</style>
