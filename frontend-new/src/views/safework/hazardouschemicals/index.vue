<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属部门" prop="deptId">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择所属部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="危险等级" prop="riskLevel">
        <el-select v-model="queryParams.riskLevel" clearable filterable placeholder="请选择">
          <el-option label="一级" value="一级"></el-option>
          <el-option label="二级" value="二级"></el-option>
          <el-option label="三级" value="三级"></el-option>
          <el-option label="四级" value="四级"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="delFlag">
        <el-select v-model="queryParams.delFlag" clearable filterable placeholder="请选择">
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
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
          v-hasPermi="['safework:hazardouschemicals:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:hazardouschemicals:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:hazardouschemicals:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hazardouschemicalsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="适用区域" align="center" prop="objectId" >
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.objectIdArray" :key="arr">
            <template v-for="obj in obOptions" :key="obj.id">
              <span v-if="arr === obj.id">{{obj.name}}</span>
              <span v-if="arr === obj.id && index<scope.row.objectIdArray.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="危险等级" align="center" prop="riskLevel" />
      <el-table-column label="应知标题" align="center" prop="title" />
      <el-table-column label="状态" align="center" prop="delFlag" >
        <template #default="scope">
          <span v-if="scope.row.delFlag == 0">正常</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createName" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:hazardouschemicals:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDetail(scope.row)"
            v-hasPermi="['safework:hazardouschemicals:remove']"
          >详情</el-button>
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

    <!-- 添加或修改危化品告知卡对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="hazardouschemicalsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="适用区域" prop="objectId">
          <el-select v-model="form.objectId" multiple clearable filterable placeholder="请选择">
          <el-option
              v-for="item in obOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危险等级" prop="riskLevel">
          <el-select v-model="form.riskLevel" clearable filterable placeholder="请选择">
            <el-option label="一级" value="一级"></el-option>
            <el-option label="二级" value="二级"></el-option>
            <el-option label="三级" value="三级"></el-option>
            <el-option label="四级" value="四级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应知标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入应知标题" />
        </el-form-item>
        <el-form-item label="化学式" prop="chemicalReaction">
          <el-input v-model="form.chemicalReaction" placeholder="请输入化学式" />
        </el-form-item>
        <el-form-item label="危害信息" prop="hazardInfo">
          <el-input v-model="form.hazardInfo" type="textarea" placeholder="请输入危害信息" />
        </el-form-item>
        <el-form-item label="理化特性" prop="characteristic">
          <el-input v-model="form.characteristic" type="textarea" placeholder="请输入理化特性" />
        </el-form-item>
        <el-form-item label="急救处理" prop="firstAid">
          <el-input v-model="form.firstAid" type="textarea" placeholder="请输入急救处理" />
        </el-form-item>
        <el-form-item label="应急处理" prop="emergency">
          <el-input v-model="form.emergency" type="textarea" placeholder="请输入应急处理" />
        </el-form-item>
        <el-form-item label="图标文案" prop="iconText">
          <el-input v-model="form.iconText" placeholder="请输入图标文案" />
        </el-form-item>
        <el-form-item label="图标">
          <image-upload v-model="form.iconImg" limit="1"/>
        </el-form-item>
        <el-form-item label="安全警示标志" prop="protectiveSigns">
          <el-checkbox-group v-model="form.protectiveSigns">
            <el-checkbox label="禁止烟火" name="禁止烟火"></el-checkbox>
            <el-checkbox label="禁止吸烟" name="禁止吸烟"></el-checkbox>
            <el-checkbox label="禁止用水灭火" name="禁止用水灭火"></el-checkbox>
            <el-checkbox label="当心爆炸" name="当心爆炸"></el-checkbox>

            <el-checkbox label="当心落物" name="当心落物"></el-checkbox>
            <el-checkbox label="当心火灾" name="当心火灾"></el-checkbox>
            <el-checkbox label="当心触电" name="当心触电"></el-checkbox>
            <el-checkbox label="当心腐蚀" name="当心腐蚀"></el-checkbox>

            <el-checkbox label="当心机械伤人" name="当心机械伤人"></el-checkbox>
            <el-checkbox label="当心烫伤" name="当心烫伤"></el-checkbox>
            <el-checkbox label="谨防滑倒" name="谨防滑倒"></el-checkbox>
            <el-checkbox label="当心叉车" name="当心叉车"></el-checkbox>

            <el-checkbox label="当心吊物" name="当心吊物"></el-checkbox>
            <el-checkbox label="当心中毒" name="当心中毒"></el-checkbox>
            <el-checkbox label="上下楼梯请扶好" name="上下楼梯请扶好"></el-checkbox>
            <el-checkbox label="必须系安全带" name="必须系安全带"></el-checkbox>

            <el-checkbox label="必须持证上岗" name="必须持证上岗"></el-checkbox>
            <el-checkbox label="必须戴安全帽" name="必须戴安全帽"></el-checkbox>
            <el-checkbox label="必须穿防护服" name="必须穿防护服"></el-checkbox>
            <el-checkbox label="必须穿戴防护眼镜" name="必须穿戴防护眼镜"></el-checkbox>

            <el-checkbox label="必须穿戴防护口置" name="必须穿戴防护口置"></el-checkbox>
            <el-checkbox label="必须穿戴防护手套" name="必须穿戴防护手套"></el-checkbox>
            <el-checkbox label="必须穿防护鞋" name="必须穿防护鞋"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" prop="delFlag">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
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

<script setup name="Hazardouschemicals">
import { listHazardouschemicals, getHazardouschemicals, delHazardouschemicals, addHazardouschemicals, updateHazardouschemicals } from "@/api/safework/hazardouschemicals";
import {treeselect} from "@/api/system/dept";
import { listObject } from "@/api/safework/object";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const hazardouschemicalsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const deptOptions = ref(undefined);
const obOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    deptId: null,
    objectId: null,
    riskLevel: null,
    title: null,
    chemicalReaction: null,
    hazardInfo: null,
    characteristic: null,
    firstAid: null,
    emergency: null,
    iconText: null,
    iconImg: null,
    protectiveSigns: null,
  },
  rules: {
    deptId: [
      { required: true, message: '请选择所属部门', trigger: 'change' }
    ],
    objectId: [
      { required: true, message: '请选择适用区域', trigger: 'change' }
    ],
    riskLevel: [
      { required: true, message: '请选择危险等级', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/* 查询风险分析对象 */

function getObject() {
  listObject({delFlag:0}).then(res => {
    obOptions.value = res.rows;
  })
}
/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

/** 查询危化品告知卡列表 */
function getList() {
  loading.value = true;
  listHazardouschemicals(queryParams.value).then(response => {

    if(response.total>0){
      for(let row of response.rows){
        if(row.objectId != ""){
          row.objectIdArray = row.objectId.split(",");
        }
      }
    }

    hazardouschemicalsList.value = response.rows;
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
    enterpriseCode: null,
    deptId: null,
    objectId: null,
    riskLevel: null,
    title: null,
    chemicalReaction: null,
    hazardInfo: null,
    characteristic: null,
    firstAid: null,
    emergency: null,
    iconText: null,
    iconImg: null,
    protectiveSigns: [],
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("hazardouschemicalsRef");
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
  console.log('111111')
  reset();
  open.value = true;
  form.value.delFlag = '0';
  title.value = "添加危化品告知卡";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getHazardouschemicals(id).then(response => {
    form.value = response.data;
    form.value.objectId = form.value.objectId.split(",");
    form.value.protectiveSigns = form.value.protectiveSigns.split(",");
    open.value = true;
    title.value = "修改危化品告知卡";
  });
}
function handleDetail(row) {
  proxy.$router.push({
    path: '/three/hazardouschemicals/detail',
    query:{
      Id:row.id
    }
  })

}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["hazardouschemicalsRef"].validate(valid => {
    if (valid) {
      form.value.objectId = form.value.objectId.join(',');
      form.value.protectiveSigns = form.value.protectiveSigns.join(",");
      if (form.value.id != null) {
        updateHazardouschemicals(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addHazardouschemicals(form.value).then(response => {
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
    return delHazardouschemicals(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/hazardouschemicals/export', {
    ...queryParams.value
  }, `hazardouschemicals_${new Date().getTime()}.xlsx`)
}

getList();
getTreeselect();
getObject();
</script>
