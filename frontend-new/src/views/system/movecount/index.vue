<template>
  <div class="baoyangplan">
    <el-card :body-style="{ padding: '10px' }">
      <el-row :gutter="20">
        <el-col :span="4" :xs="24">
          <div class="head-container tree">
            <h4>区域设备导航</h4>
            <el-input
                v-model="areaName"
                placeholder="请输入区域名称"
                clearable
                prefix-icon="Search"
                style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container tree down-tree">
            <el-tree
                :current-node-key="0"
                :highlight-current="true"
                :data="areaOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="sectionTreeRef"
                default-expand-all
                node-key="id"
                @node-click="handleNodeClick"
            />
          </div>
        </el-col>
        <el-col :span="20" style="border-left: 1px solid #f0f0f0;padding: 0">
          <div class="tools">
            <el-form :model="queryParams">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="设备名称" prop="equipId">
                    <el-select v-model="queryParams.equipId" placeholder="请选择设备" clearable>
                      <el-option
                          v-for="item in optionseq"
                          :key="item.sensorId"
                          :label="item.sensorName"
                          :value="item.sensorId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="日期">
                    <el-row>
                      <el-col :span="9">
                        <el-date-picker
                            v-model="range"
                            type="daterange"
                            @change="ctimeonfirm"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button class="btn" @click="search" style="float: right;">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <!-- 表格 -->
          <div class="table">
            <div class="header">
              <div class="card-tit">运行时长</div>
            </div>
            <el-table
                :data="tableData"
                stripe="true"
                border
                style="width: 100%"
                v-loading="loading"
            >
              <el-table-column prop="sensorName" label="设备名称"/>
              <el-table-column prop="runvalue" label="运行时长（小时）" />
              <el-table-column prop="stopvalue" label="待机时长（小时）" />
              <el-table-column prop="warnvalue" label="告警时长（小时）" />
              <el-table-column prop="outagevalue" label="断电时长（小时）" />
              <el-table-column prop="activationvalue" label="稼动率 %" />
            </el-table>

            <!-- 页码 -->
<!--            <div class="pages">
              <el-pagination
                  background
                  :total="total"
              />
              <el-button @click="confirm" class="pagebtn">确定</el-button>
            </div>-->
						<div class="pages">
            <pagination
                v-show="total>0"
                :total="total"
                v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                @pagination="getList"
            />
						</div>
          </div>
        </el-col>
      </el-row>

    </el-card>
  </div>

</template>

<script>
import { reactive } from 'vue'
import { treeselect } from "@/api/industry/industryArea";
import {listEqstatusPersent} from "@/api/industry/statusPercent";
import { listIndustryAreaSensor } from "@/api/industry/industryAreaSensor";
import {deptAndIndustryAreaTreeSelect} from "@/api/industry/base";


export default {
  name: "",
  data() {
    return {
      areaName:'',
      highlightBd: true,
      defaultKey: [],
      areaOptions: [],
      range:[],
      //status: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryParams: {
        equipId: '',
        date1:'',
        date2:'',
        pageNum: 1,
        pageSize: 10,
        industryAreaId:'',
        deptId:''
      },
      value: '',
      optionseq: [],
      tableData: [],
      total: 0,
      cityNames: [],
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
    }

  },
  created() {
    this.cityNames = this.$route.query
    let date = new Date()//获取新的时间
    //获取当前年份,并且转为字符串
    let year = date.getFullYear().toString()
    //获取当前月份，因为月份是要从0开始，此处要加1，
    //使用三元表达式，判断是否小于10，如果是的话，就在字符串前面拼接'0'
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
    //获取天，判断是否小于10，如果是的话，就在在字符串前面拼接'0'
    let day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()
    //字符串拼接，将开始时间和结束时间进行拼接
    let start = year + '-' + month + '-01'    //当月第一天
    let end = year + '-' + month + '-' + day  //当天
    this.range = [start, end] //将值设置给组件DatePicker 绑定的数据
    this.queryParams.date1 = this.range[0];
    this.queryParams.date2 = this.range[1];
  },

  mounted() {
    this.getTreeSelect();
    this.getList();
    this.getDeviceList();
  },

  watch: {
    areaName: {
      handler: function (newValue, oldValue) {
        this.$refs["sectionTreeRef"].filter(newValue);
      },
      deep: true, // 深度监听
    }
  },
  methods: {
    //筛选时间确认
    ctimeonfirm(val){
      this.range = [this.timeFormat(val[0]), this.timeFormat(val[1])];
      this.queryParams.date1 = this.range[0];
      this.queryParams.date2 = this.range[1];
    },

    timeFormat(time) { // 时间格式化 2019-09-08
      let year = time.getFullYear().toString();
      let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1).toString() : (time.getMonth() + 1).toString();
      let day = time.getDate() < 10 ? '0' + time.getDate().toString() : time.getDate().toString();
      return year + '-' + month + '-' + day;
    },

    handleNodeClick(data) {
      console.log(data)
      this.queryParams.industryAreaId = '';
      this.queryParams.deptId = '';
      if (data.type != null) {
        this.queryParams.industryAreaId = data.id;
      } else {
        this.queryParams.deptId = data.id;
      }
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getDeviceList();
      this.getList();
    },

    /** 查询列表 */
    getList() {
      this.loading = true;
      listEqstatusPersent(this.queryParams).then(response => {
        this.tableData = response.rows;//table数据
        this.total = response.total;//table总个数
        this.loading = false;
      });
    },

    //获取设备数据
    getDeviceList() {
      listIndustryAreaSensor({industryAreaId:this.queryParams.industryAreaId,deptId:this.queryParams.deptId}).then(response => {
        this.optionseq = response.rows;//list数据
      });
    },

    search() {
      this.getList();
    },

    /** 查询组织下拉树结构 */
    getTreeSelect() {
      deptAndIndustryAreaTreeSelect(this.cityNames, {status: "0", delFlag: '0'}).then(response => {
        this.areaOptions = response.data;
        if (this.areaOptions.length > 0) {
          this.$nextTick(() => {
            this.$refs["sectionTreeRef"].setCurrentKey(this.areaOptions[0].id);
            this.handleNodeClick(this.areaOptions[0])
          })
        }
        // this.$refs.tree.setCurrentKey(this.curren)
      }, error => {
        console.log(error)
      });
    },
  }
}
</script>

<style scoped lang="scss">
@media only screen and (max-width:1366px) {
	.baoyangplan{
		height: auto!important;
	}
}
.baoyangplan{
  height: calc(100vh - 84px);padding: 10px;
  background: #f3f3f4;
  :deep(.el-card) {
    height: 100%;
    .el-card__body{height: 100%;}
    .el-row{height: 100%;}
  }
  .tree{
    h4{
      margin: 10px 0 10px;
      color: #333;padding: 0;
      border-bottom: 0;
    }
    :deep(.el-select) {
      .el-input__inner{
        border: 0;border-radius: 0;
      }
    }
    :deep(.el-tree) {
      .customNodeClass{
        border-top: 1px solid #eee;
        .customNodeClass{
          border: 0;
        }
      }
    }
  }
  .header {
    padding: 10px 15px;
    border-bottom: 1px solid #f0f0f0;
    .card-tit {
      padding-left: 10px;
      border-left: 5px solid #09bec5;
      font-size: 18px;
    }
  }
  .info{
    padding: 30px 25px;
    .item{
      font-size: 14px;
      img{
        vertical-align: middle;margin-right: 15px;
      }
      span{
        display: inline-block;
        color: #999;
      }
      i{
        font-style: normal;
      }
    }
  }
  .tools{
    padding: 0 15px;
    border-bottom: 5px solid #eee;
    :deep(.el-form-item__label) {
      font-weight: normal;padding: 0 10px;
    }
    .btn{
      border: 0;background: #09bec5;color:#fff;
    }
  }
  .table{
    padding: 0 10px;
    height: calc(100% - 200px);position: relative;
    margin: 10px 0 0;
    .header{
      margin: 0 0 10px;
    }

    .btn{
      height: auto;border: 0;padding: 0;color: #09bec5;
    }
    .btn.green{
      color: #46ba7f;
    }

    :deep(.el-table) {

      .el-table__header-wrapper th{
        text-align: center;background: #09bec5 !important;color: #fff;border: 0;
      }
      .sort-caret.ascending{
        border-bottom-color: #fff !important;
      }
      .sort-caret.descending{
        border-top-color: #fff !important;
      }
      td.el-table__cell{text-align: center;border-color: #d2eef1;}
      .el-table__inner-wrapper::before{
        display: none;
      }
      .el-table__row--striped td.el-table__cell{
        background: #f6fcfc !important;
      }
      .el-table__row:hover  td.el-table__cell{
        background: #f6fcfc !important;
      }
    }
    :deep(.el-table--border::after) {
      display: none;
    }
    :deep(.el-table--border::before) {
      display: none;
    }
    .pages{
      // position: absolute;padding-right: 70px;
      // right: 20px;bottom: 10px;
      :deep(.el-pagination) {
        padding: 0;position:relative;bottom:10px;
        .el-pager li{
          outline: none;background: transparent;border: 1px solid #ddd;
        }
        .el-pager li.active{
          background: #09bec5;border-color: #09bec5;font-weight: normal;
        }
      }
      .pagebtn{
        position: absolute;right: 0;top: 0;
      }
    }
  }

}
</style>
