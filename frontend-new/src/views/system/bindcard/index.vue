<template>
  <div class="bindcard">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="人员管理" name="人员管理">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="姓名" prop="staffName">
            <el-input
                v-model="queryParams.staffName"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="queryParams.sex" placeholder="请选择人员性别" clearable>
              <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table height="calc(84vh - 160px)" v-loading="loading" :data="staffList">
          <el-table-column label="工号" align="center" prop="staffNo"/>
          <el-table-column label="部门" align="center" prop="deptName"/>
          <el-table-column label="岗位" align="center" key="postName" prop="postName">
            <template #default="scope">
              <template v-for="(arr,index) in scope.row.postIds" :key="arr">
                <template v-for="user in postList" :key="user.postId">
                  <span v-if="Number(arr) === user.postId">{{ user.postName }}</span>
                  <span v-if="Number(arr) === user.postId && index<scope.row.postIds.length-1">,</span>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="staffName"/>
          <el-table-column label="定位标签" align="center" prop="tagId"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button
                  :disabled="scope.row.tagId != null"
                  type="text"
                  icon="Connection"
                  @click="openBindCard(scope.row.staffId, 1, scope.row.tagId)"
              >绑定
              </el-button>
              <el-button
                  :disabled="scope.row.tagId == null"
                  type="text"
                  icon="Delete"
                  @click="unbindCard(scope.row.staffId, 1)"
              >解绑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="承包商管理" name="承包商管理">
        <el-form :model="contractorQueryParams" ref="conqueryRef" :inline="true" v-show="showSearch" label-width="82px">
          <el-form-item label="承包商类型" prop="typeId">
            <el-select v-model="contractorQueryParams.typeId" placeholder="请选择承包商类型" clearable>
              <el-option
                  v-for="t in typeList"
                  :key="t.id"
                  :label="t.typeName"
                  :value="t.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单位名称" prop="deptName">
            <el-input
                v-model="contractorQueryParams.deptName"
                placeholder="请输入单位名称"
                clearable
                @keyup.enter="handleConQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleConQuery">搜索</el-button>
            <el-button icon="Refresh" @click="conresetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="contractorList" @selection-change="handleSelectionChange">
          <el-table-column label="承包商名称" align="center" prop="contractorName"/>
          <el-table-column label="所属企业" align="center" prop="deptName"/>
          <el-table-column label="社会信用代码" align="center" prop="socialCreditCode"/>
          <el-table-column label="承包商类型" align="center" prop="typeName"/>
          <el-table-column label="联系人" align="center" prop="contact"/>
          <el-table-column label="联系电话" align="center" prop="phone"/>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="定位标签" align="center" prop="tagId"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button
                  type="text"
                  icon="Connection"
                  :disabled="scope.row.tagId != null"
                  @click="openBindCard(scope.row.id, 3, scope.row.tagId)"
              >绑定
              </el-button>
              <el-button
                  type="text"
                  icon="Delete"
                  :disabled="scope.row.tagId == null"
                  @click="unbindCard(scope.row.staffId, 3)"
              >解绑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
            v-show="contotal>0"
            :total="contotal"
            v-model:page="contractorQueryParams.pageNum"
            v-model:limit="contractorQueryParams.pageSize"
            @pagination="getListgys"
        />
      </el-tab-pane>
      <el-tab-pane label="访客信息" name="访客信息">
        <el-form :model="visQueryParams" ref="visqueryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="企业编码" prop="enterpriseCode">
            <el-input
                v-model="visQueryParams.enterpriseCode"
                placeholder="请输入企业编码"
                clearable
                @keyup.enter="handleVisQuery"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
                v-model="visQueryParams.name"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleVisQuery"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
                v-model="visQueryParams.phone"
                placeholder="请输入手机号"
                clearable
                @keyup.enter="handleVisQuery"
            />
          </el-form-item>
          <el-form-item label="证件号" prop="credentialNum">
            <el-input
                v-model="visQueryParams.credentialNum"
                placeholder="请输入证件号"
                clearable
                @keyup.enter="handleVisQuery"
            />
          </el-form-item>
          <el-form-item label="公司名称" prop="company">
            <el-input
                v-model="visQueryParams.company"
                placeholder="请输入公司名称"
                clearable
                @keyup.enter="handleVisQuery"
            />
          </el-form-item>
          <el-form-item label="车牌号码" prop="carNum">
            <el-input
                v-model="visQueryParams.carNum"
                placeholder="请输入车牌号码"
                clearable
                @keyup.enter="handleVisQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleVisQuery">搜索</el-button>
            <el-button icon="Refresh" @click="visresetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="visitorList">
          <el-table-column label="姓名" align="center" prop="name"/>
          <el-table-column label="手机号" align="center" prop="phone"/>
          <el-table-column label="性别" align="center" prop="sex"/>
          <el-table-column label="证件类型" align="center" prop="credentialType"/>
          <el-table-column label="证件号" align="center" prop="credentialNum"/>
          <el-table-column label="公司名称" align="center" prop="company"/>
          <el-table-column label="车牌号码" align="center" prop="carNum"/>
          <el-table-column label="定位标签" align="center" prop="tagId"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button
                  type="text"
                  icon="Connection"
                  :disabled="scope.row.tagId != null"
                  @click="openBindCard(scope.row.id, 2, scope.row.tagId)"
              >绑定
              </el-button>
              <el-button
                  type="text"
                  icon="Delete"
                  :disabled="scope.row.tagId == null"
                  @click="unbindCard(scope.row.staffId, 2)"
              >解绑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
            v-show="vistotal>0"
            :total="vistotal"
            v-model:page="visQueryParams.pageNum"
            v-model:limit="visQueryParams.pageSize"
            @pagination="getListvisit"
        />
      </el-tab-pane>

    </el-tabs>
    <el-dialog title="选择定位卡" v-model="openBindCardFlag" width="250px" append-to-body>
      <el-input v-model="staffId" v-show="false"></el-input>
      <el-input v-model="type" v-show="false"></el-input>
      <el-select v-model="selectCard">
        <el-option
            v-for="(row, index) in cardList"
            :key="row.tagId"
            :label="row.tagId"
            :value="row.tagId"
        ></el-option>
      </el-select>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="bindCard">确 定</el-button>
          <el-button @click="openBindCardFlag=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Staff">
import {getToken} from "@/utils/auth";
import {bindStaff, listCard, unbindStaff, filterListCard} from "@/api/system/positionCard";
import {listStaff, getStaff, delStaff, addStaff, updateStaff} from "@/api/system/staff";
import {treeselect} from "@/api/system/dept";
import {listPost} from "@/api/system/post";
import {h} from "vue";

const {proxy} = getCurrentInstance();
const {sys_user_sex, staff_card_type} = proxy.useDict('sys_user_sex', 'staff_card_type');

const activeTab = ref('人员管理');
const staffList = ref([]);
const cardList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const openBindCardFlag = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const contotal = ref(0);
const vistotal = ref(0);
const title = ref("");
const staffId = ref("");
const type = ref("");
const selectCard = ref("");
const deptOptions = ref(undefined);
const postOptions = ref([]);
const postList = ref([]);
/*** 人员导入参数 */
const upload = reactive({
  // 是否显示弹出层（人员导入）
  open: false,
  // 弹出层标题（人员导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的人员数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/staff/importData"
});

const staffType = ref([{label: '内部员工', value: 1}, {label: '访客', value: 2}])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    staffName: null,
    sex: null,
    delFlag: '0'
  },
  contractorQueryParams: {
    pageNum: 1,
    pageSize: 10,
    deptName: null,
    typeId: null,
    delFlag: "0"
  },
  visQueryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    name: null,
    phone: null,
    sex: null,
    credentialType: null,
    credentialNum: null,
    company: null,
    carNum: null,
  },
  rules: {
    deptId: [{required: true, message: "请选择归属部门", trigger: "blur"}],
    //postIds: [{required: true, message: "请选择岗位", trigger: "change"}],
    staffName: [{required: true, message: "人员名称不能为空", trigger: "blur"}],
    staffNo: [{required: true, message: "员工工号不能为空", trigger: "blur"}],
    staffType: [{required: true, message: "人员类型不能为空", trigger: "blur"}],
    sex: [{required: true, message: "请选择性别", trigger: "change"}],
    cardType: [{required: true, message: "请选择证件类型", trigger: "change"}],
    cardNo: [{required: true, message: "证件号不能为空", trigger: "blur"}],
    email: [{type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]}],
    phonenumber: [{
      required: true,
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }],
  }
});

const {queryParams, form, rules, contractorQueryParams, visQueryParams} = toRefs(data);

function getMsg(data) {
  console.log('0000+')
  console.log(data)

  let val = data.id

  if (val == null || val == '' || val == 'undefined') {
    // proxy.$modal.msgWarning("先选择所属部门");
  } else {
    form.value.postIds = null;
    listPost({deptId: val}).then(response => {
      postOptions.value = response.rows;
    });
  }
}

function getposts() {
  listPost({status: '0'}).then(response => {
    postList.value = response.rows;
  });
}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

/** 查询人员管理列表 */
function getList() {
  loading.value = true;
  listStaff(queryParams.value).then(response => {
    staffList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function openBindCard(id, t, tagId) {
  filterListCard().then(res => {
    cardList.value = res.rows
    staffId.value = id
    type.value = t
    if (null !== tagId) {
      selectCard.value = tagId
    } else {
      selectCard.value = null
    }
  })
  openBindCardFlag.value = true
}

function unbindCard(sid, t) {
  ElMessageBox.confirm('确定解除绑定？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    unbindStaff({staffId: sid, bjtType: t}).then(res => {
      proxy.$modal.msgSuccess("解绑成功");
      getList()
      getListvisit()
      getListgys()
    })
  }).catch(() => {
  });
}

function bindCard() {
  bindStaff({staffId: staffId.value, tagId: selectCard.value, bjtType: type.value}).then(res => {
    if (res.code === 200) {
      proxy.$modal.msgSuccess("绑定成功");
      openBindCardFlag.value = false
      getList()
      getListvisit()
      getListgys()
    } else {
      proxy.$modal.msgError(res.msg);
    }
  })
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    staffId: null,
    deptId: null,
    staffName: null,
    staffType: null,
    sex: null,
    birthday: null,
    email: null,
    phonenumber: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    cardType: null,
    cardNo: null,
    jobDescription: null,
    joinedDate: null,
    postIds: null
  };
  postOptions.value = []
  proxy.resetForm("staffRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function handleConQuery() {
  contractorQueryParams.value.pageNum = 1;
  getListgys();
}
function handleVisQuery() {
  visQueryParams.value.pageNum = 1;
  getListvisit();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function conresetQuery() {
  proxy.resetForm("conqueryRef");
  handleQuery();
}
function visresetQuery() {
  proxy.resetForm("visqueryRef");
  handleVisQuery();
}

getTreeselect();
getList();
getposts();


// 供应商
const contractorList = ref([]);
import {
  listContractor,
  getContractor,
  delContractor,
  addContractor,
  updateContractor
} from "@/api/contractorManage/contractor";
import {listContractorTypeDic} from "@/api/contractorManage/contractorTypeDic";

/** 查询承包商类型列表 **/
function getContractorTypeDic() {
  listContractorTypeDic({status: '0'}).then(response => {
    typeList.value = response.rows;
  })
}

/** 查询承包商列表 */
function getListgys() {
  loading.value = true;
  console.log(contractorQueryParams.value)
  listContractor(contractorQueryParams.value).then(response => {
    contractorList.value = response.rows;
    contotal.value = response.total;
    loading.value = false;
  });
}

getContractorTypeDic();
getListgys();

import {getVisitorList, getVisitor, delVisitor, addVisitor, updateVisitor} from "@/api/safework/visitor";
import {getQrcode} from "@/api/safework/visitReservation"
import {updateDept} from "@/api/system/dept"
import {ElMessageBox} from "element-plus";
import {handler} from "@/api/system/alarm";

const visitorList = ref([]);

/** 查询访客信息列表 */
function getListvisit() {
  loading.value = true;
  getVisitorList(visQueryParams.value).then(response => {
    visitorList.value = response.rows;
    vistotal.value = response.total;
    loading.value = false;
  });
}

getListvisit();

</script>


<style scoped lang="scss">
.bindcard {
  background-size: cover !important;
  height: calc(100vh - 84px);
  padding: 5px 15px;

  .demo-tabs {
    height: 100%;

    .pagination-container {
      height: 40px !important;
    }
  }
}

</style>




