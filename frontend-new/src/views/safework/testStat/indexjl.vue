<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="内部职员" name="first">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">

            <el-form-item label="所属部门">
              <tree-select
                  v-model:value="queryParams.enterpriseCode"
                  :options="deptOptions"
                  placeholder="请选择归属公司"
                  :objMap="{ value: 'id', label: 'label', children: 'children' }"
              />
            </el-form-item>
            <el-form-item label="所属分类">
              <el-select v-model="queryParams.category" clearable placeholder="请选择分类">
                <el-option
                    v-for="item in classificationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程名称">
              <el-input v-model="queryParams.courseName" placeholder="请输入课程名称" clearable />
            </el-form-item>
              <el-form-item label="试卷名称">
                <el-input v-model="queryParams.title" placeholder="请输入试卷名称" clearable />
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="queryParams.staffName" placeholder="请输入姓名" clearable />
              </el-form-item>
            <el-form-item label="发布状态">
              <el-select
                  v-model="queryParams.pass"
                  placeholder="请选发布状态"
                  clearable
              >
                <el-option label="全部" value="" />
                <el-option label="不及格" value="0" />
                <el-option label="及格" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="primary" @click="handleExport">导出考试记录</el-button>
              <el-button type="primary" @click="batchExport">批量导出考卷详情</el-button>
<!--              <el-button type="primary" @click="onSubmit">返回</el-button>-->
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="box-card part2">
          <el-table v-loading="loading" :data="resultList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column label="所属部门" sortable align="center" prop="deptName" />
            <el-table-column label="所属计划" sortable align="center" prop=""  />
            <el-table-column label="课程名称" sortable align="center" prop="courseName" />
            <el-table-column label="试卷名称" sortable align="center" prop="title" />
            <el-table-column label="所属分类" sortable align="center" prop="name"  />
            <el-table-column label="总分" sortable align="center" prop="fraction"  />
            <el-table-column label="及格分数" sortable align="center" prop="passing_mark"  />
            <el-table-column label="员工号" sortable align="center" prop="staffNo"   />
            <el-table-column label="姓名" sortable align="center" prop="staffName"  />
            <el-table-column label="考试开始时间" sortable align="center" prop="startTime"  />
            <el-table-column label="考试用时" sortable align="center" prop="testTime"  />
            <el-table-column label="得分" sortable align="center" prop="totalScore"  />
            <el-table-column label="是否合格" sortable align="center" prop="pass"  />
            <el-table-column label="评价结论" sortable align="center" prop="conclusion" >
              <template #default="scope">
                  <dict-tag :options="training_evaluation" :value="scope.row.conclusion"/>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200" style="text-align: center;">
              <template #default="scope">
                <el-button text size="small"  @click="examination(scope.row)" >考试详情</el-button>
                <el-button plain  type="primary" @click="train(scope.row)" size="small">培训评价</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!-- 添加题目弹出 -->
        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
         <!--考试详情-->
         <el-dialog title="试卷详情" v-if="open" v-model="open" width="800px"  append-to-body modal-append-to-body >
            <div id="pdfDom" >
           <div v-for="(item,index) in batch" :key="index"  ref="orderForm">
              <div class="daochu" v-if="index == 0"><el-button type="primary" @click="getPdf()">导出</el-button></div>
              <div class="ksxq-con" >
                <div class="ksxq-top">
                  <el-row >
                    <el-col :span="15" style="margin-top: 10px">
                      <el-row :gutter="20" class="martop">
                        <el-col :span="7"><div class="textl">姓名：</div></el-col>
                        <el-col :span="17">{{item.base.staffName}}</el-col>
                      </el-row>
                      <el-row :gutter="20" class="martop">
                        <el-col :span="7"><div class="textl">考试编码：</div></el-col>
                        <el-col :span="17">{{item.base.paperCode}}</el-col>
                      </el-row>
                      <el-row :gutter="20" class="martop">
                        <el-col :span="7"><div class="textl">试卷名称：</div></el-col>
                        <el-col :span="17">{{item.base.title}}</el-col>
                      </el-row>
                      <el-row :gutter="20" class="martop">
                        <el-col :span="7"><div class="textl">考试开始时间：</div></el-col>
                        <el-col :span="17">{{item.base.startTime}}</el-col>
                      </el-row>
                      <el-row :gutter="20" class="martop">
                      <el-col :span="7"><div class="textl">考试结束时间：</div></el-col>
                      <el-col :span="17">{{item.base.createTime}}</el-col>
                    </el-row>
                    </el-col>
                    <el-col :span="6">
                      <div class="top-right fenshu">{{item.base.totalScore}}<span>分</span>
                        <img src="@/assets/images/safework/fenshu.png" />
                      </div>
                    </el-col>
                    <el-col :span="3">
                      <div class="fenshutop">
                        <img src="@/assets/images/safework/fenshutop.png" />
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="ksxq-con2" >
                  <div v-for="(detail, index) in item.detail" :key="index">
                    <div class="ksxq-title">
                      <el-row>
                        <el-col :span="12"><div>问题{{index+1}}</div></el-col>
                        <el-col :span="12" class="textr"><div>分值：{{detail.fraction}}</div></el-col>
                      </el-row>
                    </div>
                    <div class="neirong">
                      <div class="title">{{detail.title}}</div>
                      <div class="ytganquansc-conbom" v-if="detail.questionType == 1 || detail.questionType == 3">
                      <el-radio-group v-model="detail.answer" class="ml-4">
                        <el-radio
                          v-for="option in detail.optionsJson"
                          :key="option.option"
                          :label="option.option"
                          :name="option.option"
                        >{{ option.option }} {{ option.value }}</el-radio>
                      </el-radio-group>
                      </div>
                    </div>
                    <div class="anquansc-conbom" v-if="detail.questionType == 2" >
                        <el-checkbox-group v-model="detail.answer" shape="square">
                          <el-checkbox v-for="option in detail.optionsJson" :key="option.option" :label="option.option">{{ option.option }} {{ option.value }}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="daan">答案 <span>{{ detail.options }}</span>您选择 {{detail.answer}}</div>
                      <div class="tmfx">
                        <h4>题目解析</h4>
                        <div>{{ detail.analysis }}</div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="CloseButton">关闭</el-button>
              </div>
            </template>
            </el-dialog>
            <!--考试详情end-->
            <!-- 培训评价-->
            <el-dialog title="培训评价" v-if="openpxpj" v-model="openpxpj" width="800px" append-to-body>
              <el-form :model="formpxjh" label-width="120px">
                <el-form-item label="评价内容">
                  <el-input v-model="form.evaluationContent" type="textarea" />
                </el-form-item>
                <el-form-item label="评价结论" >
                  <el-select v-model="form.conclusion" placeholder="请选择结论">
                    <el-option
                      v-for="dict in training_evaluation"
                      :key="dict.value"
                      :label="dict.label"
                      :value="parseInt(dict.value)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="评价人员">
                  <el-input v-model="form.personnel" style="width: 200px"/>
                </el-form-item>
                <el-form-item label="评价日期">
                  <el-date-picker
                      v-model="form.data"
                      type="date"
                      placeholder="请选择日期"
                      :size="size"
                  />
                </el-form-item> -->
              </el-form>
              <template #footer>
                <div class="dialog-footer">
                  <el-button type="primary" @click="submitForm">确 定</el-button>
                  <el-button @click="cancel">取 消</el-button>
                </div>
              </template>
            </el-dialog>
            <!-- 培训评价end-->
      </el-tab-pane>
<!--      <el-tab-pane label="访客" name="second">建设中...</el-tab-pane>-->
    </el-tabs>



  </div>
</template>

<script setup name="restHis">
import {getTestResultListByCourseId} from "@/api/safework/onlinePlan";
import {getTestBaseInfoByResultId} from "@/api/safework/paper";
import {treeselect} from "@/api/system/dept";
import { listCategory} from "@/api/safework/category";
import {getTestResultsByPaperId} from "@/api/safework/answer";
import {addEvaluation,getTestEvaluationInfoByTestResultId} from "@/api/safework/evaluation";
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
import jsPDF from "jspdf";
const { proxy } = getCurrentInstance();
const { training_evaluation } = proxy.useDict('training_evaluation');
const classificationList = ref([]);
const resultList = ref([]);
const activeName = ref('first');
const open = ref(false);
const openpxpj = ref(false);
const paperBaseInfo = ref([]);
const radio1 = ref('1')
const paperResultList= ref([])
const ids = ref([]);
const rows = ref([]);
const batch = ref([]);
const batchBase = ref([]);
const batchDetail = ref([]);
const data = reactive({
  form: {
    evaluationContent:'',
    conclusion:'',
  },
  queryParams: {
    id:proxy.$route.query.id,
  },
  courseId:proxy.$route.query.id,
  baseParams:{
    id:'',
    courseId:proxy.$route.query.id,
  },
  deptOptions:[],
  resultParams:{},
  checked:'',
  htmlTitle: '试卷详情'  //这个也是固定写法，pdf文件下载的名称
});

const formpxjh = reactive({
  evaluate: '',
  conclusion: '',
  personnel: '',
  data: '',
});

const formInline = reactive({
  ProjectName: '',
  schemer: '',
  sort: '',
  region: '',
  date: '',
  section:'',
  status:'',
  PaperTitle:'',
})
const onSubmit = () => {
  getList();
}
const { queryParams, form, rules,quarters,categoryList,dialogQueryParams,staffQueryParams,postQueryParams,deptQueryParams,courseId,baseParams,deptOptions,resultParams,checked,htmlTitle  } = toRefs(data);

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/onlinePlan/exportTestResultList', {
    ...queryParams.value
  }, `resultList${new Date().getTime()}.xlsx`)
}
// 多选框选中数据
function handleSelectionChange(selection) {
  // ids.value = selection.map(item => item.id);
  rows.value = selection
}

function batchExport(){
  batch.value = [];
  batchBase.value = [];
  batchDetail.value = [];
  rows.value.map(row =>{
    baseParams.value.id = row.testPaperId;
    baseParams.value.userId = row.userId;
    baseParams.value.deptId = row.enterpriseCode;
    resultParams.value.testPaperId = row.testPaperId;
    resultParams.value.userId = row.userId;
    resultParams.value.enterpriseCode = row.enterpriseCode;
    getResultList();
 })
}
function getResultList(){
  var result = {
    base : null,
    detail : null,
  }
  paperBaseInfo.value = [];
  getTestBaseInfoByResultId(baseParams.value).then(response =>{
    paperBaseInfo.value = response.data
    result.base = paperBaseInfo.value;
  })
  paperResultList.value = [];
  getTestResultsByPaperId(resultParams.value).then(response =>{
    paperResultList.value = response.rows
    paperResultList.value.forEach(element => {
      element.optionsJson = JSON.parse(element.optionsJson);
      element.correctJson = JSON.parse(element.correctJson);
      element.options = [],
      element.correctJson.forEach(option=>{
        element.options.push(option.option)
      })
      if(element.questionType == 2){
        element.answer = JSON.parse(element.answer);
      }
      if(element.answer == null){
        element.answer = ''
      }
    });
    result.detail = paperResultList.value;
7 })
  batch.value.push(result)
  setTimeout(() => {
    open.value = true;
  }, 500);
}

function examination(row) {
  batch.value = [];
  batchBase.value = [];
  batchDetail.value = [];
  baseParams.value.id = row.testPaperId;
  baseParams.value.userId = row.userId;
  baseParams.value.deptId = row.enterpriseCode;
  resultParams.value.testPaperId = row.testPaperId;
  resultParams.value.userId = row.userId;
  resultParams.value.enterpriseCode = row.enterpriseCode;
  getResultList()
}

function getClassList() {
  listCategory({state: 0}).then(res => {
    classificationList.value = res.rows
  })
}
/** 初始化部门数据 */
function initTreeData() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
}

function getList() {
  getTestResultListByCourseId(queryParams.value).then(response => {
    resultList.value = response.rows;
  });
};


function train(row) {
  openpxpj.value = true;
  form.value.testResultId = row.id
  getTestEvaluationByTestResultId();
}
// 关闭按钮
function CloseButton() {
  open.value = false;
  batch.value = [];
  batchBase.value = [];
  batchDetail.value = [];
}
// 取消按钮
function cancel() {
  openpxpj.value = false;
}
// 确定提交按钮
function submitForm() {
  openpxpj.value = false;
  addEvaluation(form.value).then(response=>{
  })
}

// function exportPDF() {
//   const doc = new jsPDF();
//   doc.text('1111111111111', 10, 10);
//   doc.save('example.pdf');
// }

function getPdf(title) {

  var title = htmlTitle.value;
  html2Canvas(document.querySelector('#pdfDom'), {
  allowTaint: true
}).then(function(canvas) {
    let contentWidth = canvas.width
    let contentHeight = canvas.height
    let pageHeight = (contentWidth / 592.28) * 841.89
    let leftHeight = contentHeight
    let position = 0
    let imgWidth = 595.28
    let imgHeight = (592.28 / contentWidth) * contentHeight
    let pageData = canvas.toDataURL('image/jpeg', 1.0)
    let PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(title + '.pdf')
  })

}
function getTestEvaluationByTestResultId(){
  getTestEvaluationInfoByTestResultId(form.value.testResultId).then(response =>{
   if(response.data != null){
    form.value = response.data
   }
  })
}
initTreeData();
getList();
getClassList();
</script>
<style scoped lang="scss">
.timutable{
  width: 100%;

}
.tags{
  .el-tag{
    margin: 10px 10px 0 0
  }
}
.app-container{
  .part2{
    margin-top: 15px;

  }
}
.ksxq-con{
  .ksxq-top{
    background: #fafafa;
    border: 1px solid #e3e3e3;
    padding: 0 10px 20px;
    .martop{
      margin-top: 10px;
    }
    .textl{
      text-align: right;
    }
    .top-right{
      font-size: 30px;
      span{
        font-size: 14px;
      }
    }
    .fenshu{
      text-align: center;
      margin-top: 50px;
      img{
        width: 140px;
      }
    }
    .fenshutop{
      img{
        width: 50px;
      }
    }

  }
.ksxq-con2{
  border: 1px solid #e3e3e3;
  margin-top: 10px;
  .textr{
    text-align: right;
  }
  .ksxq-title{
    padding: 10px;
    background: #fafafa;
    border-bottom: 1px solid #e3e3e3;
  }
  .anquansc-conbom ,.daan{
    padding:2px 10px;
  }
  .tmfx
{ padding:2px 10px;
  margin: 15px 0px 10px;
}
  .neirong{
    padding: 10px;
    .daan{
      padding: 4px 0 8px;
      sapn{
        color: #1ab394;
      }
    }
    .jiexi{

    }

  }

}
}
.daochu{
  text-align: right;
  margin-bottom: 10px;
  margin-top: -50px;
}
#pdfDom {
  padding:10px 20px;
}
</style>
