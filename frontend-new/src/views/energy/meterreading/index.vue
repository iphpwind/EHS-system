<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '10px' }">
      <el-row :gutter="20">
        <!--区域数据-->
        <el-col :span="4" :xs="24">

          <!--        <div class="head-container tree">-->
          <!--          <h4>区域设备导航</h4>-->
          <!--          <el-input-->
          <!--              v-model="areaName"-->
          <!--              placeholder="请输入区域名称"-->
          <!--              clearable-->
          <!--              prefix-icon="Search"-->
          <!--              style="margin-bottom: 20px"-->
          <!--          />-->
          <!--        </div>-->
          <div class="head-container tree down-tree">
            <el-tree
                :data="areaOptions"
                :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :highlight-current="highlightBd"
                ref="areaTreeRef"
                default-expand-all
                @node-click="handleNodeClick"
            />
          </div>
        </el-col>
        <!--电表数据-->
        <el-col :span="20" :xs="24" style="border-left: 1px solid rgb(231, 232, 237);">
          <el-row :gutter="10" class="mb8 toolsline">
            日期
            <div class="fl">
              <el-date-picker
                  v-model="startTime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="datetime">
              </el-date-picker>
              至
              <el-date-picker
                  v-model="endTime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="datetime">
              </el-date-picker>
            </div>
            <el-col :span="1.5"></el-col>
            <el-col :span="1.5">
              <el-button
                  type="primary"
                  plain
                  icon="Plus"
                  @click="handleQuery"
                  v-hasPermi="['energy:ammeter:add']"
              >查询
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  type="warning"
                  plain
                  icon="Download"
                  @click="handleExport"
                  v-hasPermi="['energy:ammeter:export']"
              >导出
              </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

          <el-table height="calc(100vh - 300px)" v-loading="loading" :data="meterreadingList" @selection-change="handleSelectionChange"
                    class="tab-mheight">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="序号" align="center" prop="id" v-if="false"/>
            <!--					<el-table-column label="区域" align="center" prop="areaName" />-->
            <el-table-column label="设备名称" align="center" prop="sensorName"/>
            <el-table-column label="开始抄表时间" align="center" prop="startTime"/>
            <el-table-column label="开始抄表数据" align="center" prop="startData"/>
            <el-table-column label="结束抄表时间" align="center" prop="endTime"/>
            <el-table-column label="结束抄表数据" align="center" prop="endData"/>
            <el-table-column label="时间段内用电量(小计)" align="center" prop="count"/>
            <!--					<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">-->
            <!--					<template #default="scope">-->
            <!--						<el-button-->
            <!--						type="text"-->
            <!--						icon="Delete"-->
            <!--						@click="handleDelete(scope.row)"-->
            <!--						v-hasPermi="['energy:ammeter:remove']"-->
            <!--						>删除</el-button>-->
            <!--					</template>-->
            <!--					</el-table-column>-->
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


      <!--    <sensor ref="sensorRef" @ok="handleQuery" :electricAreaId="queryParams.electricAreaId"/>-->
    </el-card>
  </div>
</template>

<script setup name="Ammeter">
import {areatreeselect} from "@/api/energy/area";
import {listMeterreading} from "@/api/energy/meterreading";
import {listAmmeter, getAmmeter, delAmmeter, addAmmeter, updateAmmeter} from "@/api/energy/ammeter";
import {parseTime} from "@/utils/ruoyi";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const {status} = proxy.useDict('status');

const meterreadingList = ref([]);
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
const startTime = ref('')
const endTime = ref('')
const highlightBd = true;

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    startTime: startTime.value,
    endTime: endTime.value,
    electricAreaId: null
  },
});

const {queryParams} = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

/** 根据名称筛选区域树 */
watch(areaName, val => {
  proxy.$refs["areaTreeRef"].filter(val);
});

/** 查询区域下拉树结构 */
function getTreeSelect() {
  areatreeselect({status: "0", delFlag: '0'}).then(response => {
    areaOptions.value = response.data;
  });
};

/** 查询电表列表 */
function getList() {
  loading.value = true;

  queryParams.value.startTime = startTime.value
  queryParams.value.endTime = endTime.value
  listMeterreading(queryParams.value).then(response => {
    console.log(response)
    meterreadingList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.areaId = data.id;
  getList();
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
// function handleAdd() {
// 	if(queryParams.value.electricAreaId != null){
//     proxy.$refs["sensorRef"].show();
// 	}else{
// 		proxy.$modal.msgError("请选择区域");
// 	}
// }

/** 删除按钮操作 */
function handleDelete(row) {
  const ammeterIds = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delAmmeter(ammeterIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('energy/electric/meterReadingExport', {
    ...queryParams.value
  }, `用电抄表_${new Date().getTime()}.xlsx`)
}

function getDate() {
  var dt = new Date()
  var y = dt.getFullYear()
  var mt = dt.getMonth()
  var d = dt.getDate()
  startTime.value = parseTime(new Date(y, mt, d, 0, 0, 0))

  // dt.setDate(dt.getDate() + 1);//获取1天前的日期
  // var year = dt.getFullYear();
  // var month = dt.getMonth();
  // var day = dt.getDate();
  // var hh = d
  endTime.value = parseTime(new Date())
}

getDate();
getTreeSelect();
getList();
</script>


<style lang="scss" scoped>
.el-pagination {
  right: 20px !important;
}
.toolsline{
  height: 30px;
}

</style>

