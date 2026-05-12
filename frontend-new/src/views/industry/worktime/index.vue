<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
      <el-form-item label="所属部门" prop="deptId" v-show="showSearch">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择归属部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="月份" prop="classId">
        <el-date-picker
            v-model="curmonth"
            type="month"
            placeholder="选择月"
						>
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="设备名称" align="center"  prop="eqName" />
      <el-table-column label="类型" align="center"  prop="ycName" />
      <el-table-column label="当月工作时长(小时)" align="center" prop="monthWorkHour" />
      <el-table-column label="当月总小时(小时)" align="center" prop="monthHour" />
      <el-table-column label="工作总时长(小时)" align="center" prop="allWorkHour" />
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

<script setup name="WorkTime">
import { listWorkTime } from "@/api/industry/worktime";
import {treeselect} from "@/api/system/dept";
const { proxy } = getCurrentInstance();

const list = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const classOptions = ref(undefined);
const eqTypeOpen = ref(false);
const data = reactive({
	curmonth:new Date(),
  queryParams: {
    pageNum: 1,
    pageSize: 10,
		ycYear:new Date().getFullYear(),
		ycMonth:new Date().getMonth()+1,
    deptId:'',
  }
});
const { curmonth, queryParams } = toRefs(data);


watch(curmonth, val => {
  if (val) {
		queryParams.value.ycYear=val.getFullYear();
		queryParams.value.ycMonth=val.getMonth()+1;
  }
});
/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    let data = response.data;
    if(data.length > 1 || typeof (data[0].children) !== 'undefined'){
      showSearch.value = true;
    }
    deptOptions.value = response.data;
  });
}
/** 查询设备列表 */
function getList() {
  loading.value = true;
  listWorkTime(queryParams.value).then(response => {
    list.value = response.rows;
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

getTreeselect();
getList();
</script>
<style lang="scss">
.attr-buttom{
  border-bottom: 1px solid #f5f5f5;
  padding: 10px;
  background: #fbfbfb;
}
.attrli{

  margin: 5px 0;
}
</style>
