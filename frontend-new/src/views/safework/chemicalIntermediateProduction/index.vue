<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="品名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入品名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="CAS号" prop="cas">
        <el-input
          v-model="queryParams.cas"
          placeholder="请输入CAS号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物质形态" prop="physicalForm">
        <el-select v-model="queryParams.physicalForm" placeholder="请选择物质形态" clearable>
          <el-option
            v-for="dict in chemical_physical_form"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in status"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:chemicalIntermediateProduction:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:chemicalIntermediateProduction:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:chemicalIntermediateProduction:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:chemicalIntermediateProduction:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="chemicalIntermediateProductionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="统一编码" align="center" prop="code" />
      <el-table-column label="品名" align="center" prop="name" />
      <el-table-column label="CAS号" align="center" prop="cas" />
      <el-table-column label="是否为危化品" align="center" prop="hazardFlag">
        <template #default="scope">
          <span v-if="scope.row.hazardFlag == 0">否</span>
          <span v-if="scope.row.hazardFlag == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="物质形态" align="center" prop="physicalForm">
        <template #default="scope">
          <dict-tag :options="chemical_physical_form" :value="scope.row.physicalForm"/>
        </template>
      </el-table-column>
      <el-table-column label="年消耗量" align="center" prop="annualConsumption" />
      <el-table-column label="最大存储量" align="center" prop="maximumStorage" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:chemicalIntermediateProduction:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:chemicalIntermediateProduction:remove']"
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

    <!-- 添加或修改中间产品管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="chemicalIntermediateProductionRef" :model="form" :rules="rules" label-width="170px">
        <el-form-item label="统一编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入统一编码" />
        </el-form-item>
        <el-form-item label="品名" prop="name">
          <el-input v-model="form.name" placeholder="请输入品名" />
        </el-form-item>
        <el-form-item label="CAS号" prop="cas">
          <el-input v-model="form.cas" placeholder="请输入CAS号" />
        </el-form-item>
        <el-form-item label="是否为危化品" prop="hazardFlag">
          <el-radio-group v-model="form.hazardFlag">
            <el-radio key="0" label="0">否</el-radio>
            <el-radio key="1" label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否重点监管危险化学品" prop="superviseFlag">
          <el-radio-group v-model="form.superviseFlag">
            <el-radio key="0" label="0">否</el-radio>
            <el-radio key="1" label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="危险化学品目录序号" prop="serial">
          <el-input v-model="form.serial" placeholder="请输入危险化学品目录序号" />
        </el-form-item>
        <el-form-item label="危化品类别" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入危化品类别" />
        </el-form-item>
        <el-form-item label="物质形态" prop="physicalForm">
          <el-select v-model="form.physicalForm" placeholder="请选择物质形态">
            <el-option
              v-for="dict in chemical_physical_form"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年消耗量" prop="annualConsumption">
          <el-input v-model="form.annualConsumption" placeholder="请输入年消耗量" />
        </el-form-item>
        <el-form-item label="最大存储量" prop="maximumStorage">
          <el-input v-model="form.maximumStorage" placeholder="请输入最大存储量" />
        </el-form-item>
        <el-form-item label="实际储量" prop="actualStorage">
          <el-input v-model="form.actualStorage" placeholder="请输入实际储量" />
        </el-form-item>
        <el-form-item label="存储位置" prop="storageSite">
          <el-input v-model="form.storageSite" placeholder="请输入存储位置" />
        </el-form-item>
        <el-form-item label="所属重大危险源单元名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入所属重大危险源单元名称" />
        </el-form-item>
        <el-form-item label="所在工艺流程" prop="technologicalProcess">
          <el-input v-model="form.technologicalProcess" placeholder="请输入所在工艺流程" />
        </el-form-item>
        <el-form-item label="所在工艺流程是否属于重点监管工艺" prop="processSuperviseFlag">
          <el-radio-group v-model="form.processSuperviseFlag">
            <el-radio key="0" label="0">否</el-radio>
            <el-radio key="1" label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="重点监管危险化工工艺" prop="superviseTechnologicalProcess">
          <el-input v-model="form.superviseTechnologicalProcess" placeholder="请输入重点监管危险化工工艺" />
        </el-form-item>
        <el-form-item label="是否剧毒化学品" prop="toxicFlag">
          <el-radio-group v-model="form.toxicFlag">
            <el-radio key="0" label="0">否</el-radio>
            <el-radio key="1" label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否易制毒" prop="poisonMakingFlag">
          <el-radio-group v-model="form.poisonMakingFlag">
            <el-radio key="0" label="0">否</el-radio>
            <el-radio key="1" label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否易制爆" prop="explosiveMakingFlag">
          <el-radio-group v-model="form.explosiveMakingFlag">
            <el-radio key="0" label="0">否</el-radio>
            <el-radio key="1" label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="安全措施" prop="safetyMeasures">
          <el-input v-model="form.safetyMeasures" placeholder="请输入安全措施" />
        </el-form-item>
        <el-form-item label="应急处置措施" prop="emergencyResponseMeasures">
          <el-input v-model="form.emergencyResponseMeasures" placeholder="请输入应急处置措施" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in status"
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

<script setup name="ChemicalIntermediateProduction">
import { listChemicalIntermediateProduction, getChemicalIntermediateProduction, delChemicalIntermediateProduction, addChemicalIntermediateProduction, updateChemicalIntermediateProduction } from "@/api/safework/chemicalIntermediateProduction";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status, chemical_physical_form } = proxy.useDict('status', 'chemical_physical_form');

const chemicalIntermediateProductionList = ref([]);
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
    name: null,
    cas: null,
    physicalForm: null,
    delFlag: "0",
    status: "0",
  },
  rules: {
    deptId: [
      { required: true, message: "所属部门不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "统一编码不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "品名不能为空", trigger: "blur" }
    ],
    annualConsumption: [
      { required: true, message: "年消耗量不能为空", trigger: "blur" }
    ],
    maximumStorage: [
      { required: true, message: "最大存储量不能为空", trigger: "blur" }
    ],
    actualStorage: [
      { required: true, message: "实际储量不能为空", trigger: "blur" }
    ],
    delFlag: [
      { required: true, message: "删除标志不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询中间产品管理列表 */
function getList() {
  loading.value = true;
  listChemicalIntermediateProduction(queryParams.value).then(response => {
    chemicalIntermediateProductionList.value = response.rows;
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
    code: null,
    name: null,
    cas: null,
    hazardFlag: null,
    superviseFlag: null,
    serial: null,
    typeName: null,
    physicalForm: null,
    annualConsumption: null,
    maximumStorage: null,
    actualStorage: null,
    storageSite: null,
    storageType: null,
    unitName: null,
    technologicalProcess: null,
    processSuperviseFlag: null,
    superviseTechnologicalProcess: null,
    toxicFlag: null,
    poisonMakingFlag: null,
    explosiveMakingFlag: null,
    safetyMeasures: null,
    emergencyResponseMeasures: null,
    delFlag: "0",
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("chemicalIntermediateProductionRef");
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
  title.value = "添加中间产品管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getChemicalIntermediateProduction(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改中间产品管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["chemicalIntermediateProductionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateChemicalIntermediateProduction(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addChemicalIntermediateProduction(form.value).then(response => {
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
    return delChemicalIntermediateProduction(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/chemicalIntermediateProduction/export', {
    ...queryParams.value
  }, `chemicalIntermediateProduction_${new Date().getTime()}.xlsx`)
}

getList();
</script>
