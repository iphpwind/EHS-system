<script setup>
const props = defineProps({
  size: { type: Number, default: 48 },
  color: { type: String, default: '#1a56db' },
  logoUrl: { type: String, default: '' }
});
</script>

<template>
  <div class="system-logo" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- 有自定义logo图片时显示图片 -->
    <img v-if="logoUrl" :src="logoUrl" :width="size" :height="size" class="logo-img" alt="logo" />
    <!-- 无图片时显示默认SVG -->
    <svg v-else :width="size" :height="size" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="16" :fill="color"/>
      <rect x="14" y="14" width="16" height="16" rx="4" fill="white" fill-opacity="0.95"/>
      <rect x="34" y="14" width="16" height="16" rx="4" fill="white" fill-opacity="0.7"/>
      <rect x="14" y="34" width="16" height="16" rx="4" fill="white" fill-opacity="0.7"/>
      <circle cx="46" cy="46" r="8" fill="white" fill-opacity="0.35"/>
    </svg>
  </div>
</template>

<style scoped>
.system-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}
.system-logo:hover {
  transform: scale(1.05) rotate(-2deg);
}
.logo-img {
  border-radius: 8px;
  object-fit: contain;
}
</style>
