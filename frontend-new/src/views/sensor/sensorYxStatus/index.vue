<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
            icon="Download"
            @click="handleExport"

        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="SensorYxStatusList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="运行状态编号" align="center" prop="yxstatusNo"/>
      <el-table-column label="运行状态" align="center" prop="yxstatusCode">
        <template #default="scope">
          <dict-tag :options="work_status" :value="scope.row.yxstatusCode"/>
        </template>
      </el-table-column>
      <el-table-column label="传感器id" align="center" prop="yxstatusEquipId"/>
      <el-table-column label="遥信序列号" align="center" prop="yxSerial"/>
      <el-table-column label="遥信状态设定值" align="center" prop="yxstatusSetvalue"/>
      <el-table-column label="遥测序列号" align="center" prop="ycSerial"/>
      <el-table-column label="遥测状态设定值" align="center" prop="ycStatusSetValue"/>
      <el-table-column label="遥测状态设定值对应关系" align="center" prop="ycStatusSetValueRelation" :formatter="relationFormatter"/>
      <el-table-column label="当前状态" align="center" prop="yxCurr"/>
      <el-table-column label="时间" align="center" prop="yxDt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.yxDt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" align="center" prop="yxstatusSort"/>
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

    <!-- 添加或修改设备运行状态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="SensorYxStatusRef" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="运行状态" prop="yxstatusCode">
          <el-select v-model="form.yxstatusCode" placeholder="请选择运行状态">
            <el-option
                v-for="dict in work_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="传感器id" prop="yxstatusEquipId">
          <el-input v-model="form.yxstatusEquipId" placeholder="请输入传感器id" readonly/>
        </el-form-item>
        <el-form-item label="遥信序列号" prop="yxSerial">
          <el-input v-model="form.yxSerial" placeholder="请输入遥信序列号"/>
        </el-form-item>
        <el-form-item label="状态设定值" prop="yxstatusSetvalue">
          <el-input v-model="form.yxstatusSetvalue" placeholder="请输入状态设定值"/>
        </el-form-item>
        <el-form-item label="遥测序列号" prop="ycSerial">
          <el-input v-model="form.ycSerial" placeholder="请输入遥测序列号"/>
        </el-form-item>
        <el-form-item label="遥测状态设定值" prop="ycstatusSetvalue">
          <el-input v-model="form.ycStatusSetValue" placeholder="请输入遥测状态设定值"/>
        </el-form-item>
        <el-form-item label="遥测状态设定值对应关系" prop="ycstatusSetvalueRelation">
          <el-select v-model="form.ycStatusSetvalueRelation" placeholder="请选择遥测状态设定值对应关系">
            <el-option
                v-for="item in ycStatusSetvalueRelationSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="当前状态" prop="yxCurr">-->
        <!--          <el-input v-model="form.yxCurr" placeholder="请输入当前状态" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="时间" prop="yxDt">-->
        <!--          <el-date-picker clearable-->
        <!--            v-model="form.yxDt"-->
        <!--            type="date"-->
        <!--            value-format="YYYY-MM-DD"-->
        <!--            placeholder="请选择时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="排序号" prop="yxstatusSort">-->
        <!--          <el-input v-model="form.yxstatusSort" placeholder="请输入排序号" />-->
        <!--        </el-form-item>-->
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

<script setup name="SensorYxStatus">
import {
  listSensorYxStatus,
  getSensorYxStatus,
  delSensorYxStatus,
  addSensorYxStatus,
  updateSensorYxStatus
} from "@/api/sensor/sensorYxStatus";
import {h} from "vue";

const {proxy} = getCurrentInstance();
const {work_status} = proxy.useDict('work_status');

const SensorYxStatusList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const route = useRoute();
const {sersor_code} = proxy.useDict("sersor_code");
const data = reactive({
  form: {},
  ycStatusSetvalueRelationSelect: [{
    value: 1,
    label: '小于'
  }, {
    value: 2,
    label: '等于'
  }, {
    value: 3,
    label: '大于'
  }],
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    yxstatusEquipId: route.params && route.params.equipmentId,
  },
  rules: {}
});

const {queryParams, form, rules, ycStatusSetvalueRelationSelect} = toRefs(data);

/** 查询设备运行状态列表 */
function getList() {
  loading.value = true;
  listSensorYxStatus(queryParams.value).then(response => {
    SensorYxStatusList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}
function relationFormatter(v) {
  let str = ''
  for (let i = 0; i < ycStatusSetvalueRelationSelect.value.length; i++) {
    if (v.ycStatusSetvalueRelation == ycStatusSetvalueRelationSelect.value[i].value) {
      str = ycStatusSetvalueRelationSelect.value[i].label
    }
  }
  return str
}
// 表单重置
function reset() {
  form.value = {
    yxstatusNo: null,
    yxstatusName: null,
    yxstatusCode: null,
    yxstatusEquipId: route.params && route.params.equipmentId,
    yxSerial: null,
    yxstatusSetvalue: null,
    yxCurr: null,
    yxDt: null,
    yxstatusSort: null
  };
  proxy.resetForm("SensorYxStatusRef");
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
  ids.value = selection.map(item => item.yxstatusNo);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备运行状态";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const yxstatusNo = row.yxstatusNo || ids.value
  getSensorYxStatus(yxstatusNo).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改设备运行状态";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["SensorYxStatusRef"].validate(valid => {
    if (valid) {
      if (form.value.yxstatusNo != null) {
        updateSensorYxStatus(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSensorYxStatus(form.value).then(response => {
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
  const yxstatusNos = row.yxstatusNo || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSensorYxStatus(yxstatusNos);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sensor/SensorYxStatus/export', {
    ...queryParams.value
  }, `SensorYxStatus_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline {
  height: 30px;
}
</style>
