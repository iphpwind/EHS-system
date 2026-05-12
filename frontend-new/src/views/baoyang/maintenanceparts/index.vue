<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="保养部位" prop="maintenancePartsName">
        <el-input
          v-model="queryParams.maintenancePartsName"
          placeholder="请输入保养部位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
              v-for="dict in unit_status"
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
          @click="handleAdd"
          v-hasPermi="['unitManage:maintenanceparts:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:maintenanceparts:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:maintenanceparts:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:maintenanceparts:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="maintenancepartsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典表id" align="center" prop="maintenancePartsId" v-if="false"/>
      <el-table-column label="保养部位" align="center" prop="maintenancePartsName" />
      <el-table-column label="保养步骤" align="center" prop="maintenanceStep" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="unit_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:maintenanceparts:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:maintenanceparts:remove']"
          >删除</el-button>
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

    <!-- 添加或修改保养部位字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="maintenancepartsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备分类" prop="classId">
          <el-select v-model="form.classId" placeholder="请选择设备分类" clearable>
            <el-option
                v-for="item in cateOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="保养部位" prop="maintenancePartsName">
          <el-input v-model="form.maintenancePartsName" placeholder="请输入保养部位" />
        </el-form-item>
        <el-form-item label="保养步骤" prop="maintenanceStep">
          <el-input v-model="form.maintenanceStep" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in unit_status"
                :key="dict.value"
                :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Maintenanceparts">
import { listMaintenanceparts, getMaintenanceparts, delMaintenanceparts, addMaintenanceparts, updateMaintenanceparts } from "@/api/unitManage/maintenanceparts";
import { listEqClass } from "@/api/unitManage/faulttype";
import {h} from "vue";
const { proxy } = getCurrentInstance();
const { unit_site_type, unit_status } = proxy.useDict('unit_site_type', 'unit_status');

const maintenancepartsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const cateOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    maintenancePartsName: null,
    status: null,
    deptId: null,
    classId:null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询保养部位字典列表 */
function getList() {
  loading.value = true;
  listMaintenanceparts(queryParams.value).then(response => {
    maintenancepartsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

//获取设备分类
function getCate(){
  listEqClass().then(res => {
    cateOptions.value = res.data;
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
    maintenancePartsId: null,
    maintenancePartsName: null,
    maintenanceStep: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    classId: null,
    deptId: null
  };
  proxy.resetForm("maintenancepartsRef");
}

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
  ids.value = selection.map(item => item.maintenancePartsId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加保养部位字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const maintenancePartsId = row.maintenancePartsId || ids.value
  getMaintenanceparts(maintenancePartsId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改保养部位字典";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["maintenancepartsRef"].validate(valid => {
    if (valid) {
      if (form.value.maintenancePartsId != null) {
        updateMaintenanceparts(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMaintenanceparts(form.value).then(response => {
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
  const maintenancePartsIds = row.maintenancePartsId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delMaintenanceparts(maintenancePartsIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/maintenanceparts/export', {
    ...queryParams.value
  }, `maintenanceparts_${new Date().getTime()}.xlsx`)
}

getList();
getCate();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
