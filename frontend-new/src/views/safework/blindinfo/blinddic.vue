<template>

  <el-tabs type="border-card">
    <el-tab-pane label="介质" class="sadf">
      <component :is="type"></component>
    </el-tab-pane>
    <el-tab-pane label="现场确认内容" class="sadf">
      <component :is="type1"></component>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import sptypeDic from '@/views/safework/mediumdic';
import blindConfirmation from '@/views/safework/blindConfirmation';
export default {
  name: "blinddic",
  components: {sptypeDic,blindConfirmation},
  data() {
    return {
      type : sptypeDic,
      type1 : blindConfirmation
    }
  }
}
</script>

<style scoped>
.sadf{
  height: calc(100vh - 84px);
}

</style>
