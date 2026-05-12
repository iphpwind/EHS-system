<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="风险事件" prop="eventName  ">
        <el-input
            v-model="queryParams.eventName"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="风险等级" prop="workType">
        <el-select v-model="queryParams.workType" clearable filterable placeholder="全部">
          <el-option key="低风险" label="低风险" value="低风险"></el-option>
          <el-option key="一般风险" label="一般风险" value="一般风险"></el-option>
          <el-option key="较大风险" label="较大风险" value="较大风险"></el-option>
          <el-option key="重大风险" label="重大风险" value="重大风险"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column
          prop="eventName"
          label="风险事件"
          width="150">
      </el-table-column>
      <el-table-column
          prop="standard"
          label="潜在危害"
          width="150">
      </el-table-column>
      <el-table-column
          prop="conseq"
          label="主要后果"
          width="150">
      </el-table-column>
      <el-table-column label="管控措施">
        <el-table-column
            prop="className"
            label="管控措施分类"
            width="120">
        </el-table-column>
        <el-table-column
            prop="mince"
            label="管控措施细分"
            width="120">
        </el-table-column>
        <el-table-column
            prop="depict"
            label="管控措施描述"
            width="120">
        </el-table-column>
      </el-table-column>
      <el-table-column
          prop="evaluationL"
          label="L"
          width="150">
      </el-table-column>
      <el-table-column
          prop="evaluationE"
          label="E"
          width="150">
      </el-table-column>
      <el-table-column
          prop="evaluationSc"
          label="S/C"
          width="150">
      </el-table-column>
      <el-table-column
          prop="riskRd"
          label="R/D"
          width="150">
      </el-table-column>
      <el-table-column
          prop="riskLevel"
          label="风险等级"
          width="150">
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态"
          width="150">
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
  </div>
</template>

<script setup name="workAnalysis">
import { listUnit, getUnit, delUnit, updateUnitWork } from "@/api/safework/unit";
import { listDisclosure, getDisclosure, delDisclosure, addDisclosure, updateDisclosure } from "@/api/safework/disclosure";
import { measureList} from "@/api/safework/measure";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const tableData = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const unitId = ref("");


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    objectId: null,
    code: null,
    name: null,
    ifMajor: null,
    riskLevel: null,
    deptId: null,
    postId: null,
    levelId: null,
    userId: null,
    delFlag: '0'
  },
  disclosure: {},
});

const { queryParams, form, rules,disclosure } = toRefs(data);


/** 查询风险分析单元列表 */
function getList() {
  loading.value = true;
  tableData.value=[];
  console.log(unitId.value)
  measureList({unitId:unitId.value}).then(response => {
    tableData.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
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

unitId.value = proxy.$route.query.unitId;
getList();
</script>
<style>
.level{
  border-radius: 5px;
  padding: 2px 5px;
  color: #fff;
}
</style>
