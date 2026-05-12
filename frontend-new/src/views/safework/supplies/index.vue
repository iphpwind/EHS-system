<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物资分类" prop="suppliesTypeId">
        <el-select v-model="queryParams.suppliesTypeId" placeholder="请选择分类" @keyup.enter="handleQuery">
          <el-option v-for="item in typeList"
                     :key="item.id"
                     :label="item.typeName"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物资编号" prop="suppliesNum">
        <el-input
            v-model="queryParams.suppliesNum"
            placeholder="请输入物资编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="名称" prop="suppliesName">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.suppliesName"-->
      <!--            placeholder="请输入名称"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="区域" prop="areaId">
        <el-select v-model="queryParams.areaId" placeholder="请选择区域" @keyup.enter="handleQuery">
          <el-option v-for="item in objectList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物资状态" prop="suppliesState">
        <el-select v-model="queryParams.suppliesState" placeholder="请选择物资状态" @keyup.enter="handleQuery">
          <el-option v-for="item in suppliestypeStateSelect"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" @keyup.enter="handleQuery">
          <el-option v-for="item in stateSelect"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="upload"
            @click="handleImport"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="template"
        >下载导入模板</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="suppliesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
<!--      <el-table-column label="所属机构" align="center" prop="deptId"/>-->
      <el-table-column label="物资分类" align="center" prop="suppliesTypeId" :formatter="suppliesTypeFormatter"/>
      <el-table-column label="物资编号" align="center" prop="suppliesNum"/>
      <el-table-column label="名称" align="center" prop="suppliesName"/>
      <el-table-column label="性能说明" align="center" prop="illustrate"/>
      <el-table-column label="用途说明" align="center" prop="description"/>
      <el-table-column label="区域" align="center" prop="areaId" :formatter="areaFormatter"/>
      <el-table-column label="存放位置" align="center" prop="location"/>
      <el-table-column label="数量" align="center" prop="count"/>
      <el-table-column label="生产厂家" align="center" prop="manufacturer"/>
      <el-table-column label="生产日期" align="center" prop="manufactureTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.manufactureTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期至" align="center" prop="validityPeriod" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.validityPeriod, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生命周期" align="center" prop="lifeCycle" :formatter="lifeFormatter"/>
      <el-table-column label="物资状态" align="center" prop="suppliesState" :formatter="suppliestypeStateFormatter"/>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
          >删除
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

    <!-- 添加或修改应急物资对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="suppliesRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分类" prop="suppliesTypeId">
          <el-select v-model="form.suppliesTypeId" placeholder="请选择分类">
          <el-option v-for="item in typeList"
                     :key="item.id"
                     :label="item.typeName"
                     :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物资编号" prop="suppliesNum">
          <el-input v-model="form.suppliesNum" placeholder="请输入物资编号"/>
        </el-form-item>
        <el-form-item label="名称" prop="suppliesName">
          <el-input v-model="form.suppliesName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="性能说明" prop="illustrate">
          <el-input v-model="form.illustrate" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="用途说明" prop="description">
          <el-input v-model="form.description" placeholder="请输入用途说明"/>
        </el-form-item>
        <el-form-item label="区域" prop="areaId">
          <el-select v-model="form.areaId" placeholder="请选择区域">
            <el-option v-for="item in objectList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存放位置说明" prop="location">
          <el-input v-model="form.location" placeholder="请输入存放位置说明"/>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="form.count" placeholder="请输入数量"/>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家"/>
        </el-form-item>
        <el-form-item label="生产日期" prop="manufactureTime">
          <el-date-picker clearable
                          v-model="form.manufactureTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效期至" prop="validityPeriod">
          <el-date-picker clearable
                          v-model="form.validityPeriod"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择有效期至">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生命周期" prop="lifeCycle">
          <el-select v-model="form.lifeCycle" placeholder="请选择物资状态">
            <el-option v-for="item in lifeCycleSelect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物资状态" prop="suppliesState">
          <el-select v-model="form.suppliesState" placeholder="请选择物资状态">
            <el-option v-for="item in suppliestypeStateSelect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option v-for="item in stateSelect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="upload.title" v-model="upload.importOpen" width="400px" append-to-body>
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
            <!--            <div class="el-upload__tip">
                          <el-checkbox v-model="upload.updateSupport"/>
                          是否更新已经存在的对象数据
                        </div>-->
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.importOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Supplies">
import {listSupplies, getSupplies, delSupplies, addSupplies, updateSupplies, importTemplate} from "@/api/safework/supplies";
import {listType} from "@/api/safework/suppliestype";
import {listObject} from "@/api/safework/object";
import {getToken} from "../../../utils/auth";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const suppliesList = ref([]);
const objectList = ref([]);
const typeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    suppliesTypeId: null,
    suppliesNum: null,
    suppliesName: null,
    illustrate: null,
    description: null,
    areaId: null,
    location: null,
    count: null,
    manufacturer: null,
    manufactureTime: null,
    validityPeriod: null,
    lifeCycle: null,
    suppliesState: null,
    state: null
  },
  rules: {},
  stateSelect: [
    {
      label: '正常',
      value: 0
    }, {
      label: '停用',
      value: 1
    }
  ],
  suppliestypeStateSelect: [
    {
      label: '完好',
      value: 0
    }, {
      label: '维修',
      value: 1
    }
  ],
  lifeCycleSelect: [
    {
      label: '已投用',
      value: 1
    }, {
      label: '库存中',
      value: 2
    }, {
      label: '报废',
      value: 3
    }
  ]
});

const {queryParams, form, rules, stateSelect, suppliestypeStateSelect, lifeCycleSelect} = toRefs(data);

/** 查询应急物资列表 */
function getList() {
  loading.value = true;
  listSupplies(queryParams.value).then(response => {
    suppliesList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    deptId: null,
    suppliesTypeId: null,
    suppliesNum: null,
    suppliesName: null,
    illustrate: null,
    description: null,
    areaId: null,
    location: null,
    count: null,
    manufacturer: null,
    manufactureTime: null,
    validityPeriod: null,
    lifeCycle: null,
    suppliesState: null,
    state: null
  };
  proxy.resetForm("suppliesRef");
}

const handleFileSuccess = (response, file, fileList) => {
  upload.importOpen = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

const upload = reactive({
  // 是否显示弹出层（导入）
  importOpen: false,
  // 弹出层标题（导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/safework/supplies/import"
});

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

function template() {
  proxy.download('safework/supplies/importTemplate', {
    ...queryParams.value
  }, `应急物资_导入模板.xlsx`)
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加应急物资";
}

function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getSupplies(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改应急物资";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["suppliesRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSupplies(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSupplies(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

function handleImport() {
  upload.title = "导入";
  upload.importOpen = true;
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSupplies(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/supplies/export', {
    ...queryParams.value
  }, `supplies_${new Date().getTime()}.xlsx`)
}

function stateFormatter(e) {
  if (e.state == 0) {
    return '正常'
  }
  return '停用'
}

function lifeFormatter(e) {
  let result = ''
  lifeCycleSelect.value.forEach(item => {
    if (item.value == e.lifeCycle) {
      result = item.label
    }
  })
  return result
}

function suppliestypeStateFormatter(e) {
  if (e.state == 0) {
    return '完好'
  }
  return '维修'
}

function suppliesTypeFormatter(e) {
  let result = ''
  typeList.value.forEach(item => {
    if (item.id == e.suppliesTypeId) {
      result = item.typeName
    }
  })
  return result
}

function areaFormatter(e) {
  let result = ''
  objectList.value.forEach(item => {
    if (item.id == e.areaId) {
      result = item.name
    }
  })
  return result
}

function initList() {
  listObject().then(res => {
    objectList.value = res.rows
  })
  listType({state: 0}).then(res => {
    typeList.value = res.rows
  })
  console.log(typeList.value)
}

getList();
initList();
</script>
