<template>
  <div class="power">
    <div class="power-con">
      <el-card :body-style="{ padding: '10px' }">
        <el-row :gutter="15">
          <el-col :span="24">
            <!--区域设备导航-->
            <el-row :gutter="30">
              <el-col :span="5">
                <div class="qysb">
<!--                  <el-row class="qysb-head">-->
<!--                    <el-col :span="20"><div class="title">区域设备导航</div></el-col>-->
<!--                    <el-col :span="4">-->
<!--                      <div class="ico text-right">-->
<!--                        <img src="../../../assets/images/nav-ico.png" />-->
<!--                      </div>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

                  <div class="tree">
                    <h4>{{user.secondDeptName != null ? user.secondDeptName : user.dept.deptName}}</h4>
                    <el-tree :data="areaOptions" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                  </div>

                </div>
              </el-col>
              <el-col :span="19" style="border-left: 1px solid #e7e8ed;">
								<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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

								<el-row :gutter="10" class="mb8 toolsline">
									<el-col :span="1.5">
										<el-button
											type="primary"
											plain
											icon="Plus"
											@click="handleAdd"
											v-hasPermi="['energy:diagram:add']"
										>新增</el-button>
									</el-col>
									<el-col :span="1.5">
										<el-button
											type="success"
											plain
											icon="Edit"
											:disabled="single"
											@click="handleUpdate"
											v-hasPermi="['energy:diagram:edit']"
										>修改</el-button>
									</el-col>
									<el-col :span="1.5">
										<el-button
											type="danger"
											plain
											icon="Delete"
											:disabled="multiple"
											@click="handleDelete"
											v-hasPermi="['energy:diagram:remove']"
										>删除</el-button>
									</el-col>
									<el-col :span="1.5">
										<el-button
											type="warning"
											plain
											icon="Download"
											@click="handleExport"
											v-hasPermi="['energy:diagram:export']"
										>导出</el-button>
									</el-col>
									<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
								</el-row>

								<el-table v-loading="loading" :data="diagramList" @selection-change="handleSelectionChange" style="min-height: calc(100vh - 300px);">
									<el-table-column type="selection" width="55" align="center" />
									<el-table-column label="id" align="center" prop="id" />
									<el-table-column label="区域名称" align="center" prop="areaName" />
									<el-table-column label="配电图" align="center" prop="diagramUrl" >
										<template #default="scope">
											<ImagePreview :src="scope.row.diagramUrl" :width="50" :height="50"></ImagePreview>
										</template>
									</el-table-column>
									<el-table-column label="状态" align="center" prop="status">
										<template #default="scope">
											<dict-tag :options="status" :value="scope.row.status"/>
										</template>
									</el-table-column>
									<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="320" fixed="right">
										<template #default="scope">
											<el-button
												type="text"
												icon="Edit"
												@click="handleUpdate(scope.row)"
												v-hasPermi="['energy:diagram:edit']"
											>修改</el-button>
											<el-button
												type="text"
												icon="Edit"
												@click="handleJxt(scope.row)"
												v-hasPermi="['energy:diagram:list']"
											>配电图</el-button>
											<el-button
												type="text"
												icon="Delete"
												@click="handleDelete(scope.row)"
												v-hasPermi="['energy:diagram:remove']"
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

						<el-dialog :title="title" v-model="open" width="500px" append-to-body>
							<el-form ref="diagramRef" :model="form" :rules="rules" label-width="120px">
								<el-form-item label="区域" prop="electricAreaId">
									<tree-select
											v-model:value="form.electricAreaId"
											:options="areaOptions"
											placeholder="请选择区域"
											:objMap="{ value: 'id', label: 'label', children: 'children' }"
									/>
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
								<el-form-item label="上传图片">
									<ImageUpload
									v-model.value="form.diagramUrl"
									:limit = "1"
									/>
								</el-form-item>
								<el-form-item label="备注" prop="remark">
									<el-input type="textarea" v-model="form.remark"></el-input>
								</el-form-item>
								<el-form-item label="配电图页面地址" prop="svgUrl">
									<el-input type="text" v-model="form.svgUrl"></el-input>
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
      </el-card>
    </div>
  </div>
</template>

<script setup name="Diagram">
import { listDiagram, getDiagram, delDiagram, addDiagram, updateDiagram } from "@/api/energy/diagram";
import { areatreeselect } from "@/api/energy/area";
import {getUserProfile} from "@/api/system/user";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status } = proxy.useDict('status');

const diagramList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const areaOptions = ref(undefined);
const user = ref({dept: {}});
const router = useRouter();

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    electricAreaId: null,
    deptId: null,
    status: null,
    delFlag: '0',
  },
  rules: {
  },
	defaultProps: {
		children: 'children',
		label: 'label'
	},
});

const { queryParams, form, rules, defaultProps } = toRefs(data);

function getUser() {
  getUserProfile().then(response => {
    user.value = response.data;
  });
};

/** 查询区域下拉树结构 */
function getTreeSelect() {
  areatreeselect({status:"0",delFlag:'0'}).then(response => {
    areaOptions.value = response.data;
  });
};

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.electricAreaId = data.id;
  handleQuery();
}

/** 查询电力配电图列表 */
function getList() {
  loading.value = true;
  listDiagram(queryParams.value).then(response => {
    diagramList.value = response.rows;
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
    electricAreaId: null,
    deptId: null,
		diagramUrl: null,
    status: "0",
    delFlag: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
		remark: null,
		svgUrl: null
  };
  proxy.resetForm("diagramRef");
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
  title.value = "添加电力配电图";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getDiagram(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改电力配电图";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["diagramRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDiagram(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDiagram(form.value).then(response => {
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
    return delDiagram(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('energy/diagram/export', {
    ...queryParams.value
  }, `diagram_${new Date().getTime()}.xlsx`)
}

/** 接线图 **/
function handleJxt(row){
	if(row.svgUrl != null && row.svgUrl != ""){
		router.push("/energy/diagram-peidiantu/index/" + row.id);
	}else{
		proxy.$modal.msgWarning("接线图不存在")
	}
}

getUser();
getTreeSelect();
getList();
</script>

<style lang="scss" scoped>

.power{
  padding: 15px;
  .header{
    padding: 0 0 10px;
    border-bottom: 1px solid #f0f0f0;
  }
  .card-tit {
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }
  .freeze-con{
    padding: 15px;
    .button-ico{
      .btn{
        border: 0;
        padding: 0 20px;
        height: 24px;
      }
      .active{
        color: #fff;
        background: #09bec5;
      }
    }
  }
  .freeze-nr{
    .tit{
      line-height: 32px;
      padding-right: 6px;
    }
    .inquirebtn{
      background: #09bec5;
      color: #fff;
      border: none;
    }
  }

  .power-con{
    margin-top: 10px;
    .qysb{
      .qysb-head{
        margin: 10px 0;
        .title{
          color: #333333;
          font-size: 18px;
        }
        .ico{
          margin-top: 4px;
        }
      }
      .tree{
        h4{
          margin: 20px 0 10px;
          color: #09bec5;
          font-weight: bold;
          font-size: 16px;
          border-bottom: 1px solid #e7e8ed;
          padding: 0 0 15px;
        }

      }

    }
  }
  .chart-con{
    height: calc(100vh - 510px);

  }
}
.toolsline{
  height: 30px;
}
</style>

