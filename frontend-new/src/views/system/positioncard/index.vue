<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <!--      <el-form-item label="聚通部门ID" prop="bjtDeptId">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.bjtDeptId"-->
      <!--            placeholder="请输入聚通部门ID"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="厂区ID" prop="orgId">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.orgId"-->
      <!--            placeholder="请输入厂区ID"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="标签号" prop="tagId">
        <el-input
            v-model="queryParams.tagId"
            placeholder="请输入标签号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="类型" prop="types">-->
      <!--        <el-select v-model="queryParams.types" placeholder="请选择类型" @keyup.enter="handleQuery">-->
      <!--          <el-option value="BTT01">普通型</el-option>-->
      <!--          <el-option value="BTT02">车载型</el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="引擎标记" prop="engineMask">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.engineMask"-->
      <!--            placeholder="请输入引擎标记"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="更新时间" prop="raiseTime">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.raiseTime"-->
      <!--            placeholder="请输入更新时间"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="电量" prop="volt">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.volt"-->
      <!--            placeholder="请输入电量"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="电量单位" prop="voltunit">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.voltunit"-->
      <!--            placeholder="请输入电量单位"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
<!--      <el-form-item label="是否绑定" prop="used">-->
<!--        <el-select v-model="queryParams.used" placeholder="请选择是否被绑定">-->
<!--          <el-option-->
<!--              v-for="item in isUsed"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button
            type="info"
            plain
            @click="currentTag"
        >标签同步
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="primary"-->
<!--            plain-->
<!--            icon="Plus"-->
<!--            @click="handleAdd"-->
<!--            v-hasPermi="['positioning:card:add']"-->
<!--        >新增-->
<!--        </el-button>-->
<!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="success"-->
      <!--            plain-->
      <!--            icon="Edit"-->
      <!--            :disabled="single"-->
      <!--            @click="handleUpdate"-->
      <!--            v-hasPermi="['positioning:card:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="danger"-->
<!--            plain-->
<!--            icon="Delete"-->
<!--            :disabled="multiple"-->
<!--            @click="handleDelete"-->
<!--            v-hasPermi="['positioning:card:remove']"-->
<!--        >删除-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            plain-->
<!--            @click="bind"-->
<!--        >人员绑定-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            plain-->
<!--            @click="unbind"-->
<!--        >人员解绑-->
<!--        </el-button>-->
<!--      </el-col>-->
      <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>
		<div class="tablebox">
			<el-table v-loading="loading" :data="cardList" 
			@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"/>
				<el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
				<!--      <el-table-column label="部门" align="center" prop="bjtDeptId"/>-->
<!--				<el-table-column label="厂区ID" align="center" prop="orgId"/>-->
				<el-table-column label="标签号" align="center" prop="tagId" width="150"/>
<!--				<el-table-column label="类型" align="center" prop="types" :formatter="typeFormatter"/>-->
<!--				<el-table-column label="引擎标记" align="center" prop="engineMask"/>-->
				<el-table-column label="电量" align="center" prop="power" :formatter="powerFormatter"/>
				<el-table-column label="电量单位" align="center" prop="voltUnit"/>
				<el-table-column label="标签类型" align="center" prop="bjtEntityType" :formatter="entityTypeFormatter"/>
	<!--      <el-table-column label="是否被绑定" align="center" prop="used" :formatter="usedFormatter"/>-->
				<el-table-column label="持卡人" align="center" prop="staffName"/>
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
					<template #default="scope">
						<el-button
								type="text"
								icon="Delete"
								@click="handleDelete(scope.row)"
								v-hasPermi="['positioning:card:remove']"
						>删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改定位卡信息对话框 -->
    <el-dialog :title="title" v-model="open" width="370px" append-to-body>
      <el-form ref="cardRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签号" prop="tagId">
          <el-input v-model="form.tagId" placeholder="请输入标签号"/>
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-select v-model="form.types" placeholder="请选择类型" style="width: 100%">
            <el-option
                v-for="item in typesEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签类型" prop="entityType">
          <el-select v-model="form.entityType" placeholder="请选择标签类型" style="width: 100%">
            <el-option
                v-for="item in entityTypesEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
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

    <el-dialog title="人员绑定" v-model="bindShow" width="800px" append-to-body>
      <div>
        <el-radio-group v-model="staffOrContractorChoose" @change="changeChoose">
          <el-radio label="inner">员工</el-radio>
          <el-radio label="guest">访客</el-radio>
          <el-radio label="external">承包商</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 10px">
        <div v-if="staffOrContractorChoose === 'external'">
          承包商:
          <el-select v-model="personnelQueryParams.contractorId" placeholder="请选择承包商">
            <el-option v-for="item in contractorList"
                       :key="item.id"
                       :label="item.contractorName"
                       :value="item.id"></el-option>
          </el-select>
          <el-button type="success" style="margin-left: 5px" @click="getContractorPersonnelList">查询</el-button>
          <el-table style="margin-top: 10px" v-loading="loading" ref="contractorTable"
                    :data="contractorPersonnelList" @selection-change="handlePersonnelSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
            <el-table-column label="姓名" align="center" prop="personnelName"/>
            <el-table-column label="承包商" align="center" prop="contractorName"/>
            <el-table-column label="手机号" align="center" prop="phonenumber"/>
            <el-table-column label="岗位" align="center" prop="post"/>
          </el-table>
          <pagination
              v-show="personnelTotal>0"
              :total="personnelTotal"
              v-model:page="personnelQueryParams.pageNum"
              v-model:limit="personnelQueryParams.pageSize"
              @pagination="getStaffList"
          />
        </div>
        <div v-if="staffOrContractorChoose === 'inner'">
          工号:
          <el-input v-model="staffQueryParams.staffNo" label="员工工号:"
                    style="width: 200px; margin-bottom: 10px"></el-input>
          <el-button type="success" style="margin-left: 5px" @click="getStaffList">查询</el-button>
          <el-table v-loading="loading" ref="staffTable"

                    :data="staffList" @selection-change="handleStaffSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="${comment}" align="center" prop="staffId" v-if="false"/>
            <el-table-column label="姓名" align="center" prop="staffName"/>
            <el-table-column label="部门" align="center" prop="deptName"/>
            <el-table-column label="工号" align="center" prop="staffNo"/>
            <el-table-column label="手机号" align="center" prop="phonenumber"/>
            <el-table-column label="入职时间" align="center" prop="joinedDate"/>
          </el-table>
          <pagination
              v-show="staffTotal>0"
              :total="staffTotal"
              v-model:page="staffQueryParams.pageNum"
              v-model:limit="staffQueryParams.pageSize"
              @pagination="getStaffList"
          />
        </div>
        <div v-if="staffOrContractorChoose === 'guest'">
          访客:
          <el-table v-loading="loading" ref="guestTable"
                    :data="guestList" @selection-change="handleGuestSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="${comment}" align="center" prop="staffId" v-if="false"/>
            <el-table-column label="姓名" align="center" prop="staffName"/>
            <el-table-column label="手机号" align="center" prop="phonenumber"/>
          </el-table>
          <pagination
              v-show="guestTotal>0"
              :total="guestTotal"
              v-model:page="guestQueryParams.pageNum"
              v-model:limit="guestQueryParams.pageSize"
              @pagination="getGuestList"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="bindData">绑 定</el-button>
          <el-button @click="staffCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Card">
import {
  listCard,
  getCard,
  delCard,
  addCard,
  updateCard,
  bindStaff,
  currentCardList,
  unbindStaffList
} from "@/api/system/positionCard";
import {listContractor} from '@/api/contractorManage/contractor'
import {listPersonnel} from '@/api/contractorManage/personnel.js'
import {listStaff} from "@/api/system/staff";
import {h, ref} from 'vue';

const {proxy} = getCurrentInstance();

const cardList = ref([]);
const staffList = ref([]);
const guestList = ref([]);
const open = ref(false);
const bindShow = ref(false);
const staffTotal = ref(0);
const personnelTotal = ref(0);
const guestTotal = ref(0);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const staffids = ref([]);
const guestids = ref([]);
const personnelids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const staffOrContractor = ref(false);
const staffOrContractorChoose = ref('inner');
const contractorList = ref([]);
const contractorPersonnelList = ref([]);

const data = reactive({
  form: {},
  isUsed: [
    {
      label: '已绑定',
      value: '1'
    },
    {
      label: '未绑定',
      value: '0'
    }
  ],
  typesEnum: [
    {
      label: '普通型',
      value: 'BTT01'
    },
    {
      label: '车载型',
      value: 'BTT02'
    }
  ],
  entityTypesEnum: [
    {
      label: '人员',
      value: 'staff'
    },
    {
      label: '车辆',
      value: 'car'
    },
    {
      label: '承包商',
      value: 'contractor'
    }
  ],
  staffQueryParams: {
    pageNum: 1,
    pageSize: 10,
    delFlag: '0',
    status: '0'
  },
  personnelQueryParams: {
    pageNum: 1,
    pageSize: 10,
    contractorId: null,
    delFlag: '0'
  },
  guestQueryParams: {
    pageNum: 1,
    pageSize: 10,
    delFlag: '0'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bjtDeptId: null,
    orgId: null,
    tagId: null,
    types: null,
    engineMask: null,
    raiseTime: null,
    volt: null,
    voltUnit: null,
    entityType: null,
    used: null
  },
  rules: {
    bjtDeptId: [
      {required: true, message: "聚通部门ID不能为空", trigger: "blur"}
    ],
    orgId: [
      {required: true, message: "厂区ID不能为空", trigger: "blur"}
    ],
    tagId: [
      {required: true, message: "标签号不能为空", trigger: "blur"}
    ],
    types: [
      {required: true, message: "类型不能为空", trigger: "blur"}
    ],
    engineMask: [
      {required: true, message: "引擎标记不能为空", trigger: "blur"}
    ],
    raiseTime: [
      {required: true, message: "更新时间不能为空", trigger: "blur"}
    ],
    volt: [
      {required: true, message: "电量不能为空", trigger: "blur"}
    ],
    voltUnit: [
      {required: true, message: "电量单位不能为空", trigger: "blur"}
    ],
    entityType: [
      {required: true, message: "标签类型不能为空", trigger: "change"}
    ],
    used: [
      {required: true, message: "是否被绑定不能为空", trigger: "blur"}
    ]
  }
});

let {
  queryParams,
  form,
  rules,
  typesEnum,
  entityTypesEnum,
  isUsed,
  staffQueryParams,
  personnelQueryParams,
  guestQueryParams
} = toRefs(data);

/** 查询定位卡信息列表 */
function getList() {
  loading.value = true;
  listCard(queryParams.value).then(response => {
    cardList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function changeChoose() {
  //console.log(staffOrContractorChoose.value)
  //staffOrContractor.value = !staffOrContractor.value
  if (staffOrContractorChoose.value == 'external') {
    getContractorList();
    getContractorPersonnelList();
  } else if (staffOrContractorChoose.value == 'inner') {
    getStaffList();
  } else if (staffOrContractorChoose.value == 'guest') {
    getGuestList();
  }
}

function getContractorPersonnelList() {
  personnelids.value = []
  listPersonnel(personnelQueryParams.value).then(res => {
    //console.log(personnelids)
    const id = ids.value[0];
    let staffId = null;
    cardList.value.forEach(card => {
      if (id == card.id) {
        staffId = card.staffId
      }
    })
    contractorPersonnelList.value = res.rows
    personnelTotal.value = res.total
    bindShow.value = true
    loading.value = false;

    contractorPersonnelList.value.forEach((row, index) => {
      if (staffId == row.id) {
        setTimeout(() => {
          proxy.$refs.contractorTable.toggleRowSelection(row, true);
        }, 100)
      }
    })

  })
}

function bindData() {
  let id;
  let type;
  if (personnelids.value.length == 1) {
    id = personnelids.value[0]
    type = 2
  } else if (staffids.value.length == 1) {
    id = staffids.value[0]
    type = 1
  } else if (guestids.value.length == 1) {
    id = guestids.value[0]
    type = 3
  }
  const tagId = ids.value;
  if (null != type) {
    let data = {
      staffId: id,
      tagId: tagId[0],
      bjtType: type
    }
    bindStaff(data).then(res => {
      proxy.$modal.msgSuccess("绑定成功!");
      bindShow.value = false
      getList();
    })
  } else {
    proxy.$modal.msgWarning("请选择一个人员进行绑定");
    bindShow.value = false
  }
}

function powerFormatter(e) {
  return e.power + '%'
}

function typeFormatter(e) {
  if ('BTT01' === e.types) {
    return '普通型'
  } else if ('BTT02' === e.types) {
    return '车载型'
  }
}

function usedFormatter(e) {
  if (1 === e.used) {
    return '已绑定'
  } else if (0 === e.used) {
    return '未绑定'
  }
}

function entityTypeFormatter(e) {
  //console.log(e)
  if ('staff' === e.bjtEntityType) {
    return '人员'
  } else if ('car' === e.bjtEntityType) {
    return '车辆'
  } else if ('guest' === e.bjtEntityType) {
    return '访客'
  } else {
    return '承包商'
  }
}

function currentTag() {
  currentCardList().then(res => {
    if (res.data) {
      proxy.$modal.msgSuccess("更新成功");
    } else {
      proxy.$modal.msgError("更新失败");
    }
  })
}

function unbind() {
  const id = ids.value;
  unbindStaffList(id).then(res => {
    proxy.$modal.msgWarning("解绑成功");
    getList();
  })
}

function bind() {
  //todo 弹出一个页面
  const id = ids.value;
  if (id.length > 1) {
    proxy.$modal.msgWarning("绑定功能仅支持单选");
    return
  }
  if (id.length == 0) {
    proxy.$modal.msgWarning("请先选择需要绑定的定位卡");
    return
  }
  let item;
  cardList.value.forEach(item1 => {
    if (item1.id === id[0]) {
      item = item1
    }
  })
  console.log(item)
  if (item.bjtEntityType === 'staff') {
    staffOrContractorChoose.value = 'inner'
    getStaffList();
  } else if (item.bjtEntityType === 'guest') {
    staffOrContractorChoose.value = 'guest'
    getGuestList()
  } else {
    staffOrContractorChoose.value = 'external'
    getContractorPersonnelList()
  }
}

function getContractorList() {
  listContractor().then(res => {
    contractorList.value = res.rows
  })
}

function getStaffList() {
  staffids.value = []
  //console.log(this.$refs.staffTable.$refs);
  const id = ids.value[0];
  let staffId = null;
  cardList.value.forEach(card => {
    if (id == card.id) {
      staffId = card.staffId
    }
  })
  staffQueryParams.value.staffType = 1
  listStaff(staffQueryParams.value).then(response => {
    staffList.value = response.rows
    bindShow.value = true
    staffTotal.value = response.total;
    loading.value = false;
    staffList.value.forEach((row, index) => {
      if (staffId == row.staffId) {
        setTimeout(() => {
          proxy.$refs.staffTable.toggleRowSelection(row, true);
        }, 100)
      }
    })
  })
}

function getGuestList() {
  staffids.value = []
  const id = ids.value[0];
  let staffId = null;
  cardList.value.forEach(card => {
    if (id == card.id) {
      staffId = card.staffId
    }
  })
  staffQueryParams.value.staffType = 2
  listStaff(staffQueryParams.value).then(response => {
    guestList.value = response.rows
    bindShow.value = true
    guestTotal.value = response.total;
    loading.value = false;
    guestList.value.forEach((row, index) => {
      if (staffId == row.staffId) {
        //todo 不会选中
        //proxy.$refs.staffTable.toggleRowSelection(row, true)
        setTimeout(() => {
          proxy.$refs.guestTable.toggleRowSelection(row, true);
          // console.log(JSON.parse(JSON.stringify(row)))
          // console.log(index)
        }, 100)
      }
    })


  })
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

function staffCancel() {
  bindShow.value = false;
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    bjtDeptId: null,
    orgId: null,
    tagId: null,
    types: null,
    engineMask: null,
    raiseTime: null,
    volt: null,
    voltUnit: null,
    entityType: null,
    used: null
  };
  proxy.resetForm("cardRef");
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

function handleStaffSelectionChange(selection) {
  staffids.value = selection.map(item => item.staffId);
}

function handleGuestSelectionChange(selection) {
  guestids.value = selection.map(item => item.staffId);
}

function handlePersonnelSelectionChange(selection) {
  personnelids.value = selection.map(item => item.id);
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加定位卡信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getCard(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改定位卡信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cardRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCard(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCard(form.value).then(response => {
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
    return delCard(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('positioning/card/export', {
    ...queryParams.value
  }, `card_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped lang="scss">
	.app-container{
		height: calc(100vh - 84px);
		.tablebox{
			height: calc(100% - 140px);
			overflow: auto;
		}
	}
</style>