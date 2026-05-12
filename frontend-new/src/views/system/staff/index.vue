<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="staffName">
        <el-input
          v-model="queryParams.staffName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择人员性别" clearable>
          <el-option
            v-for="dict in sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="deptIdss">
        <el-select
            ref="selectTree"
            v-model="valueName"
            :value="valueMultiple"
            multiple
            clearable
            @remove-tag="changeValue"
            @clear="clearHandle"
            placeholder="请选择">
          <el-option :value="valueName" style="height: auto; background: #fff">
            <el-tree
                show-checkbox
                :data="deptOptions"
                ref="deptRef"
                node-key="id"
                id="tree-option"
                default-expand-all
                :props="{ label: 'label', children: 'children' }"
                check-strictly="true"
                @check-change="handleNodeClick"
            />
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="岗位" prop="postIdss">-->
<!--        <el-select filterable clearable v-model="queryParams.postIdss" placeholder="请选择">-->
<!--          <el-option-->
<!--              v-for="item in postList"-->
<!--              :key="item.postId"-->
<!--              :label="item.postName"-->
<!--              :value="item.postId"-->
<!--          ></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
          v-hasPermi="['system:staff:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:staff:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:staff:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:staff:export']"
        >导出</el-button>
      </el-col>
			<el-col :span="1.5">
				<el-button
						type="info"
						plain
						icon="Upload"
						@click="handleImport"
						v-hasPermi="['system:staff:import']"
				>导入
				</el-button>
        <el-button type="warning" plain icon="download"
          @click="importTemplate">下载模板
        </el-button>
			</el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="staffList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工号" align="center" prop="staffNo" />
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="岗位" align="center" key="postName" prop="postName">
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.postIds" :key="arr">
            <template v-for="user in postList" :key="user.postId">
              <span v-if="Number(arr) === user.postId">{{user.postName}}</span>
              <span v-if="Number(arr) === user.postId && index<scope.row.postIds.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="staffName" />
      <el-table-column label="账号" align="center" prop="userName" />
      <el-table-column label="性别" align="center" prop="sex">
        <template #default="scope">
          <dict-tag :options="sys_user_sex" :value="scope.row.sex"/>
        </template>
      </el-table-column>
<!--      <el-table-column label="生日" align="center" prop="birthday" width="180">-->
<!--        <template #default="scope">-->
<!--          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="邮箱" align="center" prop="email" />-->
      <el-table-column label="电话" align="center" prop="phonenumber" />
      <el-table-column label="证件类型" align="center" prop="cardType" >
        <template #default="scope">
          <dict-tag :options="staff_card_type" :value="scope.row.cardType"/>
        </template>
      </el-table-column>
      <el-table-column label="证件号" align="center" prop="cardNo" />
<!--      <el-table-column label="备注" align="center" prop="remark" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:staff:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:staff:remove']"
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

    <!-- 添加或修改人员管理对话框 -->
    <el-dialog :title="title" v-model="open" width="650px" append-to-body>
      <el-form ref="staffRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="工号" prop="staffNo">
              <el-input v-if="form.staffId!=null && form.staffId!=''" readonly v-model="form.staffNo" placeholder="请输入员工工号" />
              <el-input v-if="form.staffId==null || form.staffId==''" v-model="form.staffNo" placeholder="请输入员工工号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员姓名" prop="staffName">
              <el-input v-model="form.staffName" placeholder="请输入人员姓名" />
            </el-form-item>
          </el-col>
        </el-row>
				<el-row>
          <el-col :span="12">
            <el-form-item label="人员性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择人员性别">
                <el-option
                    v-for="dict in sys_user_sex"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入人员手机" />
            </el-form-item>
          </el-col>
				</el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证件类型" prop="cardType">
              <el-select v-model="form.cardType" placeholder="请选择证件类型">
                <el-option
                    v-for="dict in staff_card_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号" prop="cardNo">
              <el-input v-model="form.cardNo" placeholder="请输入证件号" />
            </el-form-item>
          </el-col>
        </el-row>
				<el-row>
          <el-col :span="12">
            <el-form-item label="人员类型" prop="staffType">
              <el-select v-model="form.staffType" placeholder="请选择证件类型">
                <el-option
                    v-for="dict in staffType"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <tree-select
                  v-model:value="form.deptId"
                  :options="deptOptions"
                  placeholder="请选择所属部门"
                  :objMap="{ value: 'id', label: 'label', children: 'children' }"
                  @func="getMsg"
              />
            </el-form-item>
          </el-col>
				</el-row>
				<el-row>
          <el-col :span="12">
            <el-form-item label="岗位" prop="postIds">
              <el-select v-model="form.postIds" multiple placeholder="请选择" @click="postchange">
                <el-option
                    v-for="item in postOptions"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
					<el-col :span="12">
						<el-form-item label="人员邮箱" prop="email">
							<el-input v-model="form.email" placeholder="请输入人员邮箱" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="joinedDate">
              <el-date-picker clearable
                              v-model="form.joinedDate"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择入职日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
					<el-col :span="12">
						<el-form-item label="人员生日" prop="birthday">
							<el-date-picker clearable
								v-model="form.birthday"
								type="date"
								value-format="YYYY-MM-DD"
								placeholder="请选择人员生日">
							</el-date-picker>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>
          <el-col :span="24">
						<el-form-item label="工作职责" prop="jobDescription">
							<el-input v-model="form.jobDescription" type="textarea" placeholder="请输入工作职责" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
          <el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
						</el-form-item>
					</el-col>
				</el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 人员导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的人员数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Staff">
import {getToken} from "@/utils/auth";
import { listStaff, getStaff, delStaff, addStaff, updateStaff } from "@/api/system/staff";
import {treeselect,listDept} from "@/api/system/dept";
import {listPost} from "@/api/system/post";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { sys_user_sex,staff_card_type } = proxy.useDict('sys_user_sex','staff_card_type');

const staffList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const deptList = ref([]);
const postOptions = ref([]);
const postList = ref([]);
const postIdList = ref([]);



const valueName = ref([]);
const valueMultiple = ref([]);
const choosedValue = ref([]);
const selectValue = [];
const defaultProps = reactive({
      value: 'id',
      children: "children",
      label: "label",
    });
const deptRef = ref(null);

/*** 人员导入参数 */
const upload = reactive({
  // 是否显示弹出层（人员导入）
  open: false,
  // 弹出层标题（人员导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的人员数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/staff/importData"
});

const staffType = ref([{label: '内部员工', value: 1}, {label: '访客', value: 2}])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    staffName: null,
    sex: null,
		delFlag: '0',
    postIdss:'',
    deptIdss:''
  },
  rules: {
    deptId: [{required: true, message: "请选择归属部门", trigger: "blur"}],
    //postIds: [{required: true, message: "请选择岗位", trigger: "change"}],
    staffName: [{required: true, message: "人员名称不能为空", trigger: "blur"}],
    staffNo: [{required: true, message: "员工工号不能为空", trigger: "blur"}],
    staffType: [{required: true, message: "人员类型不能为空", trigger: "blur"}],
    sex: [{required: true, message: "请选择性别", trigger: "change"}],
    cardType: [{required: true, message: "请选择证件类型", trigger: "change"}],
    cardNo: [{required: true, message: "证件号不能为空", trigger: "blur"}],
    email: [{type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]}],
    phonenumber: [{required: true,pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"}],
  }
});

const { queryParams, form, rules } = toRefs(data);



// watch(
//     // 监听deptId
//     ()=>form.value.deptId,
//     val=>{
//       console.log("dddddddd"+val)
//       if(val==null || val=='' || val == 'undefined'){
//         // proxy.$modal.msgWarning("先选择所属部门");
//       }else{
//         // form.value.postIds = null;
//         listPost({deptId:val}).then(response => {
//           postOptions.value = response.rows;
//         });
//       }
//     },
//     {immediate:true}
// );

function getMsg(data){
  console.log('0000+')
  console.log(data)

  let val = data.id

  if(val==null || val=='' || val == 'undefined'){
    // proxy.$modal.msgWarning("先选择所属部门");
  }else{
    form.value.postIds = null;
    listPost({deptId:val}).then(response => {
      postOptions.value = response.rows;
    });
  }

}

function getposts(){
  listPost({status:'0'}).then(response => {
    postList.value = response.rows;
  });
}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

/** 查询人员管理列表 */
function getList() {
  loading.value = true;
  listStaff(queryParams.value).then(response => {
    staffList.value = response.rows;
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
    staffId: null,
    deptId: null,
    staffName: null,
    staffType: null,
    sex: null,
    birthday: null,
    email: null,
    phonenumber: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
		cardType: null,
		cardNo: null,
		jobDescription: null,
		joinedDate: null,
		postIds: null
  };
  postOptions.value = []
  proxy.resetForm("staffRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  // let postvalue = []
  // queryParams.value.postIdss = ''
  // if (postIdList.value.length>0){
  //   postIdList.value.forEach((item, index) => {
  //     postvalue.push(parseInt(item))
  //   });
  //   queryParams.value.postIdss = postvalue.join(',');
  // }


  let newvalue = []
  queryParams.deptIdss = ''
  if (choosedValue.value.length>0){
    choosedValue.value.forEach((item, index) => {
      newvalue.push(parseInt(item))
    });
    queryParams.value.deptIdss = newvalue.join(',');
  }
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.staffId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  /*getStaff().then(response => {
    postOptions.value = response.posts;
    open.value = true;
    title.value = "添加人员管理";
  });*/
  open.value = true;
  title.value = "添加人员管理";
}

//部门修改触发事件
function postchange(){
  console.log("45455"+form.value.postIds)
  if(form.value.deptId==null || form.value.deptId==''){
    proxy.$modal.msgWarning("先选择所属部门");
  }
  // else{
  //   form.value.postIds = null;
  //   listPost({deptId:form.value.deptId}).then(response => {
  //     postOptions.value = response.rows;
  //   });
  // }
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const staffId = row.staffId || ids.value
  getStaff(staffId).then(response => {
    form.value = response.data;
    //postOptions.value = response.posts;
    listPost({deptId:form.value.deptId}).then(res => {
      postOptions.value = res.rows;
      form.value.postIds = response.postIds;
    });
    open.value = true;
    title.value = "修改人员管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["staffRef"].validate(valid => {
    if (valid) {
      if (form.value.staffId != null) {
        updateStaff(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStaff(form.value).then(response => {
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
  const staffIds = row.staffId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delStaff(staffIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
    proxy.$modal.msgError("人员信息被用或系统异常，删除失败");
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/staff/export', {
    ...queryParams.value
  }, `staff_${new Date().getTime()}.xlsx`)
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("system/staff/importTemplate", {}, `staff_template_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};



function handleNodeClick(node, checked) {


  console.log()

  // if (valueName.value.length > 0){
  if (checked) {
    // if (node.children == null || node.children == undefined) {
      let num = 0;
      valueName.value.forEach((item) => {
        item == node['label'] ? num++ : num;
      });
      if (num == 0) {
        valueName.value.push(node['label']);
        choosedValue.value.push(node['id']);
        choosedValue.value=[...new Set(choosedValue.value)]
        valueName.value=[...new Set(valueName.value)]
      }
    // }
  } else {
    // if (node.children == null || node.children == undefined) {
      valueName.value.map((item, index) => {
        if (node.label == item) {
          valueName.value.splice(index, 1);
        }
      });
      choosedValue.value.map((item,index)=>{
        if (node.id == item) {
          choosedValue.value.splice(index, 1);
        }
      })
    // }
  }
};
// 删除单个标签
function changeValue(val) {
  const a = findItemByName(deptOptions.value, val);
  console.log(a)
  choosedValue.value.forEach((item, index) => {
    if (item == a.id) {
      choosedValue.value.splice(index, 1);
    }
  });
  let newvalue = []
  if (choosedValue.value.length>0){
    choosedValue.value.forEach((item, index) => {
      newvalue.push(parseInt(item))
    });
  }
  console.log(newvalue)
  deptRef.value.setCheckedKeys(newvalue);
  // deptRef.value.setCheckedKeys([parseInt(332),333]);
};
// 递归找到符合的元素
function findItemByName(items, targetName) {

  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];
    if (currentItem.label === targetName) {
      return currentItem;
    }

    if (currentItem.children) {
      const foundItem = findItemByName(
          currentItem.children,
          targetName
      );
      if (foundItem) {
        return foundItem;
      }
    }
  }
};
// 清空所有标签
function clearHandle() {
  this.valueName = [];
  this.mychecked=false
  this.allchecked=false;
  this.choosedValue=[]
  this.clearSelected();
};
function clearSelected() {
  this.$refs.tree.setCheckedKeys([]);
};




getTreeselect();
getList();
getposts();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
