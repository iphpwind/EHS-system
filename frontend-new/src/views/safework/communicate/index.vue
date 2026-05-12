<template>
  <div class="app-container">
    <div class="inoutradio">

    </div>

    <div class="neibubox" v-if="neibubox == true">
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
        <el-form-item label="状态" prop="state">
          <el-select v-model="queryParams.state" placeholder="请选择状态" @keyup.enter="handleQuery">
            <el-option v-for="item in stateSelect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="innerOrExternal" @change="inoutChange">
            <el-radio label="inner">内部通讯录</el-radio>
            <el-radio label="external">外部可用资源</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
          >修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
          >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <!--        <el-button-->
          <!--            type="warning"-->
          <!--            plain-->
          <!--            icon="Download"-->
          <!--            @click="handleExport"-->
          <!--            v-hasPermi="['safework:inner:export']"-->
          <!--        >导出-->
          <!--        </el-button>-->
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="innerList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
        <el-table-column label="队伍名称" align="center" prop="teamName"/>
        <el-table-column label="队伍级别" align="center" prop="teamLevel"/>
        <el-table-column label="队伍负责人" align="center" prop="leaderStaffName"/>
        <el-table-column label="应急职务" align="center" prop="emergencyJob"/>
        <el-table-column label="电话号码" align="center" prop="phone"/>
        <el-table-column label="队伍描述" align="center" prop="remark"/>
        <el-table-column label="状态" align="center" prop="state" :formatter="stateFormatter"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
                type="text"
                icon="Edit"
                @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
                type="text"
                icon="Delete"
                @click="handleDelete(scope.row)"
            >删除
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
    </div>

    <!-- 添加或修改应急通讯对话框 -->
    <el-dialog :title="title" v-model="open" width="550px" append-to-body>
      <el-form ref="innerRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="队伍名称" prop="teamName">
          <el-input v-model="form.teamName" placeholder="请输入队伍名称"/>
        </el-form-item>
        <el-form-item label="队伍级别" prop="teamLevel">
          <el-input v-model="form.teamLevel" placeholder="请输入队伍级别"/>
        </el-form-item>
        <el-form-item label="负责人" prop="teamLeaderStaffId">
          <el-input v-model="form.teamLeaderStaffId" placeholder="请选择队伍负责人" v-show="false"/>
          <el-input v-model="leaderStaffName" placeholder="请选择队伍负责人" disabled/>
          <el-button type="info" style="margin-top: 10px" @click="openStaff">选择队伍负责人</el-button>
        </el-form-item>
        <el-form-item label="应急职务" prop="emergencyJob">
          <el-input v-model="form.emergencyJob" placeholder="请输入应急职务"/>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话号码"/>
        </el-form-item>
        <el-form-item label="队伍描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="队员" prop="remark">
          <!-- <el-input type="textarea" placeholder="请选择队员" disabled/> -->
          <div class="tags">
            <el-tag
                v-for="(tag, index) in pxygChoosedData"
                :key="tag.staffId"
                closable
                @close="pxryClose(tag, index)"
            >
              {{ tag.staffName }}
            </el-tag>
          </div>
          <el-button type="info" style="margin-top: 10px" @click="openStaff2">添加队员</el-button>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option v-for="item in stateSelect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="选择负责人" v-model="staffOpen" width="800px" append-to-body>
      <el-form :model="staffQueryParams" ref="queryRef" label-width="68px">
        <el-form-item label="人员姓名" prop="state">
          <el-input v-model="staffQueryParams.staffName" style="max-width: 200px"></el-input>
          <el-button type="primary" icon="Search" @click="getStaffList" style="margin-left: 10px">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="staffList" 
				@row-click="handleStaffSelectionChange"
				height="400px">
        <!--        <el-table-column type="selection" width="55" align="center"/>-->
        <el-table-column label="部门" align="center" prop="deptName"/>
        <el-table-column label="姓名" align="center" prop="staffName"/>
        <el-table-column label="电话" align="center" prop="phonenumber"/>
      </el-table>
    </el-dialog>
    <el-dialog title="选择队员" v-model="staffOpen2" width="800px" append-to-body>
      <el-form :model="staffQueryParams" ref="queryRef" label-width="68px">
        <el-form-item label="人员姓名" prop="state">
          <el-input v-model="staffQueryParams.staffName" style="max-width: 200px"></el-input>
          <el-button type="primary" icon="Search" @click="getStaffList" style="margin-left: 10px">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="staffList" ref="staffTable"
                @select="staffChange"
								v-loading="staffListloading"
                height="400px">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="部门" align="center" prop="deptName"/>
        <el-table-column label="姓名" align="center" prop="staffName"/>
        <el-table-column label="电话" align="center" prop="phonenumber"/>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitStaff">确 定</el-button>
          <el-button @click="staffCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 外部 -->
    <div class="waibubox" v-if="waibubox == true">
      <el-form :model="queryParams2" ref="queryRef2" :inline="true" label-width="68px">
        <el-form-item label="状态" prop="state">
          <el-select v-model="queryParams2.state" placeholder="请选择状态" @keyup.enter="handleQuery2">
            <el-option v-for="item in stateSelect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery2">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery2">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="innerOrExternal" @change="inoutChange">
            <el-radio label="inner">内部</el-radio>
            <el-radio label="external">外部</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd2"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single2"
              @click="handleUpdate2"
          >修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple2"
              @click="handleDelete2"
          >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <!--					<el-button-->
          <!--						type="warning"-->
          <!--						plain-->
          <!--						icon="Download"-->
          <!--						@click="handleExport2"-->
          <!--						v-hasPermi="['safework:external:export']"-->
          <!--					>导出</el-button>-->
        </el-col>
        <right-toolbar v-model:showSearch="showSearch2" @queryTable="getList2"></right-toolbar>
      </el-row>

      <el-table v-loading="loading2" :data="externalList2" @selection-change="handleSelectionChange2">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
        <el-table-column label="所属机构" align="center" prop="deptId" v-if="false"/>
        <el-table-column label="紧急事件" align="center" prop="eventName"/>
        <el-table-column label="外部资源" align="center" prop="externalSource"/>
        <el-table-column label="电话号码" align="center" prop="phone"/>
        <el-table-column label="状态" align="center" prop="state" :formatter="stateFormatter"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
                type="text"
                icon="Edit"
                @click="handleUpdate2(scope.row)"
            >修改
            </el-button>
            <el-button
                type="text"
                icon="Delete"
                @click="handleDelete2(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total2>0"
          :total="total2"
          v-model:page="queryParams2.pageNum"
          v-model:limit="queryParams2.pageSize"
          @pagination="getList2"
      />

      <!-- 添加或修改应急通讯-外部通讯录对话框 -->
      <el-dialog :title="title2" v-model="open2" width="500px" append-to-body>
        <el-form ref="externalRef" :model="form2" :rules="rules2" label-width="80px">
          <el-form-item label="紧急事件" prop="eventName">
            <el-input v-model="form2.eventName" placeholder="请输入紧急事件"/>
          </el-form-item>
          <el-form-item label="外部资源" prop="externalSource">
            <el-input v-model="form2.externalSource" placeholder="请输入外部资源"/>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="form2.phone" placeholder="请输入电话号码"/>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="form2.state" placeholder="请选择状态">
              <el-option v-for="item in stateSelect"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm2">确 定</el-button>
            <el-button @click="cancel2">取 消</el-button>
          </div>
        </template>
      </el-dialog>

    </div>
  </div>
</template>

<script setup name="Inner">
import {listInner, getInner, delInner, addInner, updateInner} from "@/api/safework/communicate";
import {listStaff} from "@/api/system/staff";

import {listExternal, getExternal, delExternal, addExternal, updateExternal} from "@/api/safework/external";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const innerList = ref([]);
const staffList = ref([]);
const staffSelectList = ref([]);
const open = ref(false);
const staffOpen = ref(false);
const staffOpen2 = ref(false);
const loading = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const innerOrExternal = ref('inner');
const showSearch = ref(true);
const total = ref(0);
const staffTotal = ref(0);
const title = ref("");
const neibubox = ref(true);
const waibubox = ref(false);

const externalList2 = ref([]);
const open2 = ref(false);
const loading2 = ref(true);
const showSearch2 = ref(true);
const ids2 = ref([]);
const single2 = ref(true);
const multiple2 = ref(true);
const total2 = ref(0);
const title2 = ref("");
const pxygChoosedData = ref([]);
const staffListloading = ref(true);

const data = reactive({
  form: {},
  staffQueryParams: {
    pageNum: 1,
    pageSize: 10000000,
    deptId: null,
    teamName: null,
    teamLevel: null,
    teamLeaderStaffId: null,
    staffName: null,
    emergencyJob: null,
    phone: null,
    state: null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    teamName: null,
    teamLevel: null,
    teamLeaderStaffId: null,
    emergencyJob: null,
    phone: null,
    state: null
  },
  rules: {},
  stateSelect: [
    {
      label: '正常',
      value: 0
    }, {
      label: '停用',
      value: 1
    }
  ],
  leaderStaffName: null,

  form2: {},
  queryParams2: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    eventName: null,
    externalSource: null,
    phone: null,
    state: null
  },
  rules2: {}
});

const {queryParams, form, rules, stateSelect, staffQueryParams, leaderStaffName} = toRefs(data);
const {queryParams2, form2, rules2} = toRefs(data);

function inoutChange() {
  //console.log(innerOrExternal.value)
  if (innerOrExternal.value === 'inner') {
    neibubox.value = true;
    waibubox.value = false;
    getList();
  } else {
    neibubox.value = false;
    waibubox.value = true;
  }
}

function staffChange(val) {
  staffSelectList.value = val
  pxygChoosedData.value = [];
  for (var i = 0; i < val.length; i++) {
    pxygChoosedData.value.push(val[i])
  }
}

function pxryClose(tag, index) {
  pxygChoosedData.value.splice(index, 1)
}

function submitStaff() {
  console.log(staffSelectList);
  staffOpen2.value = false;
}


/** 查询应急通讯列表 */
function getList() {
  loading.value = true;
  listInner(queryParams.value).then(response => {
    innerList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function handleStaffSelectionChange(row) {
  form.value.teamLeaderStaffId = row.staffId
  leaderStaffName.value = row.staffName
  staffOpen.value = false
}

function openStaff() {
  staffOpen.value = true
  getStaffList()
}

function openStaff2() {
	staffListloading.value = true;
	staffQueryParams.value.staffName = null;
	getStaffList();
	proxy.$nextTick(() => {
		staffOpen2.value = true
	})
  
  // proxy.$nextTick(() => {
  //   var pxryZancun = pxygChoosedData.value
  //   proxy.$refs["staffTable"].clearSelection();
  //   pxryZancun.forEach((item) => {
  //     staffList.value.forEach((row) => {
  //       if (item.staffId === row.staffId) {
  //         console.log('jinlailez')
  //         proxy.$refs["staffTable"].toggleRowSelection(row, true)
  //       }
  //     })
  //   })
  // })
}

function getStaffList() {
  listStaff(staffQueryParams.value).then(res => {
    var pxryZancunss = pxygChoosedData.value
		
		staffList.value = res.rows
		staffTotal.value = res.total
		
		proxy.$nextTick(() => {
			proxy.$refs["staffTable"].clearSelection();
			pxryZancunss.forEach((item) => {
				staffList.value.forEach((row) => {
					if (item.staffId === row.staffId) {
						proxy.$refs["staffTable"].toggleRowSelection(row, true)
					}
				})
			})
			staffListloading.value = false;
		})
  })
	
	
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

function staffCancel() {
  staffOpen2.value = false;
  staffQueryParams.value.staffName = null;
  staffOpen2.value;
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    deptId: null,
    teamName: null,
    teamLevel: null,
    teamLeaderStaffId: null,
    emergencyJob: null,
    phone: null,
    remark: null,
    state: null
  };
  proxy.resetForm("innerRef");
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
  title.value = "添加应急通讯";
  pxygChoosedData.value = [];
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  pxygChoosedData.value= []
  const id = row.id || ids.value
  getInner(id).then(response => {
    form.value = response.data;
    pxygChoosedData.value = response.data.team
    leaderStaffName.value = response.data.leaderStaffName
    open.value = true;
    title.value = "修改应急通讯";
  });
}

/** 提交按钮 */
function submitForm() {
  if (pxygChoosedData.value.length != 0) {
    let str = ''
    pxygChoosedData.value.forEach(item => {
      str += item.staffId + ','
    })
    str = str.substring(0, str.length - 1)
    form.value.teamMembersId = str
    console.log(form.value.teamMembersId)
  }
  proxy.$refs["innerRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateInner(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addInner(form.value).then(response => {
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
  proxy.$modal.confirm(h('p', null, [h('span', {style: 'color: black'}, '确定删除该数据吗'), h('p', {style: 'color: red'}, "删除后不可恢复!!!")]), {}).then(function () {
    return delInner(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/inner/export', {
    ...queryParams.value
  }, `inner_${new Date().getTime()}.xlsx`)
}

function stateFormatter(e) {
  if (e.state == 0) {
    return '正常'
  }
  return '停用'
}

getList();

//外部函数-----------------------
/** 查询应急通讯-外部通讯录列表 */
function getList2() {
  loading2.value = true;
  listExternal(queryParams2.value).then(response => {
    externalList2.value = response.rows;
    total2.value = response.total;
    loading2.value = false;
  });
}

// 取消按钮
function cancel2() {
  open2.value = false;
  reset();
}

// 表单重置
function reset2() {
  form2.value = {
    id: null,
    deptId: null,
    eventName: null,
    externalSource: null,
    phone: null,
    state: null
  };
  proxy.resetForm("externalRef2");
}

/** 搜索按钮操作 */
function handleQuery2() {
  queryParams2.value.pageNum = 1;
  getList2();
}

/** 重置按钮操作 */
function resetQuery2() {
  proxy.resetForm2("queryRef2");
  handleQuery2();
}

// 多选框选中数据
function handleSelectionChange2(selection) {
  ids2.value = selection.map(item => item.id);
  single2.value = selection.length != 1;
  multiple2.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd2() {
  reset2();
  open2.value = true;
  title2.value = "添加应急通讯-外部通讯录";
}

/** 修改按钮操作 */
function handleUpdate2(row) {
  reset2();
  const id = row.id || ids2.value
  getExternal(id).then(response => {
    form2.value = response.data;
    open2.value = true;
    title2.value = "修改应急通讯-外部通讯录";
  });
}

/** 提交按钮 */
function submitForm2() {
  proxy.$refs["externalRef"].validate(valid => {
    if (valid) {
      if (form2.value.id != null) {
        updateExternal(form2.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open2.value = false;
          getList2();
        });
      } else {
        addExternal(form2.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open2.value = false;
          getList2();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete2(row) {
  const idss = row.id || ids2.value;
  proxy.$modal.confirm(h('p', null, [h('span', {style: 'color: black'}, '确定删除该数据吗'), h('p', {style: 'color: red'}, "删除后不可恢复!!!")]), {}).then(function () {
    return delExternal(idss);
  }).then(() => {
    getList2();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport2() {
  proxy.download('safework/external/export', {
    ...queryParams2.value
  }, `external_${new Date().getTime()}.xlsx`)
}

getList2();

</script>
<style scoped lang="scss">
.tags {
  width: 100%;
  border: 1px solid #dedede;
  border-radius: 5px;
  min-height: 54px;
  padding: 5px 10px;

  .el-tag {
    margin: 5px;
  }
}
</style>
