<template>

  <el-tabs type="border-card">
    <el-tab-pane label="限时整改" class="sadf">
      <component :is="type"></component>
    </el-tab-pane>
    <el-tab-pane label="快速整改" class="sadf">
      <component :is="type1"></component>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import sptypeDic from '@/views/safework/hazareport';
import blindConfirmation from '@/views/safework/hazareport1';
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

</style>
