<template>

  <el-tabs type="border-card">
    <el-tab-pane label="主要负责人任务" class="sadf">
      <component :is="type"></component>
    </el-tab-pane>
    <el-tab-pane label="技术负责人任务" class="sadf">
      <component :is="type1"></component>
    </el-tab-pane>
    <el-tab-pane label="操作负责人任务" class="sadf">
      <component :is="type2"></component>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import maincharge from '@/views/safework/insurancedic/maincharge';
import technology from '@/views/safework/insurancedic/technology';
import operate from '@/views/safework/insurancedic/operate';
export default {
  name: "blinddic",
  components: {maincharge,technology,operate},
  data() {
    return {
      type : maincharge,
      type1 : technology,
      type2 : operate
    }
  }
}
</script>

<style scoped>
.sadf{
  height: calc(100vh - 84px);
}

</style>
