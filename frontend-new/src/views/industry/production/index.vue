<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="生产单号" prop="mo">
        <el-input
          v-model="queryParams.mo"
          placeholder="请输入生产单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备" prop="equipment_no">
        <el-select v-model="queryParams.equipment_no" placeholder="请选择" clearable>
          <el-option
              v-for="item in sensorList"
              :key="item.equipmentId"
              :label="item.equipmentName"
              :value="item.equipmentId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="product_name">
        <el-input
          v-model="queryParams.product_name"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option label="生产中" value="生产中" />
          <el-option label="已结束" value="已结束" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="productionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="生产单号" align="center" prop="mo" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="产品名称" align="center" prop="product_name" />
      <el-table-column label="订单" align="center" prop="mo_orders" />
      <el-table-column label="计划产量" align="center" prop="qty_plan" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180" />
<!--      <el-table-column label="开始产量" align="center" prop="qtyStart" />-->
      <el-table-column label="结束时间" align="center" prop="endTime" width="180" />
<!--      <el-table-column label="结束产量" align="center" prop="qtyEnd" />-->
      <el-table-column label="实际产量" align="center" prop="qtyReal" />
      <el-table-column label="状态" align="center" prop="status" />
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template #default="scope">-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="Edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['industry:production:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="Delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['industry:production:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改产量信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="productionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="生产单号" prop="mo">
          <el-input v-model="form.mo" placeholder="请输入生产单号" />
        </el-form-item>
        <el-form-item label="设备编号" prop="equipmentNo">
          <el-input v-model="form.equipment_no" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.product_name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="订单" prop="moOrders">
          <el-input v-model="form.mo_orders" placeholder="请输入订单" />
        </el-form-item>
        <el-form-item label="计划产量" prop="qtyPlan">
          <el-input v-model="form.qty_plan" placeholder="请输入计划产量" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始产量" prop="qtyStart">
          <el-input v-model="form.qtyStart" placeholder="请输入开始产量" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束产量" prop="qtyEnd">
          <el-input v-model="form.qtyEnd" placeholder="请输入结束产量" />
        </el-form-item>
        <el-form-item label="实际产量" prop="qtyReal">
          <el-input v-model="form.qtyReal" placeholder="请输入实际产量" />
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

<script setup name="Production">
import { listProduction, getProduction, delProduction, addProduction, updateProduction } from "@/api/industry/production";
import { listSensor} from "@/api/sensor/sensor";
const { proxy } = getCurrentInstance();

const productionList = ref([]);
const sensorList = ref([]);
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
    mo: null,
    equipment_no: null,
    product_name: null,
    mo_orders: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询产量信息列表 */
function getList() {
  loading.value = true;
  listProduction(queryParams.value).then(response => {
    productionList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getSensor() {
  listSensor().then(res => {
    sensorList.value = res.rows
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
    id: null,
    mo: null,
    equipment_no: null,
    product_name: null,
    mo_orders: null,
    status: null,
    qtyPlan: null,
    startTime: null,
    qtyStart: null,
    endTime: null,
    qtyEnd: null,
    qtyReal: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("productionRef");
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
  title.value = "添加产量信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getProduction(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改产量信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["productionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProduction(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProduction(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除产量信息编号为"' + idss + '"的数据项？').then(function() {
    return delProduction(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('industry/production/export', {
    ...queryParams.value
  }, `production_${new Date().getTime()}.xlsx`)
}
getSensor();
getList();
</script>
