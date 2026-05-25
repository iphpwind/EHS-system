<template>
  <div class="duty-container">
    <van-nav-bar title="值班管理" left-text="返回" @click-left="$router.back()" />
    
    <div class="content">
      <van-empty description="功能开发中..." />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.duty-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding: 20px;
}
</style>
