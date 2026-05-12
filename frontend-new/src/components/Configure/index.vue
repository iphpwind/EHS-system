<template>
  <div class="m10">
    <!-- <el-dropdown trigger="click" @command="handleSelZt">
        <span class="el-dropdown-link">
            选择组态图<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="dd in dds" :key="dd.ztId" :command="dd.ztRouterpath" :disabled="dd.ztId==selId">
                {{dd.ztName}}
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown> -->
    <el-dropdown trigger="click" @command="handleSelZt">
    <span class="el-dropdown-link">
      {{seltitle}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown >
      <el-dropdown-menu >
        <el-dropdown-item v-for="dd in dds" :key="dd.ztId" :command="dd.ztRouterpath" :disabled="dd.ztId==selId"  :class="{'selected':dd.ztId==selId}">
                {{dd.ztName}}
            </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  </div>
</template>

<script>
export default {
  data(){
    return {
      name: 'Configure',
      dds:[
        { ztRouterpath:'/industry/hxhb/index', ztRoutername:'迁安市马兰庄镇南山铁矿', ztName:'迁安市马兰庄镇南山铁矿', ztId: 1},
        { ztRouterpath:'/industry/hxhb/taoci', ztRoutername:'额尔古纳诚诚矿业', ztName:'额尔古纳诚诚矿业', ztId: 2},
        { ztRouterpath:'/industry/hxhb/taoci2', ztRoutername:'灵宝市金瑞选矿设备', ztName:'灵宝市金瑞选矿设备', ztId: 3},
        { ztRouterpath:'/industry/hxhb/gxxq', ztRoutername:'广西鑫琪矿业', ztName:'广西鑫琪矿业', ztId: 4}
      ],
     
    }
  },
  props: {
    selId: {
      type: Number,
      default: 0
    },
    seltitle:{
      type: String,
      default: '迁安市马兰庄镇南山铁矿'
    }
  },
  computed: {

  },
  created(){

  },
  methods: {
    handleSelZt(rtp) {
      console.info(this);
      //this.selId = id;
      this.$router.push({path:rtp});
    }
  }
}
</script>
<style>
  .m10 {
      padding: 10px;
      background: #eff;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #42b983;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
