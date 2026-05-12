<template>
  <div class="report">
    <div class="title"><span>吊装作业作业详情</span>
      <el-button type="primary" style="float: right;margin-left: 20px" @click="zuofei">作废</el-button>
      <el-button type="primary" style="float: right" @click="bohui">驳回日志</el-button>
      </div>
    <el-collapse @change="handleChange">
      <el-collapse-item title="基础信息" name="1">
        <div class="earthitem">
          <h4>基本信息</h4>
          <table>
            <tr>
              <td>关联施工计划：</td>
              <td colspan="2">{{ form.planCode }}</td>
            </tr>
            <tr>
              <td>作业地点：</td>
              <td colspan="2">{{form.safeObjectName + "/" + form.safeUnitName + "/" + form.operationSite}}</td>
            </tr>
            <tr>
              <td>吊起重物质量(t)：</td>
              <td colspan="2">{{form.weight}}</td>
            </tr>
            <tr>
              <td>吊起作业级别：</td>
              <td colspan="2">{{form.levelName}}</td>
            </tr>
            <tr>
              <td>吊具：</td>
              <td colspan="2">{{form.spreader}}</td>
            </tr>
            <tr>
              <td>申请作业人：</td>
              <td colspan="2">{{ form.createUserName }}</td>
            </tr>
            <tr>
              <td>申请作业时间：</td>
              <td colspan="2">{{ form.createTime }}</td>
            </tr>
            <tr>
              <td>吊装作业计划开始时间：</td>
              <td colspan="2">{{ form.startTime }}</td>
            </tr>
            <tr>
              <td>吊装作业计划结束时间：</td>
              <td colspan="2">{{ form.endTime }}</td>
            </tr>
            <tr>

            </tr>
            <tr>
              <td>风险辨识结果：</td>
              <td colspan="2">{{ form.hazardContent }}</td>
            </tr>
            <tr>
              <td>安全交底人：</td>
              <td colspan="2">{{ form.safetyDisclosureUserName }}</td>
            </tr>
            <tr>
              <td>是否重点监管：</td>
              <td colspan="2">{{ form.superviseFlag == '0' ? "否" : "是" }}</td>
            </tr>
            <tr>

            </tr>
            <tr>
              <td>作业危害分析人：</td>
              <td colspan="2">{{ form.hazardAnalysisUserName }}</td>
            </tr>
            <tr>
              <td>作业危害审核人：</td>
              <td colspan="2">{{ form.hazardProcessUserName }}</td>
            </tr>
            <tr>
              <td>作业危害审定人：</td>
              <td colspan="2">{{ form.hazardApprovalUserName}}</td>
            </tr>
            <tr>
              <td>安全交底人：</td>
              <td colspan="2"><img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
            </tr>
            <tr>
              <td>作业单位：</td>
              <td colspan="2">{{ form.operationDeptName }}</td>
            </tr>
            <tr>
              <td>监护人：</td>
              <td colspan="2">
                <span v-for="(item,index) in form.safeOperationHoistingworkControlList">
                  <img :src="item.sign" alt="" class="qianming">
                </span>
              </td>
            </tr>
          </table>
        </div>
        <div class="earthitem">
          <h4>现场确认</h4>
          <table>
            <tr v-for="(item,index) in form.safeOperationHoistingworkSceneUserList">
              <td>{{ item.departmentName }}：</td>
              <td colspan="2">{{ item.nickName }}</td>
            </tr>
          </table>
        </div>
        <div class="earthitem">
          <h4>作业审批</h4>
          <table>
            <tr v-for="item in form.safeOperationHoistingworkApprovalList">
              <td>{{ item.operationName }}：</td>
              <td colspan="2">{{ item.nickName }}</td>
            </tr>
          </table>
        </div>
        <div class="earthitem">
          <h4>作业验收</h4>
          <table>
            <tr v-for="(item,index) in form.safeOperationHoistingworkCheckList">
              <td>{{ item.checkName }}：</td>
              <td colspan="2">{{ item.nickName }}</td>
            </tr>
          </table>
        </div>
      </el-collapse-item>
      <el-collapse-item title="现场确认" name="2">
        <div v-for="item in form.safeOperationHoistingworkSceneUserList" class="earthitem">
          <h4>{{item.departmentName}}</h4>
          <div v-for="aa in item.safeOperationHoistingworkSceneContentList" >
            <el-checkbox v-model="aa.checkFlag" disabled>{{aa.confirmationContent}}</el-checkbox>
          </div>
          <table>
            <tr>
              <td>其他安全措施：</td>
              <td colspan="2">{{ item.remark }}</td>
            </tr>
            <tr>
              <td>确认人：</td>
              <td colspan="2"><img :src="item.userSign" alt="" class="qianming"></td>
            </tr>
            <tr>
              <td>编制人：</td>
              <td colspan="2"><img :src="item.compilerSign" alt="" class="qianming"></td>
            </tr>
            <tr>
              <td>提交人：</td>
              <td colspan="2">{{ item.updateBy }}</td>
            </tr>
            <tr>
              <td>提交时间：</td>
              <td colspan="2">{{ item.updateTime }}</td>
            </tr>
            <tr>
              <td>现场照片：</td>
              <td colspan="2">
                <div v-for="(aa,index) in item.scenePicList">
                  <img :src="aa" alt="" class="qianming">
                </div>
              </td>
            </tr>
          </table>
        </div>
      </el-collapse-item>
      <el-collapse-item title="作业审核" name="3">
        <div class="earthitem" v-for="item in form.safeOperationHoistingworkApprovalList">
          <table>
            <tr>
              <td>{{item.operationName}}：</td>
              <td colspan="2"><img :src="item.sign" alt="" class="qianming"></td>
            </tr>
            <tr>
              <td>提交人：</td>
              <td colspan="2">{{ item.createBy }}</td>
            </tr>
            <tr>
              <td>提交时间：</td>
              <td colspan="2">{{ item.createTime }}</td>
            </tr>
          </table>
        </div>
      </el-collapse-item>
      <el-collapse-item title="作业验收" name="4">
        <div class="earthitem" v-for="item in form.safeOperationHoistingworkCheckList">
          <table>
            <tr>
              <td>{{item.checkName}}</td>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td>确认人</td>
              <td colspan="2"><img :src="item.userSign" alt="" class="qianming"></td>
            </tr>
            <tr>
              <td>提交人：</td>
              <td colspan="2">{{ item.createBy }}</td>
            </tr>
            <tr>
              <td>提交时间：</td>
              <td colspan="2">{{ item.createTime }}</td>
            </tr>
          </table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="作废" v-model="cancelopen" width="500px" append-to-body>
      <div class="earthitem">
        <table>
          <tr>
            <td>作废理由：</td>
            <td colspan="2">{{ cancelform.reason }}</td>
          </tr>
          <tr>
            <td>作废时间：</td>
            <td colspan="2">{{cancelform.startTime}}</td>
          </tr>
          <tr>
            <td>作废人：</td>
            <td colspan="2">{{cancelform.nickName}}</td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="驳回日志" v-model="zuofeiopen" width="500px" append-to-body>
      <div v-for="item in list" class="earthitem">
        <table>
          <tr>
            <td>驳回理由：</td>
            <td colspan="2">{{ item.reason }}</td>
          </tr>
          <tr>
            <td>作废时间：</td>
            <td colspan="2">{{item.startTime}}</td>
          </tr>
          <tr>
            <td>作废人：</td>
            <td colspan="2">{{item.nickName}}</td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listHoistingwork, getHoistingwork, delHoistingwork, addHoistingwork, updateHoistingwork } from "@/api/safework/hoistingwork";
import { getRefuse, listRefuse } from "@/api/safework/refuse";
export default {
  name: "吊装作业作业作业票",
  data() {
    return {
      title: '基础信息',
      form:{},
      cancelform:{},
      list:[],
      cancelopen:false,
      zuofeiopen:false
    }
  },

  watch: {

  },
  created() {
    this.id = this.$route.query.id;
    this.getInfo();
    this.getRefuse();
  },

  mounted: function () {
  },

  methods: {
    getInfo(){
      getHoistingwork(this.id).then(response => {
        this.form = response.data;
      })
    },
    getRefuse(){
      listRefuse({operationType:'2',type:'0',mainId:this.id}).then(response => {
        if(response.rows.length>0){
          this.cancelform = response.rows[0];
        }
      })
      listRefuse({operationType:'2',type:'1',mainId:this.id}).then(response => {
        this.list = response.rows;
      })
    },
    zuofei(){
      this.cancelopen = true
    },
    bohui(){
      this.zuofeiopen = true
    }
  },

}
</script>


<style scoped lang="scss">
.report{
  padding: 0;background: #f9f9f9;
  overflow: auto;height: 100%;
  .title{
    padding: 15px;border-bottom: 1px solid #ddd;
    background: #fff;
  }
  :deep(.el-collapse) {
    border: 0;padding: 20px 15px 15px 60px;background: #fff;
    .el-collapse-item__header{
      background: #f9f9f9;padding-left: 15px;
    }
    .el-collapse-item{
      margin-bottom: 10px;position: relative;
    }
    .el-collapse-item:before{
      content: '';width: 25px;height: 25px;line-height: 25px;
      position: absolute;top: 0;left: -40px;
      border: 1px solid #09bec5;border-radius: 50%;
      text-align: center;color: #09bec5;background: #fff;
      z-index: 9;
    }
    .el-collapse-item:nth-child(1):before{
      content: '1'
    }
    .el-collapse-item:nth-child(2):before{
      content: '2'
    }
    .el-collapse-item:nth-child(3):before{
      content: '3'
    }
    .el-collapse-item:nth-child(4):before{
      content: '4'
    }
    .el-collapse-item:last-child::after{
      display: none;
    }
    .el-collapse-item::after{
      content: '';width: 2px;height: calc(100% + 15px);
      background: #09bec5;
      position: absolute;top: 0;left: -29px;
      z-index: 1;
    }
    .el-collapse-item__content{
      background: #f9f9f9;padding-top: 10px;
      border-top: 1px solid #eaeaea;
    }
    .el-collapse-item__content:before,.el-collapse-item__content::after{
      content: '';clear: both;display: table;
    }
  }
  .earthitem{
    margin: 0 10px;width: calc(33.33% - 20px);float: left;
    background: #fff;padding: 10px;
    h4{
      color: #999;margin: 10px 0;padding-left: 2px;
    }
  }
}
.earthitem{
  padding: 5px;
  margin: 5px;
  background-color: #eeeeee;
  ul{
    padding:0;list-style: none;font-size: 0;
    li{
      span{
        display: inline-block;font-size: 14px;
      }
      span:first-child{
        width: 33.33%;
      }
      span:last-child{
        width: 66.67%;
      }
    }
  }
}
.earthitem table{
  td{
    border: none;
  }
  .qianming{
    height: 25px;vertical-align: middle;
  }
}
@media print {

}
</style>




