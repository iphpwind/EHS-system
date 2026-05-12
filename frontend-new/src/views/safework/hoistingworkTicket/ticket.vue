<template>

  <el-tabs type="border-card" class="node">
    <el-tab-pane label="受限空间作业票模板" class="sadf">
      <component :is="type"></component>
    </el-tab-pane>
    <el-tab-pane label="安全交底和风险告知确认卡" class="sadf">
      <component :is="type1"></component>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import sptypeDic from '@/views/safework/hoistingworkTicket/hoistingworkdemo';
import safeblind from '@/views/safework/hoistingworkTicket/safedemo';
export default {
  name: "ticket",
  components: {sptypeDic,safeblind},
  data() {
    return {
      type : sptypeDic,
      type1 : safeblind
    }
  }
}
</script>

<style scoped>
.node{
  height: 100%;
  padding: 0 15px;
  overflow-y: scroll;
}
</style>
