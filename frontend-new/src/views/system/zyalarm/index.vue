<template>
  <div class="app-container">
		
		<div class="shaixuan">
			<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
				<el-form-item label="报警状态" prop="state">
					<el-select v-model="queryParams.state">
						<el-option
								v-for="item in stateEnum"
								:key="item.value"
								:label="item.label"
								:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>
		</div>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    @click="openHandleFunc('2')"
                >批量处理
                </el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

    <el-table v-loading="loading" :data="alarmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"/>
      <el-table-column label="" align="center" prop="id" v-if="false"/>
      <el-table-column label="围栏名称" align="center" prop="enclosureName"/>
      <el-table-column label="标签号" align="center" prop="tagId"/>
      <el-table-column label="发生时间" align="center" prop="raiseTimeStr"/>
      <el-table-column label="结束时间" align="center" prop="stopTimeStr"/>
      <el-table-column label="报警类型" align="center" prop="modeName"/>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormatter"/>
      <el-table-column label="处理时间" align="center" prop="solveTimeStr"/>
      <el-table-column label="处理意见" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="openHandleFunc('1', scope.row)"
          >处理报警
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

    <!-- 添加或修改真源报警信息对话框 -->
    <el-dialog :title="处理报警" v-model="openHandle" width="500px" append-to-body>
      <el-input type="textarea" v-model="handleOpinion" placeholder="请输入处理意见"/>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleAlarm" v-if="openHandleType === '1'">确 定</el-button>
          <el-button type="primary" @click="handles" v-if="openHandleType === '2'">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="alarmRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="真源报警id" prop="zyAlarmId">
          <el-input v-model="form.zyAlarmId" placeholder="请输入真源报警id"/>
        </el-form-item>
        <el-form-item label="真源区域id" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入真源区域id"/>
        </el-form-item>
        <el-form-item label="真源报警配置id" prop="triggerId">
          <el-input v-model="form.triggerId" placeholder="请输入真源报警配置id"/>
        </el-form-item>
        <el-form-item label="配置信息" prop="options">
          <el-input v-model="form.options" placeholder="请输入配置信息"/>
        </el-form-item>
        <el-form-item label="数字报警变量" prop="count">
          <el-input v-model="form.count" placeholder="请输入数字报警变量"/>
        </el-form-item>
        <el-form-item label="真源围栏id" prop="enclosureId">
          <el-input v-model="form.enclosureId" placeholder="请输入真源围栏id"/>
        </el-form-item>
        <el-form-item label="厂区id" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入厂区id"/>
        </el-form-item>
        <el-form-item label="发生时间" prop="raiseTime">
          <el-input v-model="form.raiseTime" placeholder="请输入发生时间"/>
        </el-form-item>
        <el-form-item label="报警停止时间" prop="stopTime">
          <el-input v-model="form.stopTime" placeholder="请输入报警停止时间"/>
        </el-form-item>
        <el-form-item label="报警处理时间" prop="solveTime">
          <el-input v-model="form.solveTime" placeholder="请输入报警处理时间"/>
        </el-form-item>
        <el-form-item label="报警状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入报警状态"/>
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

<script setup name="Alarm">
import {
  listAlarm,
  getAlarm,
  delAlarm,
  addAlarm,
  updateAlarm,
  handler,
  handlers,
  alarmHistory7,
  alarmHistory30, alarmTrend30, alarmTrend7
} from "@/api/safework/zyalarm";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const alarmList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const alarmHistoryList = ref([]);
const alarmTrendNameList = ref([]);
const alarmTrendList = ref([]);
const alarmTrendHandleList = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const handleOpinion = ref("");
const openHandle = ref(false);
const handleId = ref(null);
const openHandleType = ref(null);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    zyAlarmId: null,
    areaId: null,
    triggerId: null,
    options: null,
    count: null,
    enclosureId: null,
    orgId: null,
    raiseTime: null,
    stopTime: null,
    solveTime: null,
    state: null
  },
  stateEnum: [
    {
      label: "报警中",
      value: 0
    }, {
      label: "报警结束",
      value: 1
    }, {
      label: "已处理",
      value: 2
    }
  ],
  rules: {
    zyAlarmId: [
      {required: true, message: "真源报警id不能为空", trigger: "blur"}
    ],
    areaId: [
      {required: true, message: "真源区域id不能为空", trigger: "blur"}
    ],
    triggerId: [
      {required: true, message: "真源报警配置id不能为空", trigger: "blur"}
    ],
    options: [
      {required: true, message: "配置信息不能为空", trigger: "blur"}
    ],
    enclosureId: [
      {required: true, message: "真源围栏id不能为空", trigger: "blur"}
    ],
    orgId: [
      {required: true, message: "厂区id不能为空", trigger: "blur"}
    ],
    raiseTime: [
      {required: true, message: "发生时间不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules, stateEnum} = toRefs(data);

/** 查询真源报警信息列表 */
function getList() {
  loading.value = true;
  listAlarm(queryParams.value).then(response => {
    alarmList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function stateFormatter(e) {
  if (e.state == 0) {
    return '报警中'
  } else if (e.state == 1) {
    return '报警结束'
  } else if (e.state == 2) {
    return '已处理'
  }
}
function openHandleFunc(type, row) {
  handleOpinion.value = ""
  openHandle.value = true
  if (type == '1') {
    handleId.value = row.id
  }
  openHandleType.value = type
}
function handleAlarm() {
  handler({id: handleId.value, remark: handleOpinion.value}).then(res => {
    proxy.$modal.msgSuccess("处理成功");
    getList();
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
    zyAlarmId: null,
    areaId: null,
    triggerId: null,
    options: null,
    count: null,
    enclosureId: null,
    orgId: null,
    raiseTime: null,
    stopTime: null,
    solveTime: null,
    state: null
  };
  proxy.resetForm("alarmRef");
}

//批量处理
function handles(){
  //批量处理报警
  handlers({ids: ids.value, remark: handleOpinion.value}).then(res => {
    proxy.$modal.msgSuccess("处理成功");
    this.getList()
  })
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
  title.value = "添加真源报警信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getAlarm(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改真源报警信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["alarmRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAlarm(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAlarm(form.value).then(response => {
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
  const ids = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delAlarm(ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/alarm/export', {
    ...queryParams.value
  }, `alarm_${new Date().getTime()}.xlsx`)
}

queryParams.value.state = 0;
getList();

</script>
<style scoped lang="scss">
	.app-container{
		height: calc(100vh - 84px);
		overflow: auto;
		background: #f8f8f8;
		padding: 10px;
		
		.shaixuan{
			padding: 10px 10px 0;background: #fff;
			height: 55px;
			margin: 0 0 10px;
		}
	}
</style>
