<template>
  <div class="jiludan">
    <div class="botbox">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">设备点检记录单</div>
        </template>
        <div class="topinfo">
          <el-row>
            <el-col :span="6">
              <img src="@/assets/images/xunjian/jilu-ico1.png" width="20"/>
              <span>
								<i>设备编号：</i>{{eqCode}}
							</span>
            </el-col>
            <el-col :span="6">
              <img src="@/assets/images/xunjian/jilu-ico2.png" width="20"/>
              <span>
								<i>设备名称：</i>{{eqName}}
							</span>
            </el-col>
            <el-col :span="6">
              <img src="@/assets/images/xunjian/jilu-ico3.png" width="20"/>
              <span>
								<i>所在单元：</i>{{sectionName}}
							</span>
            </el-col>
            <el-col :span="6">
              <img src="@/assets/images/xunjian/jilu-ico4.png" width="20"/>
              <span>
								<i>点检月份：</i>{{ parseTime(taskTime, '{y}-{m}') }}月
							</span>
            </el-col>
          </el-row>
        </div>
        <div class="table">
          <el-table :data="tableData"
                    :fit="false"
                    stripe
                    border
                    style="width: 100%"
          >
            <el-table-column prop="orderNum" label="序号" width="3%"></el-table-column>
            <el-table-column prop="content" label="点检内容" width="6%"/>
            <el-table-column label="点检结果">
              <el-table-column :prop="index+1" :label="index+1" width="3%" v-for="(item, index) in dataArr" :key="index">
                <!-- 判断如果one的值为1，则显示对勾 -->
                <template #default="scope">
                  <el-icon v-if="scope.row.taskResult==1 && scope.row.taskTime==item"><CircleCheck /></el-icon>
                  <el-icon v-else-if="scope.row.taskResult==2 && scope.row.taskTime==item"><Warning /></el-icon>
                  <el-icon v-else><CircleClose /></el-icon>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>

          <el-table :data="tableData3" id="table2"
                    :fit="false"
                    stripe
                    border
                    style="width: 100%"
                    :span-method="arraySpanMethod"
          >
            <el-table-column prop="person" label="点检人" width="9%" />
            <el-table-column :prop="index+1" :label="index+1" width="3%" v-for="(item, index) in dataArr" :key="index">
              {{tableData2[index]}}</el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSpotCheckMonth } from "@/api/equipment/spotCheckMonth";
import { getSpotCheckCount,getSpotCheck } from "@/api/equipment/spotCheck";
import {useRoute} from 'vue-router'
export default {
  name: "设备点检记录单",
  data() {
    return {
      eqCode: null,
      eqName: null,
      sectionName: null,
      taskTime: null,
      taskMonth: null,
      tableData: [],
      tableData2: [],
      tableData3: [],
      userName: null,
      dataArr:[]
    }
  },


  watch: {

  },
  created() {
    const route = useRoute();
    this.id = route.params.id;
    this.getEveryDay(this.id);
  },

  mounted: function () {
    this.getList();
  },

  methods: {
    getList(){
      this.tableData3 = [{
        person: '点检人',
      }];
      getSpotCheckCount(this.id).then(response =>{
        this.tableData = response.rows;
        for(var i=0; i < this.tableData.length; i++){
          this.tableData[i].orderNum = i+1;
          this.eqCode = this.tableData[0].eqCode;
          this.eqName = this.tableData[0].eqName;
          this.sectionName = this.tableData[0].sectionName;
          this.taskTime = this.tableData[0].taskTime;
          this.taskMonth = this.tableData[0].taskMonth;
          this.userName = this.tableData[0].userName;
          for (var j = 0; j<this.dataArr.length; j++){
            if(this.tableData[i].taskResult != null && this.tableData[i].taskTime == this.dataArr[j]){
              if(this.tableData2[j]!=null && this.tableData2[j]!=''){
                this.tableData2[j] = this.tableData2[j] +'\r'+this.userName;
              }else{
                this.tableData2[j] = this.userName;
              }
            }else{
              if(this.tableData2[j]!=null && this.tableData2[j]!=''){
                this.tableData2[j] = this.tableData2[j];
              }else{
                this.tableData2[j] = '';
              }
            }
          }
        }
      });
    },

    /*获取当前月份的每一天*/
    getEveryDay(id) {
      getSpotCheck(id).then(response => {
        //form.value = response.data;
        let day = this.getCountDays(response.data.taskTime);
        this.taskTime = response.data.taskTime;
        // 获取当前日期
        let date = new Date(this.taskTime);
        let taskmonth = date.getFullYear()
        // 获取当前月份
        let nowMonth = date.getMonth() + 1;
        // 对月份进行处理，1-9月在前面添加一个“0”
        if (nowMonth >= 1 && nowMonth <= 9) {
          nowMonth = "0" + nowMonth;
        }
        for (let k = 1; k <= day; k++) {
          // 对日期进行处理，1-9号在前面添加一个“0”
          if (k >= 0 && k <= 9) {
            k = "0" + k;
          }
          this.dataArr.push(`${taskmonth}-${nowMonth}-${k}`);
        }
      });
    },

    /*获取一个月的天数 */
    getCountDays(taskTime) {
      let curDate = new Date(taskTime);
      let curMonth = curDate.getMonth();
      curDate.setMonth(curMonth + 1);
      curDate.setDate(0);
      return curDate.getDate();
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
    }

  },


}
</script>

<style scoped lang="scss">
.jiludan {
  background: #f1f1f1;
  height: calc(100vh - 84px);
  padding: 10px;
  :deep(.el-row) {height: 100%;}
  :deep(.el-col) {height: 100%;}
  .botbox{

  }
  .box-card{
    padding: 15px;
    :deep(.el-card__header) {
      padding: 0 0 15px;position: relative;
    }
    :deep(.el-card__body) {
      padding: 0;
    }
    .card-header{
      padding-left: 10px;border-left: 5px solid #09bec5;
      line-height: 1;
    }
    .tools{
      position: absolute;right: 0;top: 0;
      span{margin-left: 15px;cursor: pointer;}
    }
    .topinfo{
      margin: 25px 0 0;
      img{
        vertical-align: middle;
        margin-right: 10px;
      }
      span{
        font-size: 14px;
        i{
          font-style: normal;color: #999;
        }
      }
    }
  }
  .table{
    position: relative;padding: 20px 0 0;
    height:calc(100% - 40px);
    :deep(.el-table) {
      .el-icon{color: #09bec5;font-size: 20px;}
      .el-table__empty-block{
        width:100% !important
      }
      .el-table__header{
        width: 100% !important;
      }
      .el-table__body{
        width: 100% !important;
      }
      tr:hover td{background-color: transparent;}
      th.el-table__cell{
        background: #09bec5 !important;
        color: #fff;
        text-align: center;
        height:35px !important;padding:3px 0;
      }
      .is-group tr:last-child th.el-table__cell{
        background: #fff !important;
        color: #09bec5;
      }
      .cell{
        text-align: center;padding:0;
      }
      .el-table__body tr.el-table__row--striped td.el-table__cell{
        background: #f6fcfc;
      }
      .el-table--border, .el-table--group {
        border: 2px solid #dff3f5!important;
      }
    }
  }
  #table2{
    margin-top: -1px;
    :deep(.el-table__header-wrapper) {
      display: none;
    }
    :deep(tr:first-child td:first-child .cell) {
      color: #09bec5;font-weight: bold;font-size: 16px;
    }
  }
}
</style>