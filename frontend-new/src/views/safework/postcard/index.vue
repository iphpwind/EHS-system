<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="部门" prop="enterpriseCode">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择所属部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="危险等级" prop="riskLevel">
        <!--        <el-input-->
        <!--          v-model="queryParams.riskLevel"-->
        <!--          placeholder="请输入危险等级"-->
        <!--          clearable-->
        <!--          @keyup.enter="handleQuery"-->
        <!--        />-->
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
          <el-option label="删除" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态" prop="publishSatus">
        <el-select v-model="queryParams.publishSatus" clearable filterable placeholder="请选择">
          <el-option label="未发布" value="0"></el-option>
          <el-option label="已发布" value="1"></el-option>
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
            v-hasPermi="['safework:postcard:add']"
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
            v-hasPermi="['safework:postcard:edit']"
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
            v-hasPermi="['safework:postcard:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['safework:postcard:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postcardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="所属部门" align="center" prop="deptName"/>
      <el-table-column label="适用区域" align="center" prop="objectId">
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.objectIdArray" :key="arr">
            <template v-for="obj in obOptions" :key="obj.id">
              <span v-if="arr === obj.id">{{ obj.name }}</span>
              <span v-if="arr === obj.id && index<scope.row.objectIdArray.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="危险等级" align="center" prop="riskLevel"/>
      <el-table-column label="应知卡名称" align="center" prop="name"/>
      <!--      <el-table-column label="主要危害因素" align="center" prop="mainHazardFactors" />-->
      <!--      <el-table-column label="易发生事故类" align="center" prop="accidentProne" />-->
      <!--      <el-table-column label="岗位操作注意事项" align="center" prop="attention" />-->
      <!--      <el-table-column label="需穿戴的劳动防护用品" align="center" prop="protectiveEquipment" />-->
      <!--      <el-table-column label="应急处置措施" align="center" prop="emergencyMeasure" />-->
      <!--      <el-table-column label="安全警示标志" align="center" prop="safetyWarningSigns" />-->
      <!--      <el-table-column label="发布人签名" align="center" prop="sign" />-->
      <el-table-column label="发布状态" align="center" prop="publishSatus">
        <template #default="scope">
          <span v-if="scope.row.publishSatus == 0">未发布</span>
          <span v-else>已发布</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              v-if="scope.row.publishSatus == '0'"
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['safework:postcard:edit']"
          >编辑
          </el-button>
          <el-button
              v-if="scope.row.publishSatus == '0'"
              type="text"
              icon="Edit"
              @click="handlePub(scope.row)"
              v-hasPermi="['safework:postcard:edit']"
          >发布
          </el-button>
          <el-button
              type="text"
              icon="Edit"
              @click="handleLook(scope.row)"
              v-hasPermi="['safework:postcard:edit']"
          >查看
          </el-button>
          <el-button
              v-if="scope.row.publishSatus == '1'"
              type="text"
              icon="Edit"
              @click="handleUser(scope.row)"
              v-hasPermi="['safework:postcard:edit']"
          >接受人
          </el-button>
          <el-button
              v-if="scope.row.publishSatus == '1' && scope.row.delFlag == '0'"
              type="text"
              icon="Delete"
              @click="handleChange(scope.row.id,'1')"
              v-hasPermi="['safework:postcard:remove']"
          >停用
          </el-button>
          <el-button
              v-if="scope.row.publishSatus == '1' && scope.row.delFlag == '1'"
              type="text"
              icon="Delete"
              @click="handleChange(scope.row.id,'0')"
              v-hasPermi="['safework:postcard:remove']"
          >启用
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

    <!-- 添加或修改岗位告知卡对话框 -->
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
      <el-form ref="postcardRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号"/>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <!--          <el-input v-model="form.postId" placeholder="请输入岗位名称" />-->
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
              @func="getMsg"
          />
        </el-form-item>
        <el-form-item label="岗位名称" prop="postId">
          <!--          <el-input v-model="form.postId" placeholder="请输入岗位名称" />-->
          <el-select v-model="form.postId" multiple clearable filterable placeholder="请选择">
            <el-option
                v-for="item in postOptions"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用区域" prop="objectId">
          <!--          <el-input v-model="form.postId" placeholder="请输入岗位名称" />-->
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
          <!--          <el-input v-model="form.riskLevel" placeholder="请输入危险等级" />-->
          <el-select v-model="form.riskLevel" clearable filterable placeholder="请选择">
            <el-option label="一级" value="一级"></el-option>
            <el-option label="二级" value="二级"></el-option>
            <el-option label="三级" value="三级"></el-option>
            <el-option label="四级" value="四级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应知卡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入应知卡名称"/>
        </el-form-item>
        <el-form-item label="作业对象" prop="workObject">
          <el-input v-model="form.workObject" placeholder="请输入作业对象"/>
        </el-form-item>
        <el-form-item label="主要危害因素" prop="mainHazardFactors">
          <el-input v-model="form.mainHazardFactors" placeholder="请输入主要危害因素"/>
        </el-form-item>
        <el-form-item label="易发生事故类" prop="accidentProne">
          <el-input v-model="form.accidentProne" placeholder="请输入易发生事故类"/>
        </el-form-item>
        <el-form-item label="岗位操作注意事项" prop="attention">
          <el-input v-model="form.attention" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="需穿戴的劳动防护用品" prop="protectiveEquipment">
          <el-input v-model="form.protectiveEquipment" placeholder="请输入需穿戴的劳动防护用品"/>
        </el-form-item>
        <el-form-item label="应急处置措施" prop="emergencyMeasure">
          <el-input v-model="form.emergencyMeasure" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="安全警示标志" prop="safetyWarningSigns">
          <!--          <el-input v-model="form.emergencyMeasure" type="textarea" placeholder="请输入内容" />-->
          <el-checkbox-group v-model="form.safetyWarningSigns">
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
    <!-- 查看岗位告知卡对话框 -->
    <el-dialog :title="title" v-model="lookopen" width="900px" append-to-body>
      <el-form ref="postcardRef" :model="form" :rules="rules" label-width="180px" disabled="true">
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号"/>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <!--          <el-input v-model="form.postId" placeholder="请输入岗位名称" />-->
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
              @func="getMsg"
          />
        </el-form-item>
        <el-form-item label="岗位名称" prop="postId">
          <!--          <el-input v-model="form.postId" placeholder="请输入岗位名称" />-->
          <el-select v-model="form.postId" multiple clearable filterable placeholder="请选择">
            <el-option
                v-for="item in postOptions"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用区域" prop="objectId">
          <!--          <el-input v-model="form.postId" placeholder="请输入岗位名称" />-->
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
          <!--          <el-input v-model="form.riskLevel" placeholder="请输入危险等级" />-->
          <el-select v-model="form.riskLevel" clearable filterable placeholder="请选择">
            <el-option label="一级" value="一级"></el-option>
            <el-option label="二级" value="二级"></el-option>
            <el-option label="三级" value="三级"></el-option>
            <el-option label="四级" value="四级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应知卡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入应知卡名称"/>
        </el-form-item>
        <el-form-item label="作业对象" prop="workObject">
          <el-input v-model="form.workObject" placeholder="请输入作业对象"/>
        </el-form-item>
        <el-form-item label="主要危害因素" prop="mainHazardFactors">
          <el-input v-model="form.mainHazardFactors" placeholder="请输入主要危害因素"/>
        </el-form-item>
        <el-form-item label="易发生事故类" prop="accidentProne">
          <el-input v-model="form.accidentProne" placeholder="请输入易发生事故类"/>
        </el-form-item>
        <el-form-item label="岗位操作注意事项" prop="attention">
          <el-input v-model="form.attention" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="需穿戴的劳动防护用品" prop="protectiveEquipment">
          <el-input v-model="form.protectiveEquipment" placeholder="请输入需穿戴的劳动防护用品"/>
        </el-form-item>
        <el-form-item label="应急处置措施" prop="emergencyMeasure">
          <el-input v-model="form.emergencyMeasure" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="安全警示标志" prop="safetyWarningSigns">
          <!--          <el-input v-model="form.emergencyMeasure" type="textarea" placeholder="请输入内容" />-->
          <el-checkbox-group v-model="form.safetyWarningSigns">
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
    </el-dialog>
    <el-dialog title="二维码" v-model="eqerweimamo" width="800px" append-to-body>
      <div style="width:200px;height:200px"><img :src="erweimaimgUrl"/></div>
    </el-dialog>
  </div>
</template>

<script setup name="Postcard">
import {listPostcard, getPostcard, delPostcard, addPostcard, updatePostcard, publish} from "@/api/safework/postcard";
import {treeselect} from "@/api/system/dept";
import {listObject} from "@/api/safework/object";
import {listPost} from "@/api/system/post";
import {websocketCommand} from "@/utils/websocket";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const postcardList = ref([]);
const open = ref(false);
const lookopen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const deptOptions = ref(undefined);
const postOptions = ref([]);
const obOptions = ref([]);

const erweimaimgUrl = ref("");
const eqerweimamo = ref(false);

const store = useStore();

const data = reactive({
  wsObj: null,
  form: {},
  newform: {
    id: null,
    publishSatus: null,
    postId: null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    num: null,
    deptId: null,
    postId: null,
    objectId: null,
    riskLevel: null,
    name: null,
    workObject: null,
    mainHazardFactors: null,
    accidentProne: null,
    attention: null,
    protectiveEquipment: null,
    emergencyMeasure: null,
    safetyWarningSigns: null,
    sign: null,
    publishSatus: null,
  },
  rules: {
    deptId: [
      {required: true, message: '请选择所属部门', trigger: 'change'}
    ],
    objectId: [
      {required: true, message: '请选择适用区域', trigger: 'change'}
    ],
    postId: [
      {required: true, message: '请选择岗位', trigger: 'change'}
    ],
    name: [
      {required: true, message: '请填写应知卡名称', trigger: 'blur'}
    ],
    num: [
      {required: true, message: '请填写编号', trigger: 'blur'}
    ],
    riskLevel: [
      {required: true, message: '请选择危险等级', trigger: 'blur'}
    ],
    workObject: [
      {required: true, message: '请填写作业对象', trigger: 'blur'}
    ],
    mainHazardFactors: [
      {required: true, message: '请填写主要危害因素', trigger: 'blur'}
    ],
    attention: [
      {required: true, message: '请填写岗位操作注意事项', trigger: 'blur'}
    ],
    emergencyMeasure: [
      {required: true, message: '请填应急处置措施', trigger: 'blur'}
    ],

  }
});

const {queryParams, form, rules, newform, wsObj} = toRefs(data);

/* 查询风险分析对象 */

function getObject() {
  listObject({delFlag: 0}).then(res => {
    obOptions.value = res.rows;
  })
}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

function getMsg(data) {
  let val = data.id

  if (val == null || val == '' || val == 'undefined') {
    // proxy.$modal.msgWarning("先选择所属部门");
  } else {
    /*form.value.postIds = null;
    listPost({deptId: val}).then(response => {
      postOptions.value = response.rows;
    });*/
  }
}

function getPost() {
  listPost().then(response => {
    postOptions.value = response.rows;
  });
}

/** 查询岗位告知卡列表 */
function getList() {
  loading.value = true;
  listPostcard(queryParams.value).then(response => {
    if (response.total > 0) {
      for (let row of response.rows) {
        if (row.objectId != "") {
          row.objectIdArray = row.objectId.split(",");
        }
      }
    }
    postcardList.value = response.rows;
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
    num: null,
    deptId: null,
    postId: null,
    objectId: null,
    riskLevel: null,
    name: null,
    workObject: null,
    mainHazardFactors: null,
    accidentProne: null,
    attention: null,
    protectiveEquipment: null,
    emergencyMeasure: null,
    safetyWarningSigns: [],
    sign: null,
    publishSatus: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("postcardRef");
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
  form.value.delFlag = "0";
  title.value = "添加岗位告知卡";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  let shu = [];
  const id = row.id || ids.value
  getPostcard(id).then(response => {
    form.value = response.data;
    listPost({deptId: form.value.deptId}).then(res => {
      postOptions.value = res.rows;
    });
    let aa = form.value.postId.split(",");
    aa.forEach((j, index) => {
      console.log(j)
      shu.push(parseInt(j))
    })
    form.value.postId = shu;
    form.value.objectId = form.value.objectId.split(",");
    form.value.safetyWarningSigns = form.value.safetyWarningSigns.split(",");

    open.value = true;
    title.value = "修改岗位告知卡";
  });
}

function handleLook(row) {
  reset();
  let shu = [];
  const id = row.id || ids.value
  getPostcard(id).then(response => {
    form.value = response.data;
    listPost({deptId: form.value.deptId}).then(res => {
      postOptions.value = res.rows;
    });
    let aa = form.value.postId.split(",");
    aa.forEach((j, index) => {
      console.log(j)
      shu.push(parseInt(j))
    })
    form.value.postId = shu;
    form.value.objectId = form.value.objectId.split(",");
    form.value.safetyWarningSigns = form.value.safetyWarningSigns.split(",");

    lookopen.value = true;
    title.value = "岗位告知卡";
  });
}

function handleUser(row) {
  proxy.$router.push({
    path: '/three/postsign',
    query: {
      postId: row.id,
      postName: row.name,
      postIds: row.postId
    }
  })


}

function handleChange(id, status) {
  updatePostcard({id: id, delFlag: status}).then(res => {
    proxy.$modal.msgSuccess("修改成功");
    getList();
  })
}

function handlePub(row) {

  publish(row).then(res => {
    erweimaimgUrl.value = res.msg
    eqerweimamo.value = true;
  })
  startSocket();
  // proxy.$modal.confirm('是否确认发布？').then(function() {
  //   console.log(row)
  //   newform.value.id=row.id;
  //   newform.value.publishSatus="1";
  //   newform.value.postId=row.postId;
  //   console.log(newform.value)
  //   return updatePostcard(newform.value);
  // }).then(() => {
  //   getList();
  //   proxy.$modal.msgSuccess("修改成功");
  // }).catch(() => {});
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["postcardRef"].validate(valid => {
    if (valid) {
      form.value.objectId = form.value.objectId.join(',');
      form.value.postId = form.value.postId.join(',');
      form.value.safetyWarningSigns = form.value.safetyWarningSigns.join(",");
      if (form.value.id != null) {
        updatePostcard(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPostcard(form.value).then(response => {
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
    return delPostcard(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/postcard/export', {
    ...queryParams.value
  }, `postcard_${new Date().getTime()}.xlsx`)
}

function startSocket() {
  let url = import.meta.env.VITE_WS_BASE_API + '/safework/websocket/' + store.getters.user.userId
  this.wsObj = new WebSocket(url);
  websocketCommand(this.wsObj, 'create', 5000, function () {
    wsObj.send('')
  }, getSocketData, reconnectWs);
}

function stopSocket() {
  wsObj.close()
}

function reconnectWs() {
  if (this.wsObj) {
    startSocket();
  }
}

function getSocketData(e) {  // 创建接收消息函数
  console.log("接受到消息！！！！！！！！！！")
  console.log(e)
  const data = e && e.detail.data
  if (data == "true") {
    stopSocket()
    eqerweimamo.value = false;
    getList()
  }
}

getList();
getTreeselect();
getPost();
getObject();
</script>
