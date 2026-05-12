<template>
  <div class="repairmethod">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备类型" prop="classId">
        <el-select v-model="queryParams.classId" placeholder="请选择"  clearable>
          <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="故障诊断" prop="troubleId">
        <el-select v-model="queryParams.troubleId" placeholder="请选择"  clearable>
          <el-option
              v-for="item in troubleOptions"
              :key="item.id"
              :label="item.troubleshooting"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修方法" prop="method">
        <el-input
          v-model="queryParams.method"
          placeholder="请输入维修方法"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" class="checkbtn">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
    <div class="nav">
      <el-button
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['unitManage:repairmethod:add']"
      >新增</el-button>
<!--      <el-button
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:repairmethod:edit']"
      >修改</el-button>
      <el-button
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:repairmethod:remove']"
      >删除</el-button>-->
      <el-button
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:repairmethod:export']"
      >导出</el-button>
    </div>



    <el-table v-loading="loading"
              :data="repairmethodList"
              @selection-change="handleSelectionChange"
              stripe="true"
              border
              style="width: 100%">
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="设备类型" align="center" prop="className" />
      <el-table-column label="故障诊断" align="center" prop="troubleshooting" />
      <el-table-column label="维修方法" align="center" prop="method" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip
              class="box-item"
              effect="light"
              content="修改"
              placement="top"
          >
            <el-button
                class="operation"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['unitManage:repairmethod:edit']"
            >
              <el-icon :size="20"><Edit /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="light"
              content="删除"
              placement="top"
          >
            <el-button
                class="operation"
                @click="handleDelete(scope.row)"
                v-hasPermi="['unitManage:repairmethod:remove']"
            ><el-icon :size="20" ><Delete /></el-icon></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

      <div class="pages">
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
      </div>
    <!-- 添加或修改维修方法字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="repairmethodRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备类型" prop="classId">
          <el-select v-model="form.classId" clearable filterable placeholder="请选择" @change="classChange">
            <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备故障" prop="faultId">
          <el-select v-model="form.faultId" clearable filterable placeholder="请选择" @change="faultChange">
            <el-option
                v-for="item in faultOptions"
                :key="item.id"
                :label="item.fault"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障诊断" prop="troubleId">
          <el-select v-model="form.troubleId" placeholder="请选择"  clearable>
            <el-option
                v-for="item in troubleOptions"
                :key="item.id"
                :label="item.troubleshooting"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="维修方法" prop="method">
          <el-input v-model="form.method" placeholder="请输入维修方法" />
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
  </div>
</template>

<script setup name="Repairmethod">
import { listRepairmethod, getRepairmethod, delRepairmethod, addRepairmethod, updateRepairmethod } from "@/api/unitManage/repairmethod";
import {listEqClass, listFaulttype} from "@/api/unitmanage/faulttype";
import { listTroubleshooting} from "@/api/unitManage/troubleshooting";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const repairmethodList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const classOptions = ref(undefined);
const troubleOptions = ref(undefined);
const faultOptions = ref(undefined);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    classId: null,
    troubleId: null,
    method: null,
    deptId: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

//获取设备类型
function getClass() {
  listEqClass().then(res => {
    classOptions.value = res.data;
  })
}

//获取故障诊断
function getTrouble() {
  listTroubleshooting({classId:form.value.classId,faultId:form.value.faultId}).then(response => {
    troubleOptions.value = response.rows;
  });
}
//获取设备故障
function getFault() {
  listFaulttype({classId:form.value.classId}).then(response => {
    faultOptions.value = response.rows;
  });
}

function classChange(){
  faultOptions.value = [];//设备故障
  troubleOptions.value = [];//故障诊断
  form.value.faultId='';
  form.value.troubleId='';
  getFault();
  getTrouble();
}

function faultChange(){
  troubleOptions.value = [];//故障诊断
  form.value.troubleId='';
  getTrouble();
}

/** 查询维修方法字典列表 */
function getList() {
  loading.value = true;
  listRepairmethod(queryParams.value).then(response => {
    repairmethodList.value = response.rows;
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
    classId: null,
    troubleId: null,
    method: null,
    deptId: null
  };
  proxy.resetForm("repairmethodRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加维修方法字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getRepairmethod(id).then(response => {
    form.value = response.data;
    getFault();
    getTrouble();
    open.value = true;
    title.value = "修改维修方法字典";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["repairmethodRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRepairmethod(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRepairmethod(form.value).then(response => {
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
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delRepairmethod(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/repairmethod/export', {
    ...queryParams.value
  }, `repairmethod_${new Date().getTime()}.xlsx`)
}

getList();
getClass();
</script>
<style scoped lang="scss">

.repairmethod{
  .checkbtn {
    background: #09bec5;
    padding: 0 25px;
    border: 0;
    color: #fff;
  }
  .table{
    height: calc(100vh - 270px);

    .handlebtn{
      height: auto;border: 0;padding: 0;color: #09bec5;
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
    .operation{
      padding: 0;
      border: none;
      background: transparent;
      --el-button-hover-text-color:#37c4cb;
    }
    .nav{
      text-align: right;
      margin-bottom: 10px;
    }
    .addtanchu{
      :deep(.el-dialog) {
        overflow: hidden;
        .el-dialog__header{
          box-shadow: 0 5px 10px #eee;
        }
      }
      .el-form {
        .el-select{
          width: 100%;
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
    }
  }
}

</style>
