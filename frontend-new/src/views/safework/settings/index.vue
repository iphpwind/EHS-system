<template>
  <el-tabs type="border-card">
    <el-tab-pane label="作业票动态风险配置" class="sadf">
      <component :is="type"></component>
    </el-tab-pane>
    <el-tab-pane label="作业票有效期配置" class="sadf">
      <component :is="type1"></component>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import safesetting from '@/views/safework/safesetting';
import safeperiod from '@/views/safework/periodconfig';
export default {
  name: "dic",
  components: {safesetting,safeperiod},
  data() {
    return {
      type: 'safesetting',
      type1: 'safeperiod',
    }
  }
}
</script>

<style scoped>
.sadf{
  height: calc(100vh - 84px);
}

</style>