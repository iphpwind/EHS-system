<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日期" prop="date">
        <el-date-picker
					v-model="value1"
					type="daterange"
					range-separator="-"
          value-format="YYYY-MM-DD"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table height="calc(100vh - 300px)" :data="informationList">
      <el-table-column label="起止日期" prop="date" />
      <el-table-column label="车牌号" prop="carNumber" />
      <el-table-column label="司机" prop="driverName" />
      <el-table-column label="时间静止" prop="restTime" />
      <el-table-column label="行驶时间" prop="driveTime" />
      <el-table-column label="里程数" prop="mileage" />
      <el-table-column label="停车次数" prop="stopNum" />
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

<script setup name="Information">
import { getRecordTotalByCar } from "@/api/car/report";
import {ref} from "vue";

const { proxy } = getCurrentInstance();

const informationList = ref([
	{
		startday: '1111',
		driverName: '1111',
		endday: '1111',
		carNumber: '111',
	}
]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
let checkArray = [];
const value1 = ref('')

const data = reactive({
  form: {

	},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    driverName: null,
    carNumber: null,
    carModel: null,
    beforeDate:'',
    afterDate:'',
  },
  rules: {

  }
});

const { queryParams, form, rules } = toRefs(data);

function timeDefault() {
    let date = new Date()
    // 通过时间戳计算
    let defalutStartTime = date.getTime() - 30 * 24 * 3600 * 1000 // 转化为时间戳
    let defalutEndTime = date.getTime()
    let startDateNs = new Date(defalutStartTime)
    let endDateNs = new Date(defalutEndTime)
    // 月，日 不够10补0
    defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
    defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
    // return [defalutStartTime, defalutEndTime]
    value1.value = [defalutStartTime, defalutEndTime]
    queryParams.value.beforeDate = value1.value[0]
    queryParams.value.afterDate = value1.value[1]
    getList();
}
/** 查询车辆信息列表 */
function getList() {
  loading.value = true;
  getRecordTotalByCar(queryParams.value).then(response => {
    informationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  queryParams.value.beforeDate = value1.value[0]
  queryParams.value.afterDate = value1.value[1]
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
timeDefault();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
