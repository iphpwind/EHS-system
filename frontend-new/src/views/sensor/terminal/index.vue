<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container down-tree">
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
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="名称" prop="termName">
            <el-input
              v-model="queryParams.termName"
              placeholder="请输入名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="描述" prop="termMemo">
            <el-input
              v-model="queryParams.termMemo"
              placeholder="请输入描述"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="厂商" prop="termFactory">
            <el-input
              v-model="queryParams.termFactory"
              placeholder="请输入厂商"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="网关地址" prop="termChanserial">
            <el-input
              v-model="queryParams.termChanserial"
              placeholder="请输入网关地址"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="类型" prop="termTypeclass">
            <el-input
              v-model="queryParams.termTypeclass"
              placeholder="请输入类型"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
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
              v-hasPermi="['sensor:terminal:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['sensor:terminal:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['sensor:terminal:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['sensor:terminal:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table height="calc(100vh - 340px)" v-loading="loading" :data="terminalList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="ID" align="center" prop="termCode" />
          <el-table-column label="名称" align="center" prop="termName" />
    <!--      <el-table-column label="描述" align="center" prop="termMemo" />-->
          <el-table-column label="厂商" align="center" prop="termFactory" />
          <el-table-column label="网关地址" align="center" prop="termChanserial" />
    <!--      <el-table-column label="密码" align="center" prop="termPasswd" />-->
          <el-table-column label="状态" align="center" prop="termCurr" >
            <template #default="scope">
                <span v-if="scope.row.termCurr == 0">离线</span>
                <span v-if="scope.row.termCurr == 1">在线</span>
            </template>
          </el-table-column>
    <!--      <el-table-column label="时间" align="center" prop="termDt" width="180">-->
    <!--        <template #default="scope">-->
    <!--          <span>{{ parseTime(scope.row.termDt) }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
          <el-table-column label="最后通信时间" align="center" prop="termCommtime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.termCommtime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="网关协议" align="center" prop="protocolName" />
          <el-table-column label="连接设备数" align="center" prop="equipTotal" />
          <el-table-column label="部门" align="center" prop="deptName" />
          <el-table-column label="类型" align="center" prop="termTypeclass" />
    <!--      <el-table-column label="备注" align="center" prop="remark" />-->
          <el-table-column label="操作" align="center" fixed="right">
            <template #default="scope">


              <el-popover
                  placement="left"
                  :width="400"
                  trigger="hover"
              >
                <el-button
                    type="text"
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['sensor:terminal:edit']"
                >修改</el-button>
                <el-button
                    type="text"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['sensor:terminal:remove']"
                >删除</el-button>
                <el-button
                    type="text"
                    icon="switch"
                    @click="handleDisable(scope.row)"
                    v-hasPermi="['sensor:terminal:disable']"
                >
                  <span v-if="scope.row.delFlag == 0">停用</span>
                  <span v-if="scope.row.delFlag == 1">启用</span>
                </el-button>
                <el-button
                    type="text"
                    icon="upload"
                    @click="handleSyncRedis(scope.row)"
                    v-hasPermi="['sensor:terminal:sync']"
                >同步</el-button>
                <template #reference>
                  <el-button><el-icon><EditPen /></el-icon></el-button>
                </template>
              </el-popover>






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

        <!-- 添加或修改网关管理对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
          <el-form ref="terminalRef" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="名称" prop="termName">
              <el-input v-model="form.termName" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="描述" prop="termMemo">
              <el-input v-model="form.termMemo" placeholder="请输入描述" />
            </el-form-item>
            <el-form-item label="厂商" prop="termFactory">
              <el-input v-model="form.termFactory" placeholder="请输入厂商" />
            </el-form-item>
            <el-form-item label="归属部门" prop="deptId">
              <tree-select
                  v-model:value="form.deptId"
                  :options="deptOptions"
                  placeholder="请选择归属部门"
                  :objMap="{ value: 'id', label: 'label', children: 'children' }"
              />
            </el-form-item>
            <el-form-item label="网关协议" prop="termProtocolId">
                <el-select v-model="form.termProtocolId" placeholder="选择网关协议" clearable>
                  <el-option
                      v-for="dict in termProtocols"
                      :key="dict.protocolId"
                      :label="dict.protocolName"
                      :value="dict.protocolId"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="网关地址" prop="termChanserial">
              <el-input v-model="form.termChanserial" placeholder="请输入网关地址" />
            </el-form-item>
            <el-form-item label="密码" prop="termPasswd">
              <el-input v-model="form.termPasswd" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="接入设备类别" prop="equipCategoryId">
              <el-select v-model="form.equipCategoryId" placeholder="选择接入设备类别" clearable>
                  <el-option
                      v-for="dict in eqCategorys"
                      :key="dict.id"
                      :label="dict.name"
                      :value="dict.id"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="连接设备数" prop="equipTotal">
              <el-input type="number" v-model="form.equipTotal" placeholder="请输入连接设备数" />
            </el-form-item>
            <el-form-item label="连接点位数" prop="equipPointTotal">
              <el-input type="number" v-model="form.equipPointTotal" placeholder="请输入连接点位数" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Terminal">
import {treeselect} from "@/api/system/dept";
import { listTerminal, getTerminal, delTerminal, addTerminal, updateTerminal,getCurrTermSerial,updateDataForRedis,updateTerminalSatus,getEqCategoryList } from "@/api/sensor/terminal";
import { listProtocol } from "@/api/sensor/protocol";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const terminalList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const termProtocols = ref([]);
const eqCategorys = ref([]);
const deptOptions = ref(undefined);
const deptName = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    termName: null,
    termMemo: null,
    termFactory: null,
    termChanserial: null,
    termPasswd: null,
    termSim: null,
    termPhone: null,
    termCurr: null,
    termDt: null,
    termCommtime: null,
    termWuxiankh: null,
    termProtocolId: null,
    equipCategoryId: null,
    equipTotal: null,
    deptId: null,
    termTypeclass: null,
  },
  rules: {
    termName: [{required: true, message: "网关名称不能为空", trigger: "blur"}],
    termProtocolId: [{required: true, message: "网关协议不能为空", trigger: "blur"}],
    termChanserial: [{required: true, message: "网关地址不能为空", trigger: "blur"}],
    equipCategoryId: [{required: true, message: "接入设备类别不能为空", trigger: "blur"}]
  }
});

const { queryParams, form, rules } = toRefs(data);

const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
};

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};


// 获取设备类别
function getEqCateList(){
  getEqCategoryList().then(response =>{
    eqCategorys.value = response.data
  })
}

/**数据同步redis */
function handleSyncRedis(row){
  updateDataForRedis(row).then(response =>{
    proxy.$modal.msg(response.msg)
  })
}

/**
 * 停用网关
 */
function handleDisable(row){
  var termParams = {
    termCode: row.termCode,
    delFlag: row.delFlag
  }
  updateTerminalSatus(termParams).then(response =>{
    proxy.$modal.msg(response.msg);
    getList();
  })
  // getTerminal(termCode).then(response => {
  //   form.value = response.data;
  //   open.value = true;
  //   title.value = "修改网关管理";
  // });
}

/** 查询网关协议列表 */
function getProtocolList() {
  listProtocol().then(response => {
    termProtocols.value = response.rows;
  });
}

/** 查询网关管理列表 */
function getList() {
  loading.value = true;
  listTerminal(queryParams.value).then(response => {
    terminalList.value = response.rows;
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
    termCode: null,
    termName: null,
    termMemo: null,
    termFactory: null,
    termChanserial: null,
    termPasswd: null,
    termSim: null,
    termPhone: null,
    termCurr: null,
    termDt: null,
    termCommtime: null,
    termWuxiankh: null,
    termProtocolId: null,
    equipCategoryId: null,
    equipTotal: null,
    deptId: null,
    delFlag: null,
    termTypeclass: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    equipPointTotal: null,
  };
  proxy.resetForm("terminalRef");
}

/** 获取忱工网关地址*/
function getTermSerial(){
  getCurrTermSerial().then(response =>{
    console.log(response.data);
    if (typeof response.data !== 'undefined') {
      form.value.termChanserial = response.data.termChanserial = null?'30000001': parseInt(response.data.termChanserial) +1
    }
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
  queryParams.value.deptId = '';
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.termCode);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加网关管理";
  getTermSerial();
  getProtocolList();
  getEqCateList();
  getTreeselect();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  getProtocolList();
  getEqCateList();
  getTreeselect();
  const termCode = row.termCode || ids.value
  getTerminal(termCode).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改网关管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["terminalRef"].validate(valid => {
    if (valid) {
      if (form.value.termCode != null) {
        updateTerminal(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTerminal(form.value).then(response => {
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
  const termCodes = row.termCode || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    delTerminal(termCodes).then(response =>{
      proxy.$modal.msg(response.msg)
      getList();
    });
  }).then(() => {

  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sensor/terminal/export', {
    ...queryParams.value
  }, `terminal_${new Date().getTime()}.xlsx`)
}
getTreeselect();
getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
