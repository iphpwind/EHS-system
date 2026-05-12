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
      <!--电表数据-->
      <el-col :span="20" :xs="24" style="border-left: 1px solid rgb(231, 232, 237);">
<!--				<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">-->
<!--					<el-form-item>-->
<!--					<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--					<el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--					</el-form-item>-->
<!--				</el-form>-->

				<el-row :gutter="10" class="mb8 toolsline">
					<el-col :span="1.5">
					<el-button
						type="primary"
						plain
						icon="Plus"
						@click="handleAdd"
						v-hasPermi="['energy:ammeter:add']"
					>新增</el-button>
					</el-col>
					<el-col :span="1.5">
					</el-col>
					<el-col :span="1.5">
					<el-button
						type="danger"
						plain
						icon="Delete"
						:disabled="multiple"
						@click="handleDelete"
						v-hasPermi="['energy:ammeter:remove']"
					>删除</el-button>
					</el-col>
					<el-col :span="1.5">
					<el-button
						type="warning"
						plain
						icon="Download"
						@click="handleExport"
						v-hasPermi="['energy:ammeter:export']"
					>导出</el-button>
					</el-col>
					<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
				</el-row>

				<el-table height="calc(100vh - 300px)" v-loading="loading" :data="ammeterList" @selection-change="handleSelectionChange" class="tab-mheight">
					<el-table-column type="selection" width="55" align="center" />
					<el-table-column label="序号" align="center" prop="id" />
					<el-table-column label="电力区域" align="center" prop="areaName" />
					<el-table-column label="电表id" align="center" prop="sensorId" />
					<el-table-column label="电表名称" align="center" prop="sensorName" />
					<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
					<template #default="scope">
						<el-button
						type="text"
						icon="Delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['energy:ammeter:remove']"
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



    <sensor ref="sensorRef" @ok="handleQuery" :electricAreaId="queryParams.electricAreaId"/>
    </el-card>
	</div>
</template>

<script setup name="Ammeter">
import { areatreeselect } from "@/api/energy/area";
import { deptAndElectricAreaTreeSelect } from "@/api/energy/energyoverview";
import { listAmmeter, getAmmeter, delAmmeter, addAmmeter, updateAmmeter } from "@/api/energy/ammeter";
import sensor from "./sensor";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const { status } = proxy.useDict('status');

const ammeterList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const areaName = ref("");
const areaOptions = ref(undefined);
const deptOptions = ref("");
const deptName = ref("");

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
		electricAreaId: null,
    deptId:null
  },
});

const { queryParams } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

/** 根据名称筛选区域树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

/** 查询区域下拉树结构 */
function getTreeSelect() {
  deptAndElectricAreaTreeSelect({status:"0",delFlag:'0'}).then(response => {
    deptOptions.value = response.data;
  });
};

/** 查询电表列表 */
function getList() {
  loading.value = true;
  listAmmeter(queryParams.value).then(response => {
    ammeterList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 节点单击事件 */
function handleNodeClick(data) {
  console.log(data)
  queryParams.value.electricAreaId = '';
  queryParams.value.deptId = '';
  if(data.type != null){
			queryParams.value.electricAreaId = data.id;
		}else{
			queryParams.value.deptId = data.id;
		}
  handleQuery();
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
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
	if(queryParams.value.electricAreaId != null && queryParams.value.electricAreaId != ''){
    proxy.$refs["sensorRef"].show();
	}else{
		proxy.$modal.msgError("请选择区域");
	}
}

/** 删除按钮操作 */
function handleDelete(row) {
  const ammeterIds = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delAmmeter(ammeterIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('energy/ammeter/export', {
    ...queryParams.value
  }, `ammeter_${new Date().getTime()}.xlsx`)
}

getTreeSelect();
getList();
</script>


<style lang="scss" scoped>
.el-pagination{
  right: 20px!important;
}
.toolsline{
  height: 30px;
}

</style>

