<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="年份" prop="yeaes">
        <el-select v-model="queryParams.yeaes" placeholder="请选择年份" clearable>
          <el-option
              v-for="item in yeares"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="targetTypeDicId">
        <el-select v-model="queryParams.targetTypeDicId" placeholder="请选择目标责任类型" clearable>
          <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="级别" prop="targetLevelDicId">
        <el-select v-model="queryParams.targetLevelDicId" placeholder="请选择目标责任级别" clearable>
          <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="delFlag">
        <el-select v-model="queryParams.delFlag" placeholder="请选择状态" clearable>
          <el-option label="正常" value="0" />
          <el-option label="禁用" value="1" />
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
          v-hasPermi="['safework:targetDuty:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="targetDutyList">
      <el-table-column label="年份" align="center" prop="yeaes" />
      <el-table-column label="季度" align="center" prop="quarter" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="类型" align="center" prop="targetTypeDicName" />
      <el-table-column label="级别" align="center" prop="targetLevelDicName" />
      <el-table-column label="适用部门" align="center" prop="suitDeptId" >
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.suitDeptIdArray" :key="arr">
            <template v-for="user in depts" :key="user.deptId">
              <span v-if="Number(arr) === user.deptId">{{user.deptName}}</span>
              <span v-if="Number(arr) === user.deptId && index<scope.row.suitDeptIdArray.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="制定人" align="center" prop="formulateUser" />
      <el-table-column label="制定日期" align="center" prop="formulateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.formulateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查日期" align="center" prop="inspectTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.inspectTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际检查日期" align="center" prop="realityInspectTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.realityInspectTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查值" align="center" prop="inspectValue" />
      <el-table-column label="状态" align="center" prop="delFlag">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.delFlag == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">禁用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="120">
        <template #default="scope">
          <el-button
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:targetDuty:edit']"
          >修改</el-button>
          <el-button
              type="text"
              @click="handleLook(scope.row)"
              v-hasPermi="['safework:targetDuty:remove']"
          >查看</el-button>
          <el-button
            v-if="scope.row.status=='1'"
            type="text"
            @click="handleStatus(scope.row.id)"
            v-hasPermi="['safework:targetDuty:remove']"
          >发布</el-button>
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

    <!-- 添加或修改目标责任制定信息对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="targetDutyRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.code" placeholder="请输入编码" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="年份" prop="yeaes">
          <el-select v-model="form.yeaes" placeholder="请选择年份" clearable v-if="form.status=='1'">
            <el-option
                v-for="item in yeares"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
          <el-select v-model="form.yeaes" placeholder="请选择年份" clearable v-if="form.status=='2'" disabled>
            <el-option
                v-for="item in yeares"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="季度" prop="quarter" >
          <el-select v-model="form.quarter" placeholder="请选择季度" v-if="form.status=='1'">
            <el-option label="每年" value="每年" />
            <el-option label="全年" value="全年" />
            <el-option label="下半年" value="下半年" />
            <el-option label="上半年" value="上半年" />
            <el-option label="第一季度" value="第一季度" />
            <el-option label="第二季度" value="第二季度" />
            <el-option label="第三季度" value="第三季度" />
            <el-option label="第四季度" value="第四季度" />
          </el-select>
          <el-select v-model="form.quarter" placeholder="请选择季度" v-if="form.status=='2'" disabled>
            <el-option label="每年" value="每年" />
            <el-option label="全年" value="全年" />
            <el-option label="下半年" value="下半年" />
            <el-option label="上半年" value="上半年" />
            <el-option label="第一季度" value="第一季度" />
            <el-option label="第二季度" value="第二季度" />
            <el-option label="第三季度" value="第三季度" />
            <el-option label="第四季度" value="第四季度" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" v-if="form.status=='1'"/>
          <el-input v-model="form.title" placeholder="请输入标题" v-if="form.status=='2'" disabled/>
        </el-form-item>
        <el-form-item label="类型" prop="targetTypeDicId">
          <el-select v-model="form.targetTypeDicId" placeholder="请选择目标责任类型" clearable v-if="form.status=='2'" disabled>
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
          <el-select v-model="form.targetTypeDicId" placeholder="请选择目标责任类型" clearable v-if="form.status=='1'">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="targetLevelDicId">
          <el-select v-model="form.targetLevelDicId" placeholder="请选择目标责任级别" clearable v-if="form.status=='2'" disabled>
            <el-option
                v-for="item in options1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
          <el-select v-model="form.targetLevelDicId" placeholder="请选择目标责任级别" clearable v-if="form.status=='1'">
            <el-option
                v-for="item in options1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="suitDeptId" v-if="form.status=='2'">
          <el-input v-model="form.depNames" readonly style="width: 50%" disabled/>
        </el-form-item>
        <el-form-item label="适用部门" prop="suitDeptId" v-if="form.status=='1'">
          <el-input v-model="form.depNames" readonly @click="selectdep" style="width: 50%"/>
        </el-form-item>
        <el-form-item label="适用范围" prop="suitRange">
          <el-input v-model="form.suitRange" placeholder="请输入适用范围" type="textarea" v-if="form.status=='1'"/>
          <el-input v-model="form.suitRange" placeholder="请输入适用范围" type="textarea" v-if="form.status=='2'" disabled/>
        </el-form-item>
        <el-form-item label="指标" prop="indexs">
          <el-input v-model="form.indexs" placeholder="请输入指标" type="textarea" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.indexs" placeholder="请输入指标" type="textarea" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="添加考核项目" prop="projectNames" v-if="form.status=='2'" disabled>
          <el-button type="info" disabled>添加考核项目</el-button>
          <div v-for="arr in projectids" class="khxmlist">
						<div class="item">
							<div class="tit">
								<h4>考核项目：{{arr.name}}</h4>
								<el-button disabled class="shanchu">删除</el-button>
							</div>
							<div class="content">{{arr.examineContent}}</div>
							<div class="fenzhi">
								分值：<el-input v-model="arr.score" disabled/>
							</div>
						</div>
            
          </div>
        </el-form-item>
        <el-form-item label="添加考核项目" prop="projectNames" v-if="form.status=='1'">
          <el-button type="primary" @click="selectProject">添加考核项目</el-button>
          <div v-for="arr in projectids" class="khxmlist">
						<div class="item">
							<div class="tit">
								<h4>考核项目：{{arr.name}}</h4>
								<el-button @click="calculate(arr.id)" class="shanchu">删除</el-button>
							</div>
							<div class="content">{{arr.examineContent}}</div>
							<div class="fenzhi">
								分值：<el-input v-model="arr.score" @blur="calculate(-1)"/>
							</div>
						</div>

          </div>
        </el-form-item>
        <el-form-item label="总分值" prop="totalScore">
          <el-input v-model="form.totalScore" readonly style="width: 50%" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.totalScore" readonly style="width: 50%" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="合格分值" prop="qualifiedScore">
          <el-input v-model="form.qualifiedScore" placeholder="请输入合格分值" type="number" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.qualifiedScore" placeholder="请输入合格分值" type="number" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="制定人" prop="formulateUser">
          <el-input v-model="form.formulateUser" placeholder="请输入制定人" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.formulateUser" placeholder="请输入制定人" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="制定人部门" prop="formulateDept">
          <el-input v-model="form.formulateDept" placeholder="请输入制定人部门" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.formulateDept" placeholder="请输入制定人部门" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="制定日期" prop="formulateTime">
          <el-date-picker clearable
            v-model="form.formulateTime"
            v-if="form.status=='2'" disabled
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择制定日期">
          </el-date-picker>
          <el-date-picker clearable
            v-model="form.formulateTime"
            v-if="form.status=='1'"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择制定日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查日期" prop="inspectTime">
          <el-date-picker clearable
            v-model="form.inspectTime"
            v-if="form.status=='2'" disabled
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择检查日期">
          </el-date-picker>
          <el-date-picker clearable
            v-model="form.inspectTime"
            v-if="form.status=='1'"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择检查日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核人" prop="checkUser">
          <el-input v-model="form.checkUser" placeholder="请输入审核人" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.checkUser" placeholder="请输入审核人" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="批准人" prop="ratifyUser">
          <el-input v-model="form.ratifyUser" placeholder="请输入批准人" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.ratifyUser" placeholder="请输入批准人" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="实际检查日期" prop="realityInspectTime">
          <el-date-picker clearable
            v-model="form.realityInspectTime"
            v-if="form.status=='2'" disabled
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择实际检查日期">
          </el-date-picker>
          <el-date-picker clearable
            v-model="form.realityInspectTime"
            v-if="form.status=='1'"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择实际检查日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查值" prop="inspectValue">
          <el-input v-model="form.inspectValue" placeholder="请输入检查值" type="number" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.inspectValue" placeholder="请输入检查值" type="number" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="检查情况" prop="inspectSituation">
          <el-input v-model="form.inspectSituation" placeholder="请输入检查情况" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.inspectSituation" placeholder="请输入检查情况" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="备注" prop="rem">
          <el-input v-model="form.rem" placeholder="请输入备注" v-if="form.status=='2'" disabled/>
          <el-input v-model="form.rem" placeholder="请输入备注" v-if="form.status=='1'"/>
        </el-form-item>
        <el-form-item label="状态">
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
    <!-- 查看 -->
    <el-dialog title="目标责任制定信息" v-model="lookopen" width="700px" append-to-body>
      <el-form ref="targetDutyRef" :model="form" :rules="rules" label-width="150px" disabled>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="年份" prop="yeaes">
          <el-select v-model="form.yeaes" placeholder="请选择年份" clearable>
            <el-option
                v-for="item in yeares"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="季度" prop="quarter">
          <el-select v-model="form.quarter" placeholder="请选择季度">
            <el-option label="每年" value="每年" />
            <el-option label="全年" value="全年" />
            <el-option label="下半年" value="下半年" />
            <el-option label="上半年" value="上半年" />
            <el-option label="第一季度" value="第一季度" />
            <el-option label="第二季度" value="第二季度" />
            <el-option label="第三季度" value="第三季度" />
            <el-option label="第四季度" value="第四季度" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="类型" prop="targetTypeDicId">
          <el-select v-model="form.targetTypeDicId" placeholder="请选择目标责任类型" clearable>
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="targetLevelDicId">
          <el-select v-model="form.targetLevelDicId" placeholder="请选择目标责任级别" clearable>
            <el-option
                v-for="item in options1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="suitDeptId">
          <el-input v-model="form.depNames" readonly @click="selectdep" style="width: 50%"/>
        </el-form-item>
        <el-form-item label="适用范围" prop="suitRange">
          <el-input v-model="form.suitRange" placeholder="请输入适用范围" type="textarea"/>
        </el-form-item>
        <el-form-item label="指标" prop="indexs">
          <el-input v-model="form.indexs" placeholder="请输入指标" type="textarea"/>
        </el-form-item>
        <el-form-item label="添加考核项目" prop="projectNames">
          <el-button type="primary" @click="selectProject">添加考核项目</el-button>
          <div v-for="arr in projectids" class="khxmlist">
            <div class="item">
              <div class="tit">
                <h4>考核项目：{{arr.name}}</h4>
                <el-button @click="calculate(arr.id)" class="shanchu">删除</el-button>
              </div>
              <div class="content">{{arr.examineContent}}</div>
              <div class="fenzhi">
                分值：<el-input v-model="arr.score" @blur="calculate(-1)"/>
              </div>
            </div>

          </div>
        </el-form-item>
        <el-form-item label="总分值" prop="totalScore">
          <el-input v-model="form.totalScore" readonly style="width: 50%"/>
        </el-form-item>
        <el-form-item label="合格分值" prop="qualifiedScore">
          <el-input v-model="form.qualifiedScore" placeholder="请输入合格分值" type="number"/>
        </el-form-item>
        <el-form-item label="制定人" prop="formulateUser">
          <el-input v-model="form.formulateUser" placeholder="请输入制定人" />
        </el-form-item>
        <el-form-item label="制定人部门" prop="formulateDept">
          <el-input v-model="form.formulateDept" placeholder="请输入制定人部门" />
        </el-form-item>
        <el-form-item label="制定日期" prop="formulateTime">
          <el-date-picker clearable
                          v-model="form.formulateTime"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择制定日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查日期" prop="inspectTime">
          <el-date-picker clearable
                          v-model="form.inspectTime"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择检查日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核人" prop="checkUser">
          <el-input v-model="form.checkUser" placeholder="请输入审核人" />
        </el-form-item>
        <el-form-item label="批准人" prop="ratifyUser">
          <el-input v-model="form.ratifyUser" placeholder="请输入批准人" />
        </el-form-item>
        <el-form-item label="实际检查日期" prop="realityInspectTime">
          <el-date-picker clearable
          v-model="form.realityInspectTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择实际检查日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查值" prop="inspectValue">
          <el-input v-model="form.inspectValue" placeholder="请输入检查值" type="number"/>
        </el-form-item>
        <el-form-item label="检查情况" prop="inspectSituation">
          <el-input v-model="form.inspectSituation" placeholder="请输入检查情况" />
        </el-form-item>
        <el-form-item label="备注" prop="rem">
          <el-input v-model="form.rem" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 部门信息列表 -->
    <el-dialog :title="dept.title" v-model="dept.open" width="50%" append-to-body>
      <el-form :model="queryParam1s" :inline="true" label-width="70px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="部门名称" prop="deptName">
              <el-input
                  v-model="queryParam1s.deptName"
                  placeholder="请输入部门名称"
                  clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="Search" @click="handleQuery1">搜索</el-button>
            <el-button type="success" @click="saveDept">确 定</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
          ref="table"
          v-if="refreshTable"
          v-loading="loading1"
          :data="deptList"
          height="calc(100vh - 200px)"
          row-key="deptId"
          :default-expand-all="isExpandAll"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="deptName" label="部门名称"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="选择考核项目" v-model="visible" width="800px" top="5vh" append-to-body>
      <el-form :model="queryParam2s" :inline="true" label-width="70px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="名称">
              <el-input
                  v-model="queryParam2s.name"
                  placeholder="请输入名称"
                  clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="Search" @click="handleQuery2">搜索</el-button>
            <el-button type="success" @click="saveProject">确 定</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
          ref="table1"
          :data="projectList"
          height="calc(100vh - 200px)"
          row-key="deptId"
          :default-expand-all="isExpandAll1"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange2"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编码" align="center" prop="code" />
        <el-table-column label="考核项目" align="center" prop="name" />
        <el-table-column label="考核内容" align="center" prop="examineContent" />
        <el-table-column label="评定标准" align="center" prop="evaluateStandard" />
        <el-table-column label="分值" align="center" prop="score" />
        <el-table-column label="考核说明" align="center" prop="examineIllustrate" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup name="TargetDuty">
import { listTargetDuty, getTargetDuty, delTargetDuty, addTargetDuty, updateTargetDuty } from "@/api/safework/targetDuty";
import { listTargetTypeDic} from "@/api/safework/targetTypeDic";
import { listTargetLevelDic} from "@/api/safework/targetLevelDic";
import {listDept} from "@/api/system/dept";
import {listExamineProjectDic} from "@/api/safework/examineProjectDic";
import {h, ref} from "vue";

const { proxy } = getCurrentInstance();

const userStore = useUserStore()
const targetDutyList = ref([]);
const depts = ref([]);
const deptList = ref([]);
const projectList = ref([]);
const refreshTable = ref(true);
const tables = ref([]);
const tableNames = ref([]);
const isExpandAll = ref(true);
const isExpandAll1 = ref(true);
const open = ref(false);
const lookopen = ref(false);
const loading = ref(true);
const loading1 = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const projectids = ref([]);
const options = ref([]);
const options1 = ref([]);
const yeares = ref([]);
const single = ref(true);
const multiple = ref(true);
const single1 = ref(true);
const multiple1 = ref(true);
const total = ref(0);
const title = ref("");
const visible = ref(false);
const dept = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "部门列表",
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    code: null,
    yeaes: null,
    quarter: null,
    targetTypeDicId: null,
    targetLevelDicId: null,
    delFlag:''
  },
  queryParam1s: {
    deptName: null,
    delFlag:'0',
    status:'0'
  },
  queryParam2s: {
    name: null,
    delFlag:'0',
  },
  rules: {
    code: [
      { required: true, message: '请填写编码', trigger: 'blur' }
    ],
    yeaes: [
      { required: true, message: '请填写年份', trigger: 'blur' }
    ],
    quarter: [
      { required: true, message: '请填写季度', trigger: 'blur' }
    ],
    title: [
      { required: true, message: '请填写标题', trigger: 'blur' }
    ],
    totalScore: [
      { required: true, message: '请填写总分值', trigger: 'blur' }
    ],
    indexs: [
      { required: true, message: '请填写指标', trigger: 'blur' }
    ],
    suitRange: [
      { required: true, message: '请填写适用范围', trigger: 'blur' }
    ],
    suitDeptId: [
      { required: true, message: '请填写适用部门', trigger: 'blur' }
    ],
    targetLevelDicId: [
      { required: true, message: '请填写级别', trigger: 'blur' }
    ],
    targetTypeDicId: [
      { required: true, message: '请填写类型', trigger: 'blur' }
    ],
    qualifiedScore: [
      { required: true, message: '请填写合格分值', trigger: 'blur' }
    ],
    formulateUser: [
      { required: true, message: '请填写制定人', trigger: 'blur' }
    ],
    formulateDept: [
      { required: true, message: '请填写制定人部门', trigger: 'blur' }
    ],
    formulateTime: [
      { required: true, message: '请填写制定日期', trigger: 'blur' }
    ],
    inspectTime: [
      { required: true, message: '请填写检查日期', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules, queryParam1s, queryParam2s } = toRefs(data);

function calculate(id){
  projectids.value.forEach((j, index) => {
    if(j.id==id){
      projectids.value.splice(index,1)
    }
  })
  let count=0;
  projectids.value.forEach((j, index) => {
    count = parseInt(count) + parseInt(j.score);
  })
  form.value.totalScore = count;
}

/** 查询考核项目字典列表 */
function getProject() {
  listExamineProjectDic(queryParam2s.value).then(response => {
    projectList.value = response.rows;
  });
}

/** 选择考核项目按钮 **/
function selectProject(){
  projectids.value=[];
  visible.value = true;
  getProject();
}

// 多选框选中数据
function handleSelectionChange2(selection) {
  let ids = selection.map(item => item.id);
  let names = selection.map(item => item.name);
  let examineContents = selection.map(item => item.examineContent);
  let scores = selection.map(item => item.score);
  let count = 0;
  ids.forEach((j, index) => {
    projectids.value.push({
      id:j,
      name:names[index],
      examineContent:examineContents[index],
      score:scores[index],
    })
    count = parseInt(count) + parseInt(scores[index]);
  })
  single1.value = selection.length != 1;
  multiple1.value = !selection.length;
  form.value.totalScore = count;
}

//获取部门数据
function selectdep(){
  dept.open = true;
  if(form.value.suitDeptId != null && form.value.suitDeptId != ""){
    const deptIds = form.value.suitDeptId.split(",");
    proxy.$nextTick(() => {
      depts.value.forEach((dept) => {
        deptIds.forEach(deptId => {
          if(Number(deptId) == dept.deptId){
            proxy.$refs.table.toggleRowSelection(dept,true);
          }
        })
      });
    })
  }
}

/** 部门搜索按钮操作 */
function handleQuery1() {
  getdept();
}

/** 考核项目搜索按钮操作 */
function handleQuery2() {
  getProject();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  tables.value = selection.map(item => item.deptId);
  tableNames.value = selection.map(item => item.deptName);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

function getdept(){
  loading1.value = true;
  listDept(queryParam1s.value).then(response => {
    deptList.value = proxy.handleTree(response.data, "deptId");
    depts.value = response.data;
    getList();
  });
  loading1.value = false;
}

function saveDept(){
  const deptIds = tables.value.join(",");
  const deptNames = tableNames.value.join(",");
  if (deptIds == "") {
    proxy.$modal.msgError("请选择部门");
    return;
  }
  form.value.suitDeptId = deptIds;//适用部门
  form.value.depNames = deptNames;
  dept.open = false;
}

function saveProject(){
  visible.value = false;
}


function years() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
}

function getTypeDicList(){
  listTargetTypeDic({delFlag:'0'}).then(response => {
    options.value = response.rows;
  });
}

function getLevelDicList(){
  listTargetLevelDic({delFlag:'0'}).then(response => {
    options1.value = response.rows;
  });
}

/** 查询目标责任制定信息列表 */
function getList() {
  loading.value = true;
  listTargetDuty(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.suitDeptId != ""){
          row.suitDeptIdArray = row.suitDeptId.split(",");
        }
      }
    }
    targetDutyList.value = response.rows;
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
    code: null,
    yeaes: null,
    quarter: null,
    title: null,
    targetTypeDicId: null,
    targetLevelDicId: null,
    suitDeptId: null,
    suitRange: null,
    indexs: null,
    totalScore: null,
    qualifiedScore: null,
    formulateUser: null,
    formulateDept: null,
    formulateTime: null,
    inspectTime: null,
    checkUser: null,
    ratifyUser: null,
    realityInspectTime: null,
    inspectValue: null,
    inspectSituation: null,
    rem: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("targetDutyRef");
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

/** 新增按钮操作 */
function handleAdd() {
  reset();
  form.value.delFlag = '0'
  form.value.status = '1'

  form.value.formulateUser = userStore.user.nickName
  form.value.formulateDept = userStore.user.dept.deptName
  open.value = true;
  title.value = "添加目标责任制定信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getTargetDuty(id).then(response => {
    if(response.data.suitDeptId != ""){
      response.data.suitDeptIdArray = response.data.suitDeptId.split(",");
      var deptNames = [];
      for(let id of response.data.suitDeptIdArray){
        for(let dep of depts.value){
          if(Number(id) == dep.deptId){
            deptNames.push(dep.deptName);
          }
        }
      }
      response.data.depNames = deptNames.join(',');
    }

    form.value = response.data;
    projectids.value = form.value.subtableList;
    open.value = true;
    title.value = "修改目标责任制定信息";
  });
}

function handleStatus(id){
  proxy.$modal.confirm('是否确认发布目标责任制定信息编号为"' + id + '"的数据项？').then(function() {
    return updateTargetDuty({id:id,status:'2'});
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("发布成功");
  }).catch(() => {});
}

function handleLook(){
  reset();
  const id = row.id || ids.value
  getTargetDuty(id).then(response => {
    if(response.data.suitDeptId != ""){
      response.data.suitDeptIdArray = response.data.suitDeptId.split(",");
      var deptNames = [];
      for(let id of response.data.suitDeptIdArray){
        for(let dep of depts.value){
          if(Number(id) == dep.deptId){
            deptNames.push(dep.deptName);
          }
        }
      }
      response.data.depNames = deptNames.join(',');
    }

    form.value = response.data;
    projectids.value = form.value.subtableList;
    lookopen.value = true;
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["targetDutyRef"].validate(valid => {
    if (valid) {
      form.value.subtableList = projectids.value;
      if (form.value.id != null) {
        updateTargetDuty(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTargetDuty(form.value).then(response => {
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
    return delTargetDuty(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/targetDuty/export', {
    ...queryParams.value
  }, `targetDuty_${new Date().getTime()}.xlsx`)
}

getdept();
getTypeDicList();
getLevelDicList();
yeares.value = years();
</script>
<style scoped lang="scss">
	.khxmlist{
		clear: both;
		width: 100%;
		.item{
			margin: 15px 0 0;
			border-radius: 3px;
			box-shadow: 0 0 6px #dedede;
			
			.tit{
				padding: 15px;border-bottom: 1px solid #dedede;
				h4{
					display: inline-block;font-size: 14px;margin: 0;
				}
				.shanchu{
					float: right;
					border: 0;color: #09bec5;
				}
			}
			.content{
				padding: 15px;line-height: 2;
			}
			.fenzhi{
				text-align: right;
				padding: 0 15px 15px;
				.el-input{
					width: 200px;
				}
			}
		}
	}
</style>
