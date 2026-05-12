<template>
  <div class="report">
		<div class="title"><span>动土作业详情</span>
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
              <td>发起人：</td>
              <td colspan="2">{{ form.createUserName }}</td>
            </tr>
            <tr>
              <td>保存时间：</td>
              <td colspan="2">{{ form.createTime }}</td>
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
              <td>计划开始时间：</td>
              <td colspan="2">{{ form.startTime }}</td>
            </tr>
            <tr>
              <td>计划结束时间：</td>
              <td colspan="2">{{ form.endTime }}</td>
            </tr>
            <tr>
              <td>作业地点：</td>
              <td colspan="2">{{ form.placeInfo }}</td>
            </tr>
            <tr>
              <td>关联的其他特殊作业：</td>
              <td colspan="2">{{ form.unitOperationType }}</td>
            </tr>
            <tr>
              <td>风险辨识结果：</td>
              <td colspan="2">{{ form.hazardId }}</td>
            </tr>
            <tr>
              <td>作业内容：</td>
              <td colspan="2">{{ form.operationContent }}</td>
            </tr>
            <tr>
              <td>作业危害分析人：</td>
              <td colspan="2">{{ form.hazardAnalysisUserName}}</td>
            </tr>
            <tr>
              <td>作业危害审核人：</td>
              <td colspan="2">{{ form.hazardProcessUserName}}</td>
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
              <td>是否重点监管：</td>
              <td colspan="2">{{ form.superviseFlag }}</td>
            </tr>
          </table>
        </div>
        <div class="earthitem">
          <h4>作业范围、内容、方式</h4>
          <table>
            <tr>
              <td>作业范围：</td>
              <td colspan="2">{{ form.workScope }}</td>
            </tr>
            <tr>
              <td>作业内容：</td>
              <td colspan="2">{{ form.workCont }}</td>
            </tr>
            <tr>
              <td>作业方式：</td>
              <td colspan="2">{{ form.workWay }}</td>
            </tr>
            <tr>
              <td>作业简图：</td>
              <td colspan="2">
                <div v-for="(item,index) in fjlist">
                  <img :src="item.address" alt="" class="qianming">
                </div>
              </td>
            </tr>
            <tr>
              <td>作业单位：</td>
              <td colspan="2">{{ form.operationDeptName }}</td>
            </tr>
            <tr>
              <td>作业单位负责人：</td>
              <td colspan="2"><img :src="form.responsibleSign" alt="" class="qianming"></td>
            </tr>
            <tr>
              <td>监护人：</td>
              <td colspan="2">
                <span v-for="(item,index) in form.safeOperationEarthControlList">
                  <img :src="item.sign" alt="" class="qianming">
                </span>
              </td>
            </tr>
          </table>
        </div>
        <div class="earthitem">
          <h4>现场确认</h4>
          <table>
            <tr v-for="item in form.safeOperationEarthSceneUser">
              <td>{{ item.operationName }}：</td>
              <td colspan="2">{{ item.nickName }}</td>
            </tr>
          </table>
        </div>
        <div class="earthitem">
          <h4>作业审批</h4>
          <table>
            <tr v-for="item in form.safeOperationEarthApprovalList">
              <td>{{ item.operationName }}：</td>
              <td colspan="2">{{ item.nickName }}</td>
            </tr>
          </table>
        </div>
        <div class="earthitem">
          <h4>作业验收</h4>
          <table>
            <tr v-for="item in form.safeOperationEarthCheck">
              <td>{{ item.operationName }}：</td>
              <td colspan="2">{{ item.nickName }}</td>
            </tr>
          </table>
        </div>
      </el-collapse-item>
      <el-collapse-item title="现场确认" name="2">
        <div v-for="item in confirmationList" class="earthitem">
          <h4>{{item.operationName}}</h4>
          <div v-for="aa in item.safeOperationEarthSceneContent" >
            <el-checkbox v-model="aa.checkFlag" disabled>{{aa.confirmationContent}}</el-checkbox>
          </div>
            <table>
              <tr>
                <td>确认人：</td>
                <td colspan="2">{{ item.nickName }}</td>
              </tr>
              <tr>
                <td>提交时间：</td>
                <td colspan="2">{{ item.updateTime }}</td>
              </tr>
              <tr>
                <td>现场照片：</td>
                <td colspan="2">
                  <div v-for="(aa,index) in item.imgList">
                  <img :src="aa" alt="" class="qianming">
                </div>
                </td>
              </tr>
            </table>
        </div>
      </el-collapse-item>
      <el-collapse-item title="作业审核" name="3">
        <div class="earthitem" v-for="item in form.safeOperationEarthApprovalList">
          <table>
            <tr>
              <td>{{item.operationName}}：</td>
              <td colspan="2"><img :src="item.sign" alt="" class="qianming"></td>
            </tr>
            <tr>
              <td>提交人：</td>
              <td colspan="2">{{ item.nickName }}</td>
            </tr>
            <tr>
              <td>提交时间：</td>
              <td colspan="2">{{ item.createTime }}</td>
            </tr>
          </table>
        </div>
      </el-collapse-item>
      <el-collapse-item title="作业验收" name="4">
        <div class="earthitem" v-for="item in form.safeOperationEarthCheck">
          <table>
            <tr>
              <td>{{item.operationName}}：</td>
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
      <div v-for="item in list1" class="earthitem">
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

import { getEarth } from "@/api/safework/earth";
import { listEarthSceneUser, getEarthSceneUser, delEarthSceneUser, addEarthSceneUser, updateEarthSceneUser } from "@/api/safework/earthSceneUser";
import { getRefuse, listRefuse } from "@/api/safework/refuse";

export default {
  name: "动土作业作业票",
  data() {
    return {
      title: '基础信息',
      attAddress:[],
      Camerashow: false,
      form:{
      },
      list:[],
      sceneList:[],
      checkDicList:[],
      id:null,
      workState:null,
      fjlist:[],
      workList:[],
      confirmationList:[],
      app:{},
      leng:0,
      confirmList:[],
      approvalList:[],
      cancelform:{},
      list1:[],
      cancelopen:false,
      zuofeiopen:false
    }
  },

  watch: {

  },
  created() {
    this.id = this.$route.query.id;
    this.workState = this.$route.query.workState;
    this.getDetail();
    this.getScene();
    this.getRefuse();
  },

  mounted: function () {
  },

  methods: {
    getDetail(){
      getEarth(this.id).then(response => {
        console.log(response.data)
        this.form = response.data;
        this.form.placeInfo = this.form.objnames+'/'+this.form.unitName+'/'+this.form.operationSite
        this.approvalList = this.form.safeOperationEarthApprovalList
        let a = this.form.unitOperationType.split(',')
        this.workList = a

        if (this.form.workImg != '' && this.form.workImg != null){
          this.fjlist = this.form.workImg.split(',')
        }

        })

        // this.getConfirmList();
        // this.getFujian();
    },

    getRefuse(){
      listRefuse({operationType:'1',type:'0',mainId:this.id}).then(response => {
        if(response.rows.length>0){
          this.cancelform = response.rows[0];
        }
      })
      listRefuse({operationType:'1',type:'1',mainId:this.id}).then(response => {
        this.list1 = response.rows;
      })
    },
    zuofei(){
      this.cancelopen = true
    },
    bohui(){
      this.zuofeiopen = true
    },

    // getConfirmList(){
    //   listConfirmContent({pId:this.id,pipelineId:this.form.pipelineId}).then(response => {
    //     this.list = response.rows;
    //   });
    // },
    getScene(){
      listEarthSceneUser({pId:this.id}).then(response => {
        this.confirmationList = response.rows;
        this.confirmationList.forEach((j, index) => {


          j.imgList = []
          if (j.scenePics != '' && j.scenePics != null){
            let a = j.scenePics.split(",");
            j.imgList = a
          }
          j.safeOperationEarthSceneContent.forEach((a,aa) => {
            if (a.checkFlag == 1){
              a.checkFlag = true
            }else {
              a.checkFlag = false
            }
          })
        })
        console.log('ooooooooooooo')
        console.log(this.confirmationList)
      });
    },
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




