<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
          <el-option
              v-for="dict in sys_normal_disable"
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

    <el-row :gutter="10" class="mb8 toolsline">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd(undefined)"
            v-hasPermi="['system:dept:add']"
        >新增
        </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="info"
              plain
              icon="Upload"
              @click="handleImport"
              v-hasPermi="['system:dept:add']"
          >导入
          </el-button>
        <el-button type="warning" plain icon="download"
          @click="importTemplate">下载模板
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Sort"
            @click="toggleExpandAll"
        >展开/折叠
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table

        v-if="refreshTable"
        v-loading="loading"
        :data="deptList"
        height="calc(100vh - 200px)"
        row-key="deptId"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="staffNum" label="人员数量" width="260"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:dept:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Plus"
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:dept:add']"
          >新增
          </el-button>
          <el-button
              v-if="scope.row.parentId != 0"
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:dept:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="deptRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0 && form.parentId !== 100">
            <el-form-item label="上级部门" prop="parentId">
              <tree-select
                  v-model:value="form.parentId"
                  :options="deptOptions"
                  :objMap="{ value: 'deptId', label: 'deptName', children: 'children' }"
                  placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11"/>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="邮箱" prop="email">-->
<!--              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in sys_normal_disable"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="经度" prop="lng">-->
<!--              <el-input v-model="form.lng" placeholder="请输入经度" maxlength="50"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="纬度" prop="lat">-->
<!--              <el-input v-model="form.lat" placeholder="请输入纬度" maxlength="50"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12" v-if="store.getters.roles == 'admin'">-->
<!--            <el-form-item label="appId" prop="appId">-->
<!--              <el-input v-model="form.appId" placeholder="" maxlength="50" readonly/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12" v-if="store.getters.roles == 'admin'">-->
<!--            <el-form-item label="appSecret" prop="appSecret">-->
<!--              <el-input v-model="form.appSecret" placeholder="" maxlength="50" readonly/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="省" prop="province">-->
<!--              <el-select v-model="form.province" placeholder="选择省份" clearable @change="provinceChange($event)">-->
<!--                <el-option-->
<!--                    v-for="dict in provinces"-->
<!--                    :key="dict.areaid"-->
<!--                    :label="dict.areaname"-->
<!--                    :value="dict.areaid +''"-->
<!--                />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="市" prop="city">-->
<!--              <el-select v-model="form.city" placeholder="选择市" clearable @change="cityChange($event)">-->
<!--                <el-option-->
<!--                    v-for="dict in citys"-->
<!--                    :key="dict.areaid"-->
<!--                    :label="dict.areaname"-->
<!--                    :value="dict.areaid +''"-->
<!--                />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="区" prop="district">-->
<!--              <el-select v-model="form.district" placeholder="选择市" clearable>-->
<!--                <el-option-->
<!--                    v-for="dict in dists"-->
<!--                    :key="dict.areaid"-->
<!--                    :label="dict.areaname"-->
<!--                    :value="dict.areaid +''"-->
<!--                />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12" v-if="store.getters.roles == 'admin'">-->
<!--            <el-form-item label="账套数量" prop="accountTotal">-->
<!--              <el-input v-model="form.accountTotal" placeholder="请输入账套数量限制" maxlength="11"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            &lt;!&ndash; <el-form-item label="服务上云" v-show="serviceAndUsers"> &ndash;&gt;-->
<!--            <el-form-item label="服务上云">-->
<!--              <el-radio-group v-model="form.store">-->
<!--                <el-radio-->
<!--                    v-for="dict in store_disable"-->
<!--                    :key="dict.value"-->
<!--                    :label="dict.value"-->
<!--                >{{ dict.label }}-->
<!--                </el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="用户数量" >-->
<!--              &lt;!&ndash; <el-form-item label="用户数量" v-show="serviceAndUsers"> &ndash;&gt;-->
<!--              <el-input v-model="form.userNum" placeholder="请输入用户数量"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 部门导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的部门数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Dept">
import {listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild, getDeptInfo,getSecondDeptByDeptId} from "@/api/system/dept";
import {listArea,getArea} from "@/api/system/area";
import {h} from "vue";
import {getToken} from "@/utils/auth";

const {proxy} = getCurrentInstance();
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");

const deptList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const deptOptions = ref([]);
const provinces = ref([]);
const citys = ref([]);
const dists = ref([]);
const isExpandAll = ref(true);
const refreshTable = ref(true);
const store = useStore();
const parentId = ref("");
const serviceAndUsers = ref(true);
const store_disable = ref([{value:'1',label:'是'},{value:'0',label:'否'}]);
const data = reactive({
  form: {userNum:0},
  queryParams: {
    deptName: undefined,
    status: undefined
  },
  rules: {
    parentId: [{required: true, message: "上级部门不能为空", trigger: "blur"}],
    deptName: [{required: true, message: "部门名称不能为空", trigger: "blur"}],
    orderNum: [{required: true, message: "显示排序不能为空", trigger: "blur"}],
    email: [{type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]}],
    phone: [{pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"}]
  },
  level:'',
});

const {queryParams, form, rules} = toRefs(data);

/*** 部门导入参数 */
const upload = reactive({
  // 是否显示弹出层（部门导入）
  open: false,
  // 弹出层标题（部门导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的部门数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/dept/importData"
});


/** 根据名称筛选区域树 */
watch(parentId, val => {
  form.value.parentId = val;
  thirdDeptByDeptId(val);
});
/** 查询省份列表 */
function getProvinceList(level,parentId) {
  let areaQueryParams = {
    level:level,
    parentid:parentId
  };
  listArea(areaQueryParams).then(response => {
    if(level == 1){
      provinces.value = response.data;
    }else if(level == 2){
      citys.value = response.data;
    }else{
      dists.value = response.data;
    }
    console.log(form.value.parentId)
  });
}
function provinceChange(value){
  getProvinceList(2,value);
}
function cityChange(value){
  getProvinceList(3,value);
}

function thirdDeptByDeptId(deptId){
  let params = {
    deptId : deptId
  }
  getSecondDeptByDeptId(params).then(response =>{
    if(response.data.ancestors.split(",").length >= 3)
    serviceAndUsers.value = false
    else serviceAndUsers.value = true
  })
}
/** 查询部门列表 */
function getList() {
  loading.value = true;
  listDept(queryParams.value).then(response => {
    deptList.value = proxy.handleTree(response.data, "deptId");
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    deptId: null,
    parentId: null,
    deptName: null,
    orderNum: 0,
    leader: null,
    phone: null,
    email: null,
    status: "0",
    store:"1",
    userNum:0
  };
  proxy.resetForm("deptRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download("system/dept/importTemplate", {}, `dept_template_${new Date().getTime()}.xlsx`);
};

/** 导入按钮操作 */
function handleImport() {
  upload.title = "部门导入";
  upload.open = true;
};


/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

/** 新增按钮操作 */
async function handleAdd(row) {
  reset();
  await getDeptInfo().then(response => {
    form.value.appId = response.data.appId;
    form.value.appSecret = response.data.appSecret;
  });
  //form.value.appId = GetUniqueID();
  //form.value.appSecret = GetUniqueID();
  await listDept().then(response => {
    deptOptions.value = proxy.handleTree(response.data, "deptId");
  });
  if (row != undefined) {
    form.value.parentId = row.deptId;
  }
  open.value = true;
  title.value = "添加部门";
  getProvinceList(1,'');
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  await listDeptExcludeChild(row.deptId).then(response => {
    deptOptions.value = proxy.handleTree(response.data, "deptId");
  });
  getDept(row.deptId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改部门";
    provinceChange(form.value.province)
    cityChange(form.value.city)
  });
  getProvinceList(1,'');
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deptRef"].validate(valid => {
    if (valid) {
      if (form.value.deptId != undefined) {
        updateDept(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDept(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delDept(row.deptId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

// 唯一标识符
function GetUniqueID () {
  // 当前时间转成 36 进制字符串
  let time = Date.now().toString(36)
  // 当前随机数转成 36 进制字符串
  let random = Math.random().toString(36)
  // 去除随机数的 0. 字符串
  random = random.substring(2, random.length)
  // 返回唯一ID
  return random + time
}

getList();

</script>
<style>
.toolsline{
  height: 30px;
}
</style>
