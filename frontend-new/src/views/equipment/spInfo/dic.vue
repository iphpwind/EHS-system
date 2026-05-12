<template>
  <el-tabs type="border-card">
    <el-tab-pane label="备件单位" class="sadf">
      <component :is="type"></component>
    </el-tab-pane>
    <el-tab-pane label="备件类型" class="sadf">
      <component :is="type1"></component>
    </el-tab-pane>
    <el-tab-pane label="入库类型" class="sadf">
      <component :is="type3"></component>
    </el-tab-pane>
    <el-tab-pane label="出库类型" class="sadf">
      <component :is="type2"></component>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import sptypeDic from '@/views/equipment/sptypeDic';
import spunitDic from '@/views/equipment/spunitDic';
import spcstockDic from '@/views/equipment/spcstockDic';
import sprstockDic from '@/views/equipment/sprstockDic';
export default {
  name: "dic",
  components: {sptypeDic, spunitDic,spcstockDic,sprstockDic},
  data() {
    return {
      type: 'spunitDic',
      type1:'sptypeDic',
      type2:'spcstockDic',
      type3:'sprstockDic'

    }
  }
}
</script>

<style scoped>
.sadf{
  height: calc(100vh - 84px);
}

</style>