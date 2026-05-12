<template>
  <div class="page-header">
    <div class="page-header__content">
      <div class="page-header__icon" v-if="icon">
        <el-icon :size="28"><component :is="icon" /></el-icon>
      </div>
      <div class="page-header__text">
        <h2 class="page-header__title">{{ title }}</h2>
        <p class="page-header__desc" v-if="description">{{ description }}</p>
      </div>
    </div>
    <div class="page-header__actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: any
}>()
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}
.page-header__content {
  display: flex;
  align-items: center;
  gap: 12px;
}
.page-header__icon {
  color: var(--el-color-primary);
}
.page-header__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.page-header__desc {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.page-header__actions {
  display: flex;
  gap: 8px;
}
</style>
