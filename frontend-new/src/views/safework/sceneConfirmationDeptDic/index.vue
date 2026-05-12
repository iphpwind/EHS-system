<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="作业类型" prop="operationType">
        <el-select v-model="queryParams.operationType" placeholder="请选择作业类型" clearable>
          <el-option
              v-for="dict in safe_operation_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
              v-for="dict in status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['safework:sceneConfirmationDeptDic:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['safework:sceneConfirmationDeptDic:edit']"
        >修改</el-button>
      </el-col>
      <!--      <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['safework:sceneConfirmationDeptDic:remove']"
              >删除</el-button>
            </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['safework:sceneConfirmationDeptDic:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="sceneConfirmationDeptDicList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="作业类型" align="center" prop="operationType">
        <template #default="scope">
          <dict-tag :options="safe_operation_type" :value="scope.row.operationType"/>
        </template>
      </el-table-column>
      <el-table-column label="适用级别" align="center" prop="applicableLevel">
        <template #default="scope">
          <dict-tag v-if="scope.row.operationType=='0'" :options="fireworkLevelList0" :value="scope.row.applicableLevel ? scope.row.applicableLevel.split(',') : []"/>
          <dict-tag v-if="scope.row.operationType=='2'" :options="fireworkLevelList2" :value="scope.row.applicableLevel ? scope.row.applicableLevel.split(',') : []"/>
          <dict-tag v-if="scope.row.operationType=='4'" :options="fireworkLevelList4" :value="scope.row.applicableLevel ? scope.row.applicableLevel.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="现场确认部门序号" align="center" prop="departmentNo" />
      <el-table-column label="现场确认部门名称" align="center" prop="departmentName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['safework:sceneConfirmationDeptDic:edit']"
          >修改</el-button>
          <!--          <el-button
                      type="text"
                      icon="Delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['safework:sceneConfirmationDeptDic:remove']"
                    >删除</el-button>-->
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

    <!-- 添加或修改现场确认字典对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="sceneConfirmationDeptDicRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="作业类型" prop="operationType">
          <el-select v-model="form.operationType" placeholder="请选择作业类型" @change="typeChange">
            <el-option
                v-for="dict in safe_operation_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用级别" v-if="form.operationType == '0' || form.operationType == '2' || form.operationType == '4'">
          <el-checkbox-group v-model="form.applicableLevel">
            <el-checkbox
                v-for="dict in fireworkLevelList"
                :key="dict.value"
                :label="dict.value">
              {{dict.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="现场确认部门序号" prop="departmentNo">
          <el-input v-model="form.departmentNo" placeholder="请输入现场确认部门序号" />
        </el-form-item>
        <el-form-item label="现场确认部门名称" prop="departmentName">
          <el-input v-model="form.departmentName" placeholder="请输入现场确认部门名称" />
        </el-form-item>
        <el-form-item label="操作人员类型" prop="operatorType">
          <el-select v-model="form.operatorType" placeholder="请选择操作人员类型">
            <el-option
                v-for="dict in safe_operation_out_in"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in status"
                :key="dict.value"
                :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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

<script setup name="SceneConfirmationDeptDic">
import { listSceneConfirmationDeptDic, getSceneConfirmationDeptDic, delSceneConfirmationDeptDic, addSceneConfirmationDeptDic, updateSceneConfirmationDeptDic } from "@/api/safework/sceneConfirmationDeptDic";
import { listFireworkLevel } from "@/api/safework/fireworkLevel";
import {h} from "vue";
import {listHoistingworkLevel} from "@/api/safework/hoistingworkLevel";
import {listHighworkLevel} from "@/api/safework/highworkLevel";

const { proxy } = getCurrentInstance();
const { status, safe_operation_out_in, safe_operation_type, safe_applicable_level } = proxy.useDict('status', 'safe_operation_out_in', 'safe_operation_type', 'safe_applicable_level');

const sceneConfirmationDeptDicList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const fireworkLevelList = ref([]);
const fireworkLevelList4 = ref([]);
const fireworkLevelList2 = ref([]);
const fireworkLevelList0 = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    operationType: null,
    status: "0"
  },
  rules: {
    operationType: [
      { required: true, message: "作业类型不能为空", trigger: "change" }
    ],
    departmentNo: [
      { required: true, message: "现场确认部门序号不能为空", trigger: "blur" }
    ],
    departmentName: [
      { required: true, message: "现场确认部门名称不能为空", trigger: "blur" }
    ],
    operatorType: [
      { required: true, message: "操作人员类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询现场确认字典列表 */
function getList() {
  loading.value = true;
  listSceneConfirmationDeptDic(queryParams.value).then(response => {
    sceneConfirmationDeptDicList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function typeChange(){
  if(form.value.operationType=='0'){
    listFireworkLevel({status:"0"}).then(response => {
      var list = []
      for(var i=0; i<response.rows.length; i++){
        list.push({
          value : response.rows[i].id.toString(),
          label : response.rows[i].levelName,
        })
      }
      fireworkLevelList.value = list;
    });
  }
  if(form.value.operationType=='2'){
    listHoistingworkLevel({status:"0"}).then(response => {
      var list = []
      for(var i=0; i<response.rows.length; i++){
        list.push({
          value : response.rows[i].id.toString(),
          label : response.rows[i].levelName,
        })
      }
      fireworkLevelList.value = list;
    });
  }
  if(form.value.operationType=='4'){
    listHighworkLevel({status:"0"}).then(response => {
      var list = []
      for(var i=0; i<response.rows.length; i++){
        list.push({
          value : response.rows[i].id.toString(),
          label : response.rows[i].levelName,
        })
      }
      fireworkLevelList.value = list;
    });
  }
}

function getFireworkLevelList(){
  listFireworkLevel({status:"0"}).then(response => {
    var list = []
    for(var i=0; i<response.rows.length; i++){
      list.push({
        value : response.rows[i].id.toString(),
        label : response.rows[i].levelName,
      })
    }
    fireworkLevelList0.value = list;
  });

  listHighworkLevel({status:"0"}).then(response => {
    var list = []
    for(var i=0; i<response.rows.length; i++){
      list.push({
        value : response.rows[i].id.toString(),
        label : response.rows[i].levelName,
      })
    }
    fireworkLevelList4.value = list;
  });

  listHoistingworkLevel({status:"0"}).then(response => {
    var list = []
    for(var i=0; i<response.rows.length; i++){
      list.push({
        value : response.rows[i].id.toString(),
        label : response.rows[i].levelName,
      })
    }
    fireworkLevelList2.value = list;
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
    operationType: null,
    applicableLevel: [],
    departmentNo: null,
    departmentName: null,
    operatorType: null,
    status: "0"
  };
  proxy.resetForm("sceneConfirmationDeptDicRef");
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
  title.value = "添加现场确认字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getSceneConfirmationDeptDic(id).then(response => {
    form.value = response.data;
    if(form.value.applicableLevel!=null && form.value.applicableLevel!=''){
      form.value.applicableLevel = form.value.applicableLevel.split(",");
    }
    open.value = true;
    title.value = "修改现场确认字典";
    if(row.operationType=='0'){
      listFireworkLevel({status:"0"}).then(res => {
        var list = []
        for(var i=0; i<res.rows.length; i++){
          list.push({
            value : res.rows[i].id.toString(),
            label : res.rows[i].levelName,
          })
        }
        fireworkLevelList.value = list;
      });
    }
    if(row.operationType=='2'){
      listHoistingworkLevel({status:"0"}).then(res => {
        var list = []
        for(var i=0; i<res.rows.length; i++){
          list.push({
            value : res.rows[i].id.toString(),
            label : res.rows[i].levelName,
          })
        }
        fireworkLevelList.value = list;
      });
    }
    if(row.operationType=='4'){
      listHighworkLevel({status:"0"}).then(res => {
        console.log(res.rows)
        console.log(res.rows.length)
        var list = []
        for(var i=0; i<res.rows.length; i++){
          list.push({
            value : res.rows[i].id.toString(),
            label : res.rows[i].levelName,
          })
        }
        fireworkLevelList.value = list;
      });
    }
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sceneConfirmationDeptDicRef"].validate(valid => {
    if (valid) {
      if(form.value.applicableLevel!=null && form.value.applicableLevel!=''){
        form.value.applicableLevel = form.value.applicableLevel.join(",");
      }
      if (form.value.id != null) {
        updateSceneConfirmationDeptDic(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSceneConfirmationDeptDic(form.value).then(response => {
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
    return delSceneConfirmationDeptDic(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/sceneConfirmationDeptDic/export', {
    ...queryParams.value
  }, `sceneConfirmationDeptDic_${new Date().getTime()}.xlsx`)
}

getFireworkLevelList();
getList();
</script>
