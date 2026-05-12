<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '10px' }">
    <el-row :gutter="20">
			<!--区域数据-->
      <el-col :span="4" :xs="24">

        <div class="head-container tree">
          <h4>导航</h4>
          <el-input
              v-model="deptName"
              placeholder="请输入名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container tree down-tree">
          <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--工业设备数据-->
      <el-col :span="20" :xs="24" style="border-left: 1px solid rgb(231, 232, 237);">

				<el-row :gutter="10" class="mb8 toolsline">
					<el-col :span="1.5">
						<el-button
							type="primary"
							plain
							icon="Plus"
							@click="handleAdd"
							v-hasPermi="['industry:industryAreaSensor:add']"
						>新增</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button
							type="danger"
							plain
							icon="Delete"
							:disabled="multiple"
							@click="handleDelete"
							v-hasPermi="['industry:industryAreaSensor:remove']"
						>删除</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button
							type="warning"
							plain
							icon="Download"
							@click="handleExport"
							v-hasPermi="['industry:industryAreaSensor:export']"
						>导出</el-button>
					</el-col>
					<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
				</el-row>

				<el-table height="calc(100vh - 240px)" v-loading="loading" :data="industryAreaSensorList" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" align="center" />
					<el-table-column label="序号" align="center" prop="id" />
					<el-table-column label="工业区域" align="center" prop="areaName" />
					<el-table-column label="工业设备id" align="center" prop="sensorId" />
					<el-table-column label="工业设备名称" align="center" prop="sensorName" />
					<el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
						<template #default="scope">
							<el-button
								type="text"
								icon="Delete"
								@click="handleDelete(scope.row)"
								v-hasPermi="['industry:industryAreaSensor:remove']"
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

      </el-col>
		</el-row>



    <sensor ref="sensorRef" @ok="handleQuery" :industryAreaId="queryParams.industryAreaId"/>
    </el-card>
  </div>
</template>

<script setup name="IndustryAreaSensor">
import { listIndustryAreaSensor, getIndustryAreaSensor, delIndustryAreaSensor, addIndustryAreaSensor, updateIndustryAreaSensor } from "@/api/industry/industryAreaSensor";
import { treeselect } from "@/api/industry/industryArea";
import { deptAndIndustryAreaTreeSelect } from "@/api/industry/base";
import sensor from "./sensor";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const industryAreaSensorList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const areaName = ref("");
const deptOptions = ref(undefined);
const filterNode = (value, data) => {
	if (!value) return true;
	return data.label.indexOf(value) !== -1;
}
const deptName = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sensorId: null,
    industryAreaId: null,
    deptId:null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 根据名称筛选区域树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

/** 查询区域下拉树结构 */
function getTreeSelect() {
  deptAndIndustryAreaTreeSelect({status:"0",delFlag:'0'}).then(response => {
    deptOptions.value = response.data;
  });
};

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.industryAreaId = '';
	queryParams.value.deptId = '';
	if(data.type != null){
		queryParams.value.industryAreaId = data.id;
	}else{
		queryParams.value.deptId = data.id;
	}
  handleQuery();
};

/** 查询工业区域-传感器关联列表 */
function getList() {
  loading.value = true;
  listIndustryAreaSensor(queryParams.value).then(response => {
    industryAreaSensorList.value = response.rows;
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
    sensorId: null,
    industryAreaId: null
  };
  proxy.resetForm("industryAreaSensorRef");
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
	if(queryParams.value.industryAreaId != null && queryParams.value.industryAreaId != ''){
		proxy.$refs["sensorRef"].show();
	}else{
		proxy.$modal.msgError("请选择区域");
	}
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getIndustryAreaSensor(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改工业区域-传感器关联";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["industryAreaSensorRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateIndustryAreaSensor(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addIndustryAreaSensor(form.value).then(response => {
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
    return delIndustryAreaSensor(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('industry/industryAreaSensor/export', {
    ...queryParams.value
  }, `industryAreaSensor_${new Date().getTime()}.xlsx`)
}

getTreeSelect();
getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
