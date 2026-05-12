<template>
<div class="yilan">
  <el-card class="tophead">
    <div class="header">
      <el-row>
        <el-col :span="12">
          <div class="card-tit">设备筛选</div>
        </el-col>
        <el-col :span="12">
          <div class="rightsearch">
            <el-button class="btn green" @click="searchOne">
              查询
            </el-button>
            <el-button class="btn" @click="search">
              <el-icon><Filter /></el-icon>筛查
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>


    <el-form :model="form" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="类型">
            <el-select v-model="form.region" placeholder="请选择">
              <el-option label="类型一" value="类型一" />
              <el-option label="类型二" value="类型二" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="区域">
            <el-select v-model="form.area" placeholder="请选择">
              <el-option label="区域一" value="区域一" />
              <el-option label="区域二" value="区域二" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>
  </el-card>

  <el-card class="info">

    <el-row :gutter="10">
      <el-col :span="6">
        <div class="item">
          <el-row>
            <el-col :span="6">
              <img src="@/assets/images/baoyang/baoyang-gdico1.png"/>
            </el-col>
            <el-col :span="18">
              <h3 class="blue">6</h3>
              <h5>连接设备</h5>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item">
          <el-row>
            <el-col :span="6">
              <img src="@/assets/images/baoyang/baoyang-gdico2.png"/>
            </el-col>
            <el-col :span="18">
              <h3 class="red">4</h3>
              <h5>在线设备</h5>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item">
          <el-row>
            <el-col :span="6">
              <img src="@/assets/images/baoyang/baoyang-gdico3.png"/>
            </el-col>
            <el-col :span="18">
              <h3 class="green">3</h3>
              <h5>离线设备</h5>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item">
          <el-row>
            <el-col :span="6">
              <img src="@/assets/images/baoyang/baoyang-gdico4.png"/>
            </el-col>
            <el-col :span="18">
              <h3 class="orange">1</h3>
              <h5>待处理告警</h5>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-card>

  <el-card class="list">
    <el-row :gutter="12" >
      <el-col :lg="8" :xl="6" class="gl" >
        <el-card :body-style="{ padding: '10px 15px 20px' }">
          <div class="li-title">
            <el-row>
              <el-col :span="10">
                <img src="@/assets/images/name-ico2.png">
              </el-col>
              <el-col :span="14">
                <h4>设备名称</h4>
                <div class="name">M80S</div>
              </el-col>
            </el-row>
          </div>
          <div class="data" >
<!--            <div class="dataitem" v-for="yc in item.equipmentYcList">-->
<!--              <el-row v-if="yc.ifshow == '是'">-->
<!--                <el-col :span="12"><span>{{yc.ycName}}</span></el-col>-->
<!--                <el-col :span="12"><span class="rt">{{yc.ycValue}}&nbsp;{{yc.ycUnit}}</span></el-col>-->
<!--              </el-row>-->
<!--            </div>-->
            <div class="dataitem">
              <el-row>
                <el-col :span="12"><span>设备运行</span></el-col>
                <el-col :span="12"><span class="rt">山东烟台</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>分类</span></el-col>
                <el-col :span="12"><span class="rt">工业</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>注册日期</span></el-col>
                <el-col :span="12"><span class="rt">2019-03-25</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>运行状态</span></el-col>
                <el-col :span="12"><span class="rt">关闭</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>区域</span></el-col>
                <el-col :span="12"><span class="rt">1区</span></el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>


    </el-row>
  </el-card>


</div>
</template>


<script>
import { reactive } from 'vue'
export default {
  name: "设备一览",
  data() {
    return {
      form : reactive({
        region: '',
        area:'',
      })
    }
  },
  mounted() {

  },
  methods: {
    searchOne() {

    },

  }
}


</script>


<style scoped lang="scss">
.yilan{
  padding: 10px;
  background: #f3f3f4;
  //height: calc(100vh - 84px);
  .tophead{
    margin: 0 0 10px;
    :deep(.el-card__body) {padding-bottom: 0;}
    :deep(.el-select) {width: 100%;}
    .card-tit {
      padding-left: 10px;
      border-left: 5px solid #09bec5;
      font-size: 18px;
    }
    .rightsearch{
      text-align: right;color: #999;margin: 0 0 15px;
      .btn{
        border: 0;margin: 0 5px;
        height: auto;padding: 5px 0;
      }
      .green{
        background: #09bec5;color: #fff;padding: 5px 10px;
      }
    }
    .header{
      margin: 0 0 20px;
      border-bottom: 1px solid #f0f0f0;
    }
  }

  .info{
    margin: 0 0 10px;

    .item{
      padding: 20px 30px;box-shadow: 0 0 10px #eee;border-radius: 5px;
      img{}
      h3{
        margin: 0 0 15px;font-size: 36px;font-weight: bold;
      }
      h5{
        margin: 0;
      }
      .blue{color: #3a8fea;}
      .red{color: #f76c55;}
      .green{color: #0fd5ad;}
      .orange{color: #ffae00;}
    }
  }

  .list{
    border: 1px solid #eee;
    background: #fff;
    box-shadow: 0 0 5px #eee;
    border-radius: 5px;
    height: calc(100% - 310px);
    position: relative;
    margin: 10px 0 0;

    .li-title{
      padding: 8px 0;
      text-align: right;
      border-bottom: 1px solid #f5f5f5;
      margin-bottom: 10px;
      img{float: left; width: 40px}
      h4{font-size: 14px;margin: 5px 0 0;color: #666}
      .name{
        font-size: 18px;
        margin: 2px 0 0;
      }
    }
    .data{
      background: #f7f7f7;border-radius:5px;overflow-y: auto;
      height: 160px;padding: 10px;margin: 10px 0 0;
      line-height: 2;
      .dataitem{
        span{
          display: block;color:#555;font-size: 14px;
        }
        span.rt{text-align: right;}
      }
    }
    .el-col-xl-6{
      max-width: 20%;
      margin-bottom: 10px;
    }
  }


}


</style>
