<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'change']);

function toggleTheme() {
  const newVal = !props.modelValue;
  emit('update:modelValue', newVal);
  emit('change', newVal);
}
</script>

<template>
  <div class="theme-switch" @click="toggleTheme" title="切换主题">
    <el-icon v-if="!modelValue" class="theme-icon sun">
      <Sunny />
    </el-icon>
    <el-icon v-else class="theme-icon moon">
      <Moon />
    </el-icon>
  </div>
</template>

<style scoped>
.theme-switch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-switch:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.theme-icon {
  font-size: 18px;
  color: #fff;
}

.theme-icon.sun {
  color: #f59e0b;
}

.theme-icon.moon {
  color: #94a3b8;
}
</style>
