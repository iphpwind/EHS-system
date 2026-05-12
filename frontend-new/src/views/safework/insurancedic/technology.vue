<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="insurancedicList" @selection-change="handleSelectionChange">
<!--      <el-table-column label="任务类型" align="center" prop="userType" >
        <template #default="scope">
          <span class="ok" v-if="scope.row.userType == 1">主要负责人</span>
          <span class="ok" v-if="scope.row.userType == 2">技术负责人</span>
          <span class="ok" v-if="scope.row.userType == 3">操作负责人</span>
        </template>
      </el-table-column>-->
      <el-table-column label="对应项内容" align="center" prop="termContent" />
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

<script setup name="Insurancedic">
import { listInsurancedic, getInsurancedic, delInsurancedic, addInsurancedic, updateInsurancedic } from "@/api/safework/insurancedic";

const { proxy } = getCurrentInstance();

const insurancedicList = ref([]);
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
    enterpriseCode: null,
    userType: 2,
    termContent: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询包保责任制字典列表 */
function getList() {
  loading.value = true;
  listInsurancedic(queryParams.value).then(response => {
    insurancedicList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

getList();
</script>
