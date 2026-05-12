<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="计划编码" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入计划编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入计划名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-date-picker clearable
          v-model="queryParams.year"
          type="year"
          value-format="YYYY"
          placeholder="请选择年度">
        </el-date-picker>
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
          v-hasPermi="['safework:onlinePlan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:onlinePlan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:onlinePlan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:onlinePlan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="onlinePlanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="计划编码" align="center" prop="planCode" />
      <el-table-column label="计划名称" align="center" prop="planName" />
      <el-table-column label="年度" align="center" prop="year" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.year, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="季度" align="center" prop="quarter" />
      <el-table-column label="适用部门" align="center" prop="department" >
		<template #default="scope">
          <template v-for="(arr,index) in scope.row.department" :key="arr">
            <template v-for="dept in childDepts" :key="dept.deptId">
              <span v-if="Number(arr) === dept.deptId">{{dept.deptName}}</span>
              <span v-if="Number(arr) === dept.deptId && index<scope.row.department.length-1">,</span>
            </template>
          </template>
        </template>
	  </el-table-column>	
      <el-table-column label="培训课程" align="center" prop="trainingCourse" />
      <el-table-column label="制定日期" align="center" prop="planDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计实施日期" align="center" prop="expectedCompletionDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expectedCompletionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划人" align="center" prop="plannerId" />
      <el-table-column label="计划人部门" align="center" prop="plannerDepartmentId" />
      <el-table-column label="计划内容" align="center" prop="planContent" />
      <el-table-column label="培训讲师" align="center" prop="trainer" />
      <el-table-column label="培训单位" align="center" prop="trainingOrganization" />
      <el-table-column label="要求完成日期" align="center" prop="completionDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.completionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createdBy" />
      <el-table-column label="更新人" align="center" prop="updatedBy" />
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
            v-hasPermi="['safework:onlinePlan:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:onlinePlan:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加题目弹出 -->
		<div class="addtimutanchu">
			<el-dialog
				v-model="dialogAddtimu"
				title="选择培训课程"
				width="60%"
			>
				<div class="search">
					<el-row :gutter="15">
						<el-col :span="7">
							<el-form-item label="分类">
								<el-select v-model="dialogQueryParams.category" clearable>
									<el-option
										v-for="item in categoryList"
										:key="item.id"
										:label="item.name"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="级别">
								<el-select v-model="dialogQueryParams.level" placeholder="请选择所属级别" clearable>
                  <el-option
                      v-for="dict in courseLevel"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                  ></el-option>
                </el-select>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="课程名称">
								<el-input placeholder="请输入题目名称" v-model="dialogQueryParams.courseName" clearable/>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-button type="primary" @click="popSearch">查询</el-button>
						</el-col>
					</el-row>
					<el-table
						ref="multipleTableRef"
						:data="courseTableData"
						style="width: 100%"
						@selection-change="courseChoose"
					>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="所属分类" align="center" prop="category" />
          <el-table-column label="课程编码" align="center" prop="courseCode" />
          <el-table-column label="课程名称" align="center" prop="courseName" />
          <el-table-column label="所属级别" align="center" prop="level" >
            <template #default="scope">
              <dict-tag :options="courseLevel" :value="scope.row.level"/>
            </template>
          </el-table-column>
          <el-table-column label="适用对象" align="center" prop="targetAudience" />
          <el-table-column label="关键字" align="center" prop="keywords" />
          <el-table-column label="素材类型" align="center" prop="materials" />
          <el-table-column label="创建时间" align="center" prop="createdTime" />
					</el-table>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogAddtimu = false">取消</el-button>
						<el-button type="primary" @click="addtimuConfirm">
							确定
						</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改线上培训计划对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="onlinePlanRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="计划编码" prop="planCode">
          <el-input v-model="form.planCode" placeholder="请输入计划编码" />
        </el-form-item>
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="年度" prop="year">
          <el-date-picker clearable
            v-model="form.year"
            type="year"
            value-format="YYYY"
            placeholder="请选择年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="季度" prop="quarter">
          <el-select v-model="form.quarter" placeholder="请选择季度">
            <el-option
                v-for="dict in quarters"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="department">
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-tree
				class="tree-border"
				:data="deptOptions"
				show-checkbox
				ref="deptRef"
				node-key="id"
				empty-text="加载中..."
				:props="{ label: 'label', children: 'children' }"
			></el-tree>
        </el-form-item>
        <el-form-item label="培训课程" prop="trainingCourse">
          <el-button type="button" @click="addtimu">添加培训课程</el-button>
        </el-form-item>
        <el-form-item >
          <div class="timutable">
            <el-table :data="courseData" border style="width: 100%">
              <el-table-column type="index" width="50" />
              <el-table-column label="课程级别" width="150">
                <template #default="scope">
                  <dict-tag :options="courseLevel" :value="scope.row.level"/>
                </template>
              </el-table-column>
              <el-table-column label="课程名称" >
                <template #default="scope">
                  {{ scope.row.courseName }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <div class="timuhandle">
                    <el-icon @click="timuDelete(scope.$index, scope.row)" style="color: red;"><Delete /></el-icon>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="制定日期" prop="planDate">
          <el-date-picker clearable
            v-model="form.planDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择制定日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计实施日期" prop="expectedCompletionDate">
          <el-date-picker clearable
            v-model="form.expectedCompletionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择预计实施日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划内容">
					<el-input
						v-model="form.planContent"
						:rows="2"
						type="textarea"
					/>
          <!-- <textarea v-model="form.planContent" :min-height="192"></textarea> -->
        </el-form-item>
        <el-form-item label="培训讲师" prop="trainer">
          <el-input v-model="form.trainer" placeholder="请输入培训讲师" />
        </el-form-item>
        <el-form-item label="培训单位" prop="trainingOrganization">
          <el-input v-model="form.trainingOrganization" placeholder="请输入培训单位" />
        </el-form-item>
        <el-form-item label="要求完成日期" prop="completionDate">
          <el-date-picker clearable
            v-model="form.completionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择要求完成日期">
          </el-date-picker>
        </el-form-item>
				<el-form-item label="培训人员" >
					<el-radio-group v-model="peixunrenyuan" @change="handleChange">
						<el-radio label="1">指定人员培训</el-radio>
						<el-radio label="2">指定岗位培训</el-radio>
						<el-radio label="3">指定部门培训</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" >
					<div v-if="peixunrenyuan == '1'">
						<el-button type="primary" @click="addpxryClick">添加培训人员</el-button>
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
						<el-dialog
						    v-model="addpxRenyuan"
						    title="添加培训人员"
						    width="90%"
						  >
							<el-row :gutter="15">
								<el-col :span="12">
									<el-form label-width="50px">
										<el-row :gutter="10">
											<el-col :span="7">
												<el-form-item label="姓名">
													<el-input placeholder="请输入员工姓名" v-model="staffQueryParams.staffName"/>
												</el-form-item>
											</el-col>
											<el-col :span="7">
												<el-form-item label="部门">
													<el-input placeholder="请输入员工部门" />
												</el-form-item>
											</el-col>
											<el-col :span="7">
												<el-form-item label="岗位">
													<el-input placeholder="请输入员工岗位" />
												</el-form-item>
											</el-col>
											<el-col :span="3">
												<el-button type="primary" @click="getUserList">查询</el-button>
											</el-col>
										</el-row>
									</el-form>
									<el-table
										ref="pxryTable"
										:data="userOptions"
										style="width: 100%;margin: 15px 0 0;"
										@selection-change="pxrySelectionChange"
										height="400"
									>
										<el-table-column type="selection" width="55" />
										<el-table-column property="staffName" label="姓名" width="120" />
										<el-table-column property="staffNo" label="工号" />
										<el-table-column property="deptName" label="部门" />
										<el-table-column property="postNames" label="岗位" />
									</el-table>
								</el-col>
								<el-col :span="12">
									<el-form label-width="50px">
										<el-row :gutter="10">
											<el-col :span="8">
												<el-form-item label="姓名">
													<el-input placeholder="请输入员工姓名" />
												</el-form-item>
											</el-col>
											<el-col :span="16">
												<el-button type="primary">查询</el-button>
												<el-button type="primary" @click="pxrySelectionDelete">清除</el-button>
											</el-col>
										</el-row>
									</el-form>
									<el-table
										:data="pxygChoosedData"
										style="width: 100%;margin: 15px 0 0;"
										height="400"
									>
										<el-table-column property="staffName" label="姓名" width="120" />
										<el-table-column property="staffNo" label="工号" />
										<el-table-column property="deptName" label="部门" />
										<el-table-column property="postIds" label="岗位" />
										<el-table-column label="操作"> 
											<template #default="scope">
												<div @click="pxygDelete(scope.$index, scope.row)" style="color: red;cursor: pointer;">
													移除
												</div>
											</template>
										</el-table-column>
									</el-table>
								</el-col>
							</el-row>
							<template #footer>
								<span class="dialog-footer">
									<el-button @click="addpxRenyuan = false,staffQueryParams.staffName = null">关闭</el-button>
									<el-button type="primary" @click="addpxRenyuan = false,staffQueryParams.staffName = null">
										保存
									</el-button>
								</span>
							</template>
						</el-dialog>
					</div>
					<div v-if="peixunrenyuan == '2'">
						<el-button type="primary" @click="addpxgwClick">添加培训岗位</el-button>
						<div class="tags">
							<el-tag
							    v-for="(tag, index) in pxgwChoosedData"
							    :key="tag.postId"
							    closable
									@close="pxgwClose(tag, index)"
							  >
							    {{ tag.postName }}
							  </el-tag>
						</div>
						<el-dialog
						    v-model="addpxGangwei"
						    title="添加培训岗位"
						    width="90%"
						  >
							<el-row :gutter="15">
								<el-col :span="12">
									<el-form label-width="80px">
										<el-row :gutter="10">
											<el-col :span="8">
												<el-form-item label="岗位名称">
													<el-input placeholder="请输入岗位名称" v-model="postQueryParams.postName"/>
												</el-form-item>
											</el-col>
											<el-col :span="16">
												<el-button type="primary" @click="getPost">查询</el-button>
											</el-col>
										</el-row>
									</el-form>
									<el-table
										ref="pxgwTable"
										:data="postOption"
										style="width: 100%;margin: 15px 0 0;"
										@selection-change="pxgwSelectionChange"
										height="400"
									>
										<el-table-column type="selection" width="55" />
										<el-table-column property="postName" label="岗位" />
									</el-table>
								</el-col>
								<el-col :span="12">
									<el-form label-width="80px">
										<el-row :gutter="10">
											<el-col :span="8">
												<el-form-item label="岗位名称">
													<el-input placeholder="请输入岗位名称" v-model="postName"/>
												</el-form-item>
											</el-col>
											<el-col :span="16">
												<el-button type="primary">查询</el-button>
												<el-button type="primary" @click="pxgwSelectionDelete">清除</el-button>
											</el-col>
										</el-row>
									</el-form>
									<el-table
										:data="pxgwChoosedData"
										style="width: 100%;margin: 15px 0 0;"
										height="400"
									>
										<el-table-column property="postName" label="岗位" />
										<el-table-column label="操作"> 
											<template #default="scope">
												<div @click="pxgwDelete(scope.$index, scope.row)" style="color: red;cursor: pointer;">
													移除
												</div>
											</template>
										</el-table-column>
									</el-table>
								</el-col>
							</el-row>
							<template #footer>
								<span class="dialog-footer">
									<el-button @click="addpxGangwei = false,postQueryParams.postName = null">关闭</el-button>
									<el-button type="primary" @click="addpxGangwei = false,postQueryParams.postName = null">
										保存
									</el-button>
								</span>
							</template>
						</el-dialog>
					</div>
					<div v-if="peixunrenyuan == '3'">
						<el-button type="primary" @click="addpxbmClick">添加培训部门</el-button>
						<div class="tags">
							<el-tag
							    v-for="(tag, index) in pxbmChoosedData"
							    :key="tag.deptId"
							    closable
									@close="pxbmClose(tag, index)"
							  >
							    {{ tag.deptName }}
							  </el-tag>
						</div>
						<el-dialog
						    v-model="addpxBumen"
						    title="添加培训部门"
						    width="90%"
						  >
							<el-row :gutter="15">
								<el-col :span="12">
									<el-form label-width="80px">
										<el-row :gutter="10">
											<el-col :span="8">
												<el-form-item label="部门名称">
													<el-input placeholder="请输入部门名称" v-model="deptQueryParams.deptName"/>
												</el-form-item>
											</el-col>
											<el-col :span="16">
												<el-button type="primary" @click="getDeptsByParentId">查询</el-button>
											</el-col>
										</el-row>
									</el-form>
									<el-table
										ref="pxbmTable"
										:data="childDepts"
										style="width: 100%;margin: 15px 0 0;"
										@selection-change="pxbmSelectionChange"
										height="400"
									>
										<el-table-column type="selection" width="55" />
										<el-table-column property="deptName" label="部门" />
									</el-table>
								</el-col>
								<el-col :span="12">
									<el-form label-width="80px">
										<el-row :gutter="10">
											<el-col :span="8">
												<el-form-item label="部门名称">
													<el-input placeholder="请输入部门名称" />
												</el-form-item>
											</el-col>
											<el-col :span="16">
												<el-button type="primary">查询</el-button>
												<el-button type="primary" @click="pxbmSelectionDelete">清除</el-button>
											</el-col>
										</el-row>
									</el-form>
									<el-table
										:data="pxbmChoosedData"
										style="width: 100%;margin: 15px 0 0;"
										height="400"
									>
										<el-table-column property="deptName" label="岗位" />
										<el-table-column label="操作"> 
											<template #default="scope">
												<div @click="pxbmDelete(scope.$index, scope.row)" style="color: red;cursor: pointer;">
													移除
												</div>
											</template>
										</el-table-column>
									</el-table>
								</el-col>
							</el-row>
							<template #footer>
								<span class="dialog-footer">
									<el-button @click="addpxBumen = false,deptQueryParams.deptName = null">关闭</el-button>
									<el-button type="primary" @click="addpxBumen = false,deptQueryParams.deptName = null">
										保存
									</el-button>
								</span>
							</template>
						</el-dialog>
					</div>
				</el-form-item>
				
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in status"
              :key="dict.value"
              :label="parseInt(dict.value)"
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

<script setup name="OnlinePlan">
import { listOnlinePlan, getOnlinePlan, delOnlinePlan, addOnlinePlan, updateOnlinePlan } from "@/api/safework/onlinePlan";
import { listOnlineCourse,getCourseByIds } from "@/api/safework/onlineCourse";
import {treeselect} from "../../../api/system/dept";
import {selectChildrenDeptByDept} from '@/api/system/dept';
import { listCategory } from "@/api/safework/category";
import { listUser } from "@/api/system/user";
import { listStaff } from "@/api/system/staff";
import {listPost} from "@/api/system/post";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status } = proxy.useDict('status');
const { courseLevel } = proxy.useDict('courseLevel');

const onlinePlanList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const deptRef = ref(null); 
const onlineCourseList = ref([]);
const dialogAddtimu = ref(false);
const courseTableData = ref([]);
const courseArr = ref([]);
const courseData = ref([]);
const childDepts = ref([]);
const userOptions = ref([]);
const postOption = ref(undefined);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    planCode: null,
    planName: null,
    year: null,
    quarter: null,
    department: null,
    trainingCourse: null,
    planDate: null,
    expectedCompletionDate: null,
    plannerId: null,
    plannerDepartmentId: null,
    planContent: null,
    trainer: null,
    trainingOrganization: null,
    completionDate: null,
    createdBy: null,
    updatedBy: null,
    status: null,
  },
  dialogQueryParams: {
    pageNum: 1,
    pageSize: 10,
    status: null,
    category: null,
    level: null,
    courseName:null,
    targetAudience:'0'
  },
  staffQueryParams: {
    pageNum: 1,
    pageSize: 100,
	  staffName:null,
    userName:'plan'
  },
  postQueryParams: {
    pageNum: 1,
    pageSize: 10,
	  postName:null,
  },
  deptQueryParams: {
    pageNum: 1,
    pageSize: 10,
	  deptName:'',
  },
  rules: {
  },
  quarters:[
    {id:1,name:'第一季度'},
    {id:2,name:'第二季度'},
    {id:3,name:'第三季度'},
    {id:4,name:'第四季度'}
  ],
  categoryList:[],
});

const { queryParams, form, rules,quarters,categoryList,dialogQueryParams,staffQueryParams,postQueryParams,deptQueryParams } = toRefs(data);


function handleChange(val){
  console.log(val);
  // 1 yg 2 gw 3 bm
  if(val==1){
    pxgwChoosedData.value = [];
    // pxygChoosedData.value = [];
    pxbmChoosedData.value = [];
  }
  if(val==2){
    // pxgwChoosedData.value = [];
    pxygChoosedData.value = [];
    pxbmChoosedData.value = [];
  }
  if(val==3){
    pxgwChoosedData.value = [];
    pxygChoosedData.value = [];
    // pxbmChoosedData.value = [];
  }
}

/** 查询岗位列表 */
function getPost() {
  listPost(postQueryParams.value).then(response => {
    postOption.value = response.rows;
  });
}
/** 查询培训人员列表 **/
function getUserList(){
	listStaff(staffQueryParams.value).then(response => {
    userOptions.value = response.rows;
  });
}
function timuDelete(index, row) {
	courseData.value.splice(index, 1)
}
// 查询登录账套下部门列表
function getDeptsByParentId(){
	selectChildrenDeptByDept(deptQueryParams.value).then(response =>{
    childDepts.value = response.data;
  })
}
function courseChoose(val){
  courseArr.value = val;
}
function popSearch(){
  getOnlineCourseList();
}
/** 查询教育培训所属分类字典列表 */
function getCategoryList() {
  listCategory({state: 0}).then(response => {
    categoryList.value = response.rows;
  });
}


function addtimuConfirm() {
	dialogAddtimu.value = false;
  for(var i=0;i<courseArr.value.length;i++){
		courseData.value.push(courseArr.value[i])
	}
  
}

function addtimu() {
	dialogAddtimu.value = true;
	proxy.$refs["multipleTableRef"].clearSelection();
}

/** 查询培训课程列表 */
function getOnlineCourseList() {
  listOnlineCourse(dialogQueryParams.value).then(response => {
    courseTableData.value = response.rows;
  });
}
/** 查询线上培训计划列表 */
function getList() {
  loading.value = true;
  listOnlinePlan(queryParams.value).then(response => {
	if(response.total>0){
      for(let row of response.rows){
        if(row.department != ""){
          row.department = row.department.split(",");
        }
      }
    }
    onlinePlanList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
}

/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

/** 查询部门树结构 */
function getDeptTreeselect() {
  return treeselect().then(response => {
    deptOptions.value = response.data;
    return response;
  });
}
// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
	pxbmChoosedData.value = null,
	pxygChoosedData.value = null,
	pxgwChoosedData.value = null,
  form.value = {
    id: null,
    enterpriseCode: null,
    planCode: null,
    planName: null,
    year: null,
    quarter: null,
    department: null,
    trainingCourse: null,
    planDate: null,
    expectedCompletionDate: null,
    plannerId: null,
    plannerDepartmentId: null,
    planContent: null,
    trainer: null,
    trainingOrganization: null,
    completionDate: null,
    createdBy: null,
    createTime: null,
    updatedBy: null,
    updateTime: null,
    status: 0,
  };
  proxy.resetForm("onlinePlanRef");
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
  title.value = "添加线上培训计划";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getOnlinePlan(id).then(response => {

    var courseId = response.data.trainingCourse.split(",");
    getCourseByIdsFun(courseId);
    form.value = response.data;
    pxbmChoosedData.value = form.value.sysDepts;
    pxygChoosedData.value = form.value.sysStaffs;
    pxgwChoosedData.value = form.value.sysPostows;
    open.value = true;
    title.value = "修改线上培训计划";
    nextTick(() => {
			let checkedKeys = form.value.department.split(',');
			checkedKeys.forEach((v) => {
				nextTick(() => {
					deptRef.value.setChecked(v, true, false);
				});
			});
    });
    
  });
}

function getCourseByIdsFun(ids){
  getCourseByIds(ids).then(response => {
    courseData.value = response.data
  })

}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["onlinePlanRef"].validate(valid => {
    if (valid) {
      form.value.department = getDeptAllCheckedKeys();
	  form.value.department = form.value.department.toString();
	  form.value.sysDepts = pxbmChoosedData.value;
	  form.value.sysStaffs = pxygChoosedData.value;
	  form.value.sysPostows = pxgwChoosedData.value;
    let courses = "";
    courseData.value.forEach(item =>{
      courses += item.id+','
    })

    form.value.trainingCourse = courses;
    console.log("form",form.value);
      if (form.value.id != null) {
        updateOnlinePlan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOnlinePlan(form.value).then(response => {
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
    return delOnlinePlan(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/onlinePlan/export', {
    ...queryParams.value
  }, `onlinePlan_${new Date().getTime()}.xlsx`)
}

// 培训人员
const peixunrenyuan = ref('1')
const addpxRenyuan = ref(false)
const pxygChoosedData = ref([]);
const pxryTags = ref(false);

function addpxryClick() {
	addpxRenyuan.value = true;
	proxy.$nextTick(() => {
		var pxryZancun = pxygChoosedData.value
		proxy.$refs["pxryTable"].clearSelection();
		pxryZancun.forEach((item) => {
			userOptions.value.forEach((row) => {
				if(item.staffId === row.staffId){
					proxy.$refs["pxryTable"].toggleRowSelection(row, true)
				}
			})
		})
	})
}
function pxrySelectionChange(val) {
	pxygChoosedData.value = [];
	for(var i=0;i<val.length;i++){
		pxygChoosedData.value.push(val[i])
	}
}
function pxrySelectionDelete() {
	pxygChoosedData.value = [];
	proxy.$refs["pxryTable"].clearSelection();
}
function pxygDelete(index, row) {
	pxygChoosedData.value.splice(index, 1)
	proxy.$refs["pxryTable"].toggleRowSelection(row, false)
}
function pxryClose(tag, index) {
	pxygChoosedData.value.splice(index, 1)
}

const addpxGangwei = ref(false)
const pxgwChoosedData = ref([]);
const pxgwTags = ref(false);

function addpxgwClick() {
	addpxGangwei.value = true;
	proxy.$nextTick(() => {
		var pxgwZancun = pxgwChoosedData.value
		proxy.$refs["pxgwTable"].clearSelection();
		pxgwZancun.forEach((item) => {
			postOption.value.forEach((row) => {
				if(item.postId === row.postId){
					proxy.$refs["pxgwTable"].toggleRowSelection(row, true)
				}
			})
		})
	})
}
function pxgwSelectionChange(val) {
	//console.log(val)
	pxgwChoosedData.value = [];
	for(var i=0;i<val.length;i++){
		pxgwChoosedData.value.push(val[i])
	}
}
function pxgwSelectionDelete() {
	pxgwChoosedData.value = [];
	proxy.$refs["pxgwTable"].clearSelection();
}
function pxgwDelete(index, row) {
	pxgwChoosedData.value.splice(index, 1)
	proxy.$refs["pxgwTable"].toggleRowSelection(row, undefined)
}
function pxgwClose(tag, index) {
	pxgwChoosedData.value.splice(index, 1)
}

const addpxBumen = ref(false)
const pxbmChoosedData = ref([]);
const pxbmTags = ref(false);

function addpxbmClick() {
	addpxBumen.value = true;
	proxy.$nextTick(() => {
		var pxbmZancun = pxbmChoosedData.value
		proxy.$refs["pxbmTable"].clearSelection();
		pxbmZancun.forEach((item) => {
			childDepts.value.forEach((row) => {
				if(item.deptId === row.deptId){
					proxy.$refs["pxbmTable"].toggleRowSelection(row, true)
				}
			})
		})
	})
}
function pxbmSelectionChange(val) {
	//console.log(val)
	pxbmChoosedData.value = [];
	for(var i=0;i<val.length;i++){
		pxbmChoosedData.value.push(val[i])
	}
}
function pxbmSelectionDelete() {
	pxbmChoosedData.value = [];
	proxy.$refs["pxbmTable"].clearSelection();
}
function pxbmDelete(index, row) {
	pxbmChoosedData.value.splice(index, 1)
	proxy.$refs["pxbmTable"].toggleRowSelection(row, undefined)
}
function pxbmClose(tag, index) {
	pxbmChoosedData.value.splice(index, 1)
}

getList();
getDeptTreeselect();
getOnlineCourseList();
getCategoryList();
getDeptsByParentId();
getUserList();
getPost();
</script>
<style scoped lang="scss">
	.timutable{
		width: 100%;
		
	}
	.tags{
		.el-tag{
			margin: 10px 10px 0 0
		}
	}
</style>
