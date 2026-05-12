<template>
  <div class="weixiugongdan">
    <el-card class="tools">
      <el-form :model="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <div class="rightsearch">
              <el-button class="btn green" @click="searchOne">
                <el-icon><Search /></el-icon> 查询
              </el-button>
<!--              <el-button class="btn" @click="search">-->
<!--                <el-icon><Filter /></el-icon>筛查-->
<!--              </el-button>-->
            </div>
          </el-col>

          <el-col :span="24">
            <el-row>
<!--              <el-col :span="6">-->
<!--                <el-form-item label="工段">-->
<!--                  <el-select v-model="form.gongduan" placeholder="请选择">-->
<!--                    <el-option label="工段一" value="工段一" />-->
<!--                    <el-option label="工段二" value="工段二" />-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
              <el-col :span="6">
                <el-form-item label="单元">
                  <el-select v-model="form.sectionId" placeholder="请选择" clearable>
                    <el-option
                        v-for="item in sectionOptions"
                        :key="item.sectionId"
                        :label="item.sectionName"
                        :value="item.sectionId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备名称">
                  <el-select v-model="form.deviceId" placeholder="请选择" clearable>
                    <el-option
                        v-for="item in options"
                        :key="item.eqId"
                        :label="item.eqName"
                        :value="item.eqId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="负责人">
                  <el-select v-model="form.principalId" placeholder="请选择" clearable>
                    <el-option
                        v-for="item in personcolumns"
                        :key="item.userId"
                        :label="item.nickName"
                        :value="item.userId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="维修状态">
                  <el-select v-model="form.state" placeholder="请选择" clearable>
                    <el-option label="待维修" value="2" />
                    <el-option label="待验收" value="3" />
                    <el-option label="暂不整改" value="4" />
                    <el-option label="完成" value="6" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row>
<!--              <el-col :span="12">-->
<!--                <el-form-item label="日期">-->
<!--                  <el-row>-->
<!--                    <el-col :span="11">-->
<!--                      <el-date-picker-->
<!--                          v-model="form.date1"-->
<!--                          type="date"-->
<!--                          placeholder="开始日期"-->
<!--                          style="width: 100%"-->
<!--                      />-->
<!--                    </el-col>-->
<!--                    <el-col :span="2" class="text-center">-->
<!--                      <span style="color: #aaa;">—</span>-->
<!--                    </el-col>-->
<!--                    <el-col :span="11">-->
<!--                      <el-date-picker-->
<!--                          v-model="form.date2"-->
<!--                          type="date"-->
<!--                          placeholder="结束日期"-->
<!--                          style="width: 100%"-->
<!--                      />-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="6">-->
<!--                <el-form-item label="维修状态">-->
<!--                  <el-select v-model="form.state" placeholder="请选择">-->
<!--                    <el-option label="维修状态一" value="维修状态一" />-->
<!--                    <el-option label="维修状态二" value="维修状态二" />-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="6">-->
<!--                <el-form-item label="工单号">-->
<!--                  <el-input v-model="form.number" />-->
<!--                </el-form-item>-->
<!--              </el-col>-->
            </el-row>
          </el-col>

        </el-row>
      </el-form>
    </el-card>

    <el-card class="info">

      <el-row :gutter="10">
        <el-col :span="5" class="mar">
          <div class="item">
            <el-row>
              <el-col :span="7">
                <img src="@/assets/images/baoyang/baoyang-gdico1.png"/>
              </el-col>
              <el-col :span="17">
                <h3 class="blue">{{allform.wancheng}}</h3>
                <h5>完成工单</h5>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5" class="mar">
          <div class="item">
            <el-row>
              <el-col :span="7">
                <img src="@/assets/images/baoyang/baoyang-gdico2.png"/>
              </el-col>
              <el-col :span="17">
                <h3 class="red">{{allform.weixiu}}</h3>
                <h5>待维修工单</h5>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5" class="mar">
          <div class="item">
            <el-row>
              <el-col :span="7">
                <img src="@/assets/images/baoyang/baoyang-gdico3.png"/>
              </el-col>
              <el-col :span="17">
                <h3 class="green">{{ allform.yanshou }}</h3>
                <h5>待验收工单</h5>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5" class="mar">
          <div class="item">
            <el-row>
              <el-col :span="7">
                <img src="@/assets/images/baoyang/baoyang-gdico4.png"/>
              </el-col>
              <el-col :span="17">
                <h3 class="orange">{{allform.haoshi}}</h3>
                <h5>维修耗时(h)</h5>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5" class="mar">
          <div class="item">
            <el-row>
              <el-col :span="7">
                <img src="@/assets/images/baoyang/baoyang-gdico2.png"/>
              </el-col>
              <el-col :span="17">
                <h3 class="orange">{{allform.chaoqi}}</h3>
                <h5>维修超期</h5>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- <表格 -->
    <div class="table">
      <div class="header">

        <el-row>
          <el-col :span="12"><div class="card-tit">维修工单</div></el-col>
          <el-col :span="12">
<!--            <el-button class="toolbtn" @click="newbuild">-->
<!--              <el-icon><Plus /></el-icon> 新建-->
<!--            </el-button>-->
<!--             新建弹出-->
            <div class="addtanchu">
              <el-dialog
                  v-model="dialogVisible"
                  title="维修工单"
                  width="60%"
              >
                <el-form :model="addform" ref="addformRef" label-width="100px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="单元">
                        <el-select multiple v-model="addform.unit" placeholder="请选择(可多人)">
                          <el-option label="单元1" value="单元1" />
                          <el-option label="单元2" value="单元2" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="维修设备">
                        <el-input v-model="addform.name" placeholder="请输入" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="维修规则">
                        <el-radio-group v-model="addform.rules">
                          <el-radio label="周期保护" />
                          <el-radio label="指定时间保养" />
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="维修内容">
                        <el-input v-model="addform.content" type="textarea" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="维修状态">
                        <el-radio-group v-model="addform.state">
                          <el-radio label="进行中" />
                          <el-radio label="完成" />
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="维修操作人">
                        <el-select multiple v-model="addform.operator" placeholder="请选择(可多人)">
                          <el-option label="操作人1" value="操作人1" />
                          <el-option label="操作人2" value="操作人2" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="维修确认人">
                        <el-select v-model="addform.confirmer" placeholder="请选择(单选)">
                          <el-option label="确认人1" value="确认人1" />
                          <el-option label="确认人2" value="确认人2" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="维修计划时间">
                        <el-input v-model="addform.time" placeholder="请输入" />
                        <span class="danwei">(单位：小时)</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="维修完成时间">
                        <el-input v-model="addform.endtime" placeholder="请输入" />
                        <span class="danwei">(单位：小时)</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <template #footer>
									<span class="dialog-footer">
										<el-button @click="dialogVisible = false" class="btn">取消</el-button>
										<el-button @click="save" class="btn green">保存</el-button
                    >
									</span>
                </template>
              </el-dialog>
            </div>
          </el-col>
        </el-row>

      </div>
      <el-table
          :data="tableData"
          stripe="true"
          border
          style="width: 100%"
          v-loading="loading"
      >
        <el-table-column prop="id" label="工单号"/>
        <el-table-column prop="sectionName" label="单元"/>
        <el-table-column prop="deviceName" label="设备"/>
        <el-table-column prop="state" label="状态" >
          <template #default="scope">
            <span class="ok" v-if="scope.row.status == 1">待发布</span>
            <span class="ok" v-if="scope.row.status == 2">待维修</span>
            <span class="ok" v-if="scope.row.status == 3">待验收</span>
            <span class="ok" v-if="scope.row.status == 4">暂不整改</span>
            <span class="ok" v-if="scope.row.status == 5">继续整改</span>
            <span class="ok" v-if="scope.row.status == 6">完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="faulttype" label="设备故障" />
        <el-table-column prop="sponsorName" label="发起人" />
        <el-table-column prop="principalName" label="负责人" />
<!--        <el-table-column prop="maintain" label="维修人" />-->
<!--        <el-table-column prop="acceptance" label="验收人" />-->
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="getdetail(scope.row)" class="btn">查看详情</el-button>
<!--            <el-button link @click="record(scope.row)" class="btn green">上传交底单</el-button>-->
         </template>
        </el-table-column>
      </el-table>

      <!--查看详情弹出-->
      <div class="edittanchu">
        <el-dialog
            v-model="editdialogVisible"
            title="查看详情"
            width="60%"
        >
          <div class="edittanchu-con">
<!--            <h4>浩普新材料科技股份有限公司/回收单元/丁二烯输送泵（GA513B）</h4>-->
            <div class="con">
              <div class="box">
                <ul v-html="flowhtml"></ul>
              </div>
<!--              <el-timeline >-->
<!--                <div v-html="flowhtml"></div>-->
<!--              </el-timeline>-->




            </div>
          </div>
        </el-dialog>
      </div>
      <!--查看详情弹出end-->



      <!-- 页码 -->
      <div class="pages">

<!--        <el-pagination-->
<!--            background-->
<!--            :total="total"-->
<!--            v-model:page="form.pageNum"-->
<!--            v-model:limit="form.pageSize"-->
<!--            @pagination="getlist"-->
<!--        />-->
        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="form.pageNum"
            v-model:limit="form.pageSize"
            @pagination="getlist"
        />
<!--        <el-button @click="confirm" class="pagebtn">确定</el-button>-->
      </div>
<!--      <pagination-->
<!--          v-show="total>0"-->
<!--          :total="total"-->
<!--          v-model:page="form.pageNum"-->
<!--          v-model:limit="form.pageSize"-->
<!--          @pagination="getlist"-->
<!--      />-->


    </div>

  </div>

</template>


<script>
import { reactive } from "vue"
import {allWorkorder,listWorkorder,getWorkorder} from "@/api/unitManage/workorder"
import { listSection } from "@/api/unitmanage/section";
import { listDevice } from "@/api/unitmanage/device";
import { userList } from "@/api/system/user";
import { listFlowpath } from "@/api/unitManage/flowpath";
import { getRepairorder } from "@/api/unitManage/repairorder";
import { getAcceptanceorder } from "@/api/unitManage/acceptanceorder";
import { listrepairattachment } from "@/api/unitManage/repairattachment";

export default {
  name: "维修工单",
  data() {
    return {
      form: reactive({
        pageNum: 1,
        pageSize: 10,
        sectionId: null,
        deviceId: null,
        principalId: null,
        state: null
      }),
      dialogVisible: false,
      editdialogVisible:false,
      tableData: [],
      total: 20,
      allform:{},
      sectionOptions:[],
      options: [],
      personcolumns:[],
      flowlist:[],
      flowhtml:"",
      zhanwei:'--'
    }
  },
  mounted() {
    this.getall()
    this.getDeviceList();//获取设备数据
    this.getUser()
    this.getlist()
    this.listSection()
  },
  methods: {
    getall(){
      allWorkorder(this.form).then(res => {
        this.allform = res.data

      })
    },
    getlist(){
      listWorkorder(this.form).then(res => {
        this.tableData = res.rows
        this.total = res.total;
      })
    },
    listSection() {
      listSection().then(response => {
        this.sectionOptions = response.data;//list数据
      });
    },
    //获取设备数据
    getDeviceList() {
      listDevice().then(response => {
        this.options = response.rows;//list数据
      });
    },
    getUser() {
      userList().then(res => {
        this.personcolumns = res.rows
      })
    },
    searchOne() {
      this.getlist()
      this.getall()
    },
    newbuild() {
      this.dialogVisible = true;
    },
    fangfaming (value) {
      if (value) {
        if (value !== undefined && value !== null && value !== '') {
          return value
        } else {
          return '--'
        }
      }
    },
    getdetail(row) {

      getWorkorder(row.id).then(res => {
        console.log(res)
        let imgurl = ''
        listrepairattachment({reId:row.id,type:1}).then(fjlist => {
          console.log(fjlist)
          // this.fjlist = res.rows;
          if (fjlist.rows.length > 0){
            for (let i = 0;i<fjlist.rows.length;i++){
              imgurl += '<i data-v-3253b4ea><img data-v-3253b4ea src="'+fjlist.rows[i].address+'" /></i>'
            }
          }

              this.flowhtml = '<li data-v-3253b4ea>'+
                '<span data-v-3253b4ea class="yuandian"></span>'+
                '<div class="queren" data-v-3253b4ea>发布</div>'+
                '<div class="neirong" data-v-3253b4ea>'+
                  '<div class="neirong-ul" data-v-3253b4ea>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>设备：</span>'+res.data.deviceName+'</div>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>故障类型：</span>'+res.data.faulttype+'</div>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>故障详情：</span>'+res.data.fault+'</div>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>重要性c：</span>'+res.data.importance+'</div>'+
                  '</div>'+
                  '<div class="neirong-ul" data-v-3253b4ea>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>发起人：</span>'+res.data.sponsorName+'</div>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>发起时间：</span>'+res.data.startTime+'</div>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>维修负责人：</span>'+res.data.principalName+'</div>'+
                  '</div>'+
                  '<div class="neirong-ul" data-v-3253b4ea>'+
                    '<div class="neirong-li photo-img" data-v-3253b4ea><span data-v-3253b4ea class="photo">图片：</span>'+imgurl+'</div>'+
                  '</div>'+
                '</div>'+
                '<div class="zuoce" data-v-3253b4ea>发起</div>'+
              '</li>'

          this.flowhtml = this.flowhtml.replace(/null/g, "--")

        })
        console.log(imgurl)
      })
      listFlowpath({woId:row.id}).then(res => {
        this.flowlist = res.rows;
        if (this.flowlist.length > 0){
          for (let i = 0;i<this.flowlist.length;i++){
            if (this.flowlist[i].type == 1){
              if (this.flowlist[i].operate == '暂不维修'){
                this.flowhtml += '<li data-v-3253b4ea>'+
                    '<span data-v-3253b4ea class="yuandian"></span>'+
                    '<div class="queren" data-v-3253b4ea>暂不维修</div>'+
                    '<div class="neirong" data-v-3253b4ea>'+
                    '<div class="neirong-ul" data-v-3253b4ea>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>操作人：</span>'+this.flowlist[i].userId+'</div>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>操作时间：</span>'+this.flowlist[i].operateTime+'</div>'+
                    '</div>'+
                    '<div class="neirong-ul" data-v-3253b4ea>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>暂不维修理由：</span>'+this.flowlist[i].remark+'</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="zuoce" data-v-3253b4ea>发布</div>'+
                    '</li>'
                this.flowhtml = this.flowhtml.replace(/null/g, "--")
              }
            }else if (this.flowlist[i].type == 2){
              if (this.flowlist[i].operate == '暂不维修'){
                this.flowhtml += '<li data-v-3253b4ea>'+
                    '<span data-v-3253b4ea class="yuandian"></span>'+
                    '<div class="queren" data-v-3253b4ea>暂不维修</div>'+
                    '<div class="neirong" data-v-3253b4ea>'+
                    '<div class="neirong-ul" data-v-3253b4ea>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>操作人：</span>'+this.flowlist[i].userId+'</div>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>操作时间：</span>'+this.flowlist[i].operateTime+'</div>'+
                    '</div>'+
                    '<div class="neirong-ul" data-v-3253b4ea>'+
                    '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>暂不维修理由：</span>'+this.flowlist[i].remark+'</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="zuoce" data-v-3253b4ea>维修</div>'+
                    '</li>'
                this.flowhtml = this.flowhtml.replace(/null/g, "--")
              }else {
                getRepairorder(this.flowlist[i].paId).then(res => {
                  console.log('1111')
                  let imgurl = ''
                  listrepairattachment({reId:this.flowlist[i].paId,type:2}).then(fjlist => {
                    if (fjlist.rows.length > 0){
                      for (let i = 0;i<fjlist.rows.length;i++){
                        imgurl += '<i data-v-3253b4ea><img data-v-3253b4ea src="'+fjlist.rows[i].address+'" /></i>'
                      }
                    }

                    this.flowhtml += '<li data-v-3253b4ea>'+
                        '<span data-v-3253b4ea class="yuandian"></span>'+
                        '<div class="queren" data-v-3253b4ea>维修</div>'+
                        '<div class="neirong" data-v-3253b4ea>'+
                        '<div class="neirong-ul" data-v-3253b4ea>'+
                        '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>故障诊断：</span>'+res.data.troubleshooting+'</div>'+
                        '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>维修方法：</span>'+res.data.repairmethod+'</div>'+
                        '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>维修人：</span>'+res.data.repairName+'</div>'+
                        '</div>'+
                        '<div class="neirong-ul" data-v-3253b4ea>'+

                        '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>补充说明：</span>'+res.data.remark+'</div>'+
                        '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>维修时间：</span>'+res.data.repairTime+'</div>'+
                        '</div>'+
                        '<div class="neirong-ul" data-v-3253b4ea>'+
                        '<div class="neirong-li photo-img" data-v-3253b4ea><span data-v-3253b4ea class="photo">图片：</span>'+imgurl+'</div>'+
                        '</div>'+
                        '</div>'+
                        '<div class="zuoce" data-v-3253b4ea>维修</div>'+
                        '</li>'
                    this.flowhtml = this.flowhtml.replace(/null/g, "--")
                  })
                })
              }
            }else if (this.flowlist[i].type == 3){
              getAcceptanceorder(this.flowlist[i].paId).then(res => {
                console.log('222')
                let zt = ''
                if (res.data.status == null){
                  zt = '未验收'
                }else if (res.data.status == 1){
                  zt = '验收通过'
                }else {
                  zt = '继续整改'
                }
                let imgurl = ''
                listrepairattachment({reId:this.flowlist[i].paId,type:3}).then(fjlist => {
                  // this.fjlist = res.rows;
                  if (fjlist.rows.length > 0){
                    for (let i = 0;i<fjlist.rows.length;i++){
                      imgurl += '<i data-v-3253b4ea><img data-v-3253b4ea src="'+fjlist.rows[i].address+'" /></i>'
                    }
                  }
                  this.flowhtml += '<li data-v-3253b4ea>'+
                      '<span data-v-3253b4ea class="yuandian"></span>'+
                      '<div class="queren" data-v-3253b4ea>'+zt+'</div>'+
                      '<div class="neirong" data-v-3253b4ea>'+
                      '<div class="neirong-ul" data-v-3253b4ea>'+
                      '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>验收时间：</span>'+res.data.updateTime+'</div>'+
                      '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>验收人：</span>'+res.data.acceptanceName+'</div>'+
                      '</div>'+
                      '<div class="neirong-ul" data-v-3253b4ea>'+
                      '<div class="neirong-li" data-v-3253b4ea><span data-v-3253b4ea>补充说明：</span>'+res.data.remark+'</div>'+
                      '</div>'+
                      '<div class="neirong-ul" data-v-3253b4ea>'+
                      '<div class="neirong-li photo-img" data-v-3253b4ea><span data-v-3253b4ea class="photo">图片：</span>'+imgurl+'</div>'+
                      '</div>'+
                      '</div>'+
                      '<div class="zuoce" data-v-3253b4ea>验收</div>'+
                      '</li>'


                  this.flowhtml = this.flowhtml.replace(/null/g, "--")
                })
              })
            }
          }
          console.log(this.flowhtml)


        }
        this.editdialogVisible = true;
      })


    }
  }
}


</script>

<style scoped lang="scss">
.weixiugongdan{
  padding: 10px;background: #f3f3f4;
  height: calc(100vh - 84px);

  //查看详情
  .edittanchu{
    .edittanchu-con{
      .con{
        .box{
          list-style-type: none;
          margin: 0;
          padding: 0;
          position: relative;
          transition: all 0.5s linear;
          top: 0;
        }
        .box{
          width: 95%;
          margin: 0 auto;
          &::before{
            content:' ';
            clear: both;display: table;
            width: 2px;
            height: 100%;
            border: 1px solid #09bec5;
            position: absolute;
            top: 0;
            left: 30px;
          }

        }
        li{
          position: relative;
          list-style: none;
          .yuandian{
            &::before{
              content: "";
              display: block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #09bec5;
              position: absolute;
              left:-14px;
            }
          }
          .queren{
            display: initial;
            color: #09bec5;
            background: #e0ffff;
            border: 1px solid #98e8eb;
            padding: 4px 10px;
            border-radius: 50px;
          }
          .neirong{
            margin: 20px 0 20px;;
            position: relative;
            padding: 20px 10px;
            background: #f6fcfc;
            color: #333;
            border-radius: 10px;
            line-height: 20px;
            display: inline-block;
            width: 100%;
            .neirong-ul{
              width: 33.33%;
              float: left;
              .neirong-li{
                margin: 0 0 8px;
                display: flex;
                vertical-align: top;
              }
              span{
                color: #5c5c5c;
                width: 90px;
              }
              span.photo{
                width: auto!important;
              }
              .photo-img{
                i{
                  width: 100px;
                  img{
                    width: 100%;
                  }
                }
              }
            }
          }
          .zuoce{
            position: absolute;
            top: 0;
            left: -50px;
          }


        }



      }

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
    .mar{
      margin-right: -18px;
    }
  }
  .tools{
    margin: 0 0 10px;
    :deep(.el-card__body) {padding-bottom: 0;}
    :deep(.el-select) {width: 100%;}
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

    .addtanchu{

      .danwei{
        position: absolute;right: 10px;top: 0;line-height: 32px;
        color: #aaa;
      }
      .textcenter{text-align: center;line-height: 1;}
      .parts{
        :deep(.el-row) {height: auto;margin: 10px 0 0;}
        :deep(.el-form-item__content) {
          display: block;
        }
        .partremove{
          cursor: pointer;
        }
        .partadd{
          color: #09bec5;cursor: pointer;
          :deep(.el-icon) {
            line-height: 1;vertical-align: middle;display: inline-block;
            height: auto;
          }
        }
      }
      .dialog-footer{
        display: block;width: 100%;text-align: center;margin-top: -20px;
        padding: 0 0 20px;
        .btn{
          width: 200px;
        }
        .green{background: #09bec5;color: #fff;border-color: #09bec5;}
      }
      :deep(.el-form) {
        .el-select{
          width: 100%;
        }
      }
      :deep(.el-dialog) {
        overflow: hidden;
        .el-dialog__header{
          box-shadow: 0 5px 10px #eee;
        }
      }
    }
  }
  .table{
    padding: 10px;border: 1px solid #eee;background: #fff;
    box-shadow: 0 0 5px #eee;border-radius: 5px;
    height: calc(100% - 280px);position: relative;
    margin: 10px 0 0;
    .header{
      margin: 0 0 10px;
      padding: 10px 15px;
      border-bottom: 1px solid #f0f0f0;
      .card-tit {
        padding-left: 10px;
        border-left: 5px solid #09bec5;
        font-size: 18px;
      }
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
      position: absolute;padding-right: 70px;
      right: 20px;bottom: 10px;
      :deep(.el-pagination) {
        padding: 0;
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
    .toolbtn{
      float: right;border: 0;color: #333333;
    }
  }
}
//1366屏幕响应
@media screen and (max-width: 1366px) {
  .weixiugongdan{
    height: auto;
    .table{
      padding: 10px 10px 50px;
    }
    .info {
      .item{
        padding: 20px 15px;
        .orange{
          text-align:center;
        }
        .green{
          text-align:center;
        }
        .red{
          text-align:center;
        }
        .blue{
          text-align:center;
        }
        h5{
          text-align: center;
        }
      }
    }
  }
}
</style>

