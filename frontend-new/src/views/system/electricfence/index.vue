<template>
  <div class="electricfence">
    <div class="searchbox">
      <el-form :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="围栏名称">
              <el-input v-model="form.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="围栏状态">
              <el-select v-model="form.state" placeholder="请选择">
                <el-option label="停用" value="0"/>
                <el-option label="启用" value="1"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="getTableData">查询</el-button>
            <el-button type="primary" @click="addTanchu" style="margin-left: 15px;">新建</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog
        v-model="addDialog"
        title="新建"
        width="60%"
				custom-class="xinjianTanchu"
    >
			<div class="zhezhao" v-if="addforbid"></div>
      <el-form :model="addform" label-width="120px">
        <!--        <el-form-item label="编号" required>-->
        <!--          <el-input v-model="addform.num"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="围栏名称" required>
          <el-input v-model="addform.name"/>
        </el-form-item>
        <el-form-item label="作用层" required>
          <el-select v-model="addform.areaId" placeholder="请选择图层" clearable>
            <el-option
                v-for="area in areaList"
                :key="area.id"
                :label="area.name"
                :value="area.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="围栏告警类型" required>
          <el-checkbox-group v-model="addform.warntype" @change="warntypeChange">
            <el-row>
              <el-col :span="4">
                <el-checkbox label="超员"/>
              </el-col>
              <el-col :span="20">
                <el-input v-model="addform.chaoyuan" :disabled="addform.chaoyuanshow" placeholder="0">
                  <template #prepend>允许最多</template>
                  <template #append>人</template>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-checkbox label="缺员"/>
              </el-col>
              <el-col :span="20">
                <el-input v-model="addform.queyuan" :disabled="addform.queyuanshow" placeholder="0">
                  <template #prepend>允许最少</template>
                  <template #append>人</template>
                </el-input>
              </el-col>
              <!--							<el-col :span="4">-->
              <!--								<el-checkbox label="滞留" />-->
              <!--							</el-col>-->
              <!--							<el-col :span="20">-->
              <!--								<el-input v-model="addform.zhiliu" :disabled="addform.zhiliushow" placeholder="0">-->
              <!--									<template #prepend>允许滞留</template>-->
              <!--									<template #append>秒</template>-->
              <!--								</el-input>-->
              <!--							</el-col>-->
              <el-col :span="4">
                <el-checkbox label="静止"/>
              </el-col>
              <el-col :span="20">
                <el-input v-model="addform.jingzhi" :disabled="addform.jingzhishow" placeholder="0">
                  <template #prepend>允许静止</template>
                  <template #append>分钟</template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-checkbox label="越界"/>
              </el-col>
              <el-col :span="24">
                <template v-if="addform.warntype.includes('越界')" class="w100 mb5">

                  <div class="w100 mb5">
                    设置围栏权限人员
                    <el-checkbox label="不限人员权限"
                                 style="vertical-align: top;margin-left: 15px;"/>
                  </div>

                  <div v-if="addform.ppquanxian === false" class="w100 mb5">
                    <div>选择有权限人员</div>
                    <!--                    <el-radio-group v-model="addform.qxpeople" class="w100 mb5">-->
                    <!--                      <el-radio label="指定内部人员">指定内部人员</el-radio>-->
                    <!--                      <el-radio label="选择部门">选择部门</el-radio>-->
                    <!--                    </el-radio-group>-->
                    <div class="w100 mb10" v-if="addform.qxpeople === '指定内部人员'">
                      内部人员：
                      <el-button type="primary" @click="chooseneibu">选择内部人员</el-button>
                      <el-tag
                          v-for="row in peopletags"
                          :key="row"
                          class="peopletag"
                          closable
                          :disable-transitions="false"
                          @close="handleClose(row)"
                      >
                        {{ row.staffName }}
                      </el-tag>
                    </div>
                    <!--                    <div class="w100 mb10" v-if="addform.qxpeople === '选择部门'">-->
                    <!--                      内部人员部门：-->
                    <!--                      <el-button type="primary" @click="chooseBumen">选择部门</el-button>-->
                    <!--                      <el-tag-->
                    <!--                          v-for="row in bumentags"-->
                    <!--                          :key="row"-->
                    <!--                          class="peopletag"-->
                    <!--                          closable-->
                    <!--                          :disable-transitions="false"-->
                    <!--                          @close="bumenhandleClose(row)"-->
                    <!--                      >-->
                    <!--                        {{ row.name }}-->
                    <!--                      </el-tag>-->
                    <!--                    </div>-->
                    <div class="w100 mb10">
                      承包商：
                      <el-button type="primary" @click="choosesupplier">选择承包商</el-button>
                      <el-tag
                          v-for="row in suppliertags"
                          :key="row"
                          class="peopletag"
                          closable
                          :disable-transitions="false"
                          @close="suppierhandleClose(row)"
                      >
                        {{ row.personnelName }}
                      </el-tag>
                    </div>
                  </div>
                </template>
              </el-col>
              <el-col :span="24">
                <el-checkbox label="离岗"/>
              </el-col>
              <el-col :span="24">
                <div v-if="addform.warntype.includes('离岗')" class="w100 mb5">
                  <!--                  <el-button type="primary" @click="addligang">添加离岗配置</el-button>-->
                  <el-table :data="ligangData" border style="width: 100%;margin: 10px 0 0;">
                    <!--                    <el-table-column label="开始结束时间">-->
                    <!--                      <template #default="scope">-->
                    <!--                        <el-time-picker-->
                    <!--                            v-model="scope.row.time"-->
                    <!--                            is-range-->
                    <!--                            range-separator="至"-->
                    <!--                            start-placeholder="开始时间"-->
                    <!--                            end-placeholder="结束时间"-->
                    <!--                            format="hh:mm"-->
                    <!--                        />-->
                    <!--                      </template>-->
                    <!--                    </el-table-column>-->
                    <el-table-column label="选择人员">
                      <template #default="scope">
                        <div>内部人员：
                          <span v-for="(nbry, index) in scope.row.neiburenyuan">
														<i v-if="index>0" style="font-style: normal;">，</i>{{ nbry.staffName }}
													</span>
                        </div>
                        <div>承包商：
                          <span v-for="(cbs, index) in scope.row.supplier">
														<i v-if="index>0" style="font-style: normal;">，</i>{{ cbs.personnelName }}
													</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="240">
                      <template #default="scope">
                        <el-button type="text" @click="ligangrenyuan(scope.$index)">选择内部人员</el-button>
                        <el-button type="text" @click="ligangsupplier(scope.$index)">选择承包商</el-button>
                        <el-button type="text" @click="ligangDelete(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
<!--        <el-form-item label="生效时间" required>-->
<!--          <el-date-picker-->
<!--              value-format="YYYY-MM-DD HH:mm:ss"-->
<!--              v-model="addform.takingtime"-->
<!--              type="daterange"-->
<!--              range-separator="至"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              :disabled="addform.longtime"-->
<!--          />-->
<!--          <div style="width: 100%;margin: 5px 0 0;">-->
<!--            <el-checkbox v-model="addform.longtime" label="长期有效"/>-->
<!--          </div>-->
<!--        </el-form-item>-->
        <el-form-item label="备注">
          <el-input
              v-model="addform.beizhu"
              :rows="3"
              type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="addDialog = false">关闭</el-button>
					<el-button type="primary" @click="addSave" :disabled="addforbid">保存</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 选择内部人员/承包商弹出 -->
    <el-dialog
        v-model="chooserenyuan"
        :title="chooseDialogTitle"
        custom-class="chooseTanchu"
        width="1200px"
    >
      <el-row>
        <el-col :span="11">
          <el-form :inline="true" :model="peopleshaixuan">
            <el-form-item label="姓名">
              <el-input v-model="peopleshaixuan.name" placeholder="请输入姓名"/>
            </el-form-item>
            <!--            <el-form-item label="所属部门" v-if="searchType === '内部人员'">-->
            <!--              <el-select v-model="peopleshaixuan.bumen" placeholder="全部">-->
            <!--                <el-option-->
            <!--                    v-for="dept in deptList"-->
            <!--                    :key="dept.deptId"-->
            <!--                    :label="dept.deptName"-->
            <!--                    :value="dept.deptId">-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="chaxun(searchType)">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
              ref="multipleTableRef1"
              :data="choosetableLeft"
              style="width: 100%"
              height="calc(100% - 60px)"
              @select="choosetblfChange"
              v-if="searchType === '供应商'"
          >
            <el-table-column type="selection" width="55"/>
            <el-table-column property="personnelName" label="姓名"/>
            <el-table-column property="tagId" label="标签"/>
            <el-table-column property="post" label="岗位"/>
            <el-table-column property="phone" label="电话"/>
          </el-table>
          <el-table
              ref="multipleTableRef1"
              :data="choosetableLeft"
              style="width: 100%"
              height="calc(100% - 60px)"
              @select="choosetblfChange"
              v-if="searchType === '内部人员'"
          >
            <el-table-column type="selection" width="55"/>
            <el-table-column property="staffName" label="姓名"/>
            <el-table-column property="tagId" label="标签"/>
            <el-table-column property="phonenumber" label="电话"/>
            <el-table-column property="deptName" label="所属部门"/>

          </el-table>
        </el-col>
        <el-col :span="2">
          <div class="midarrow">
            <el-button @click="toRight" class="btn">
              <el-icon>
                <ArrowRight/>
              </el-icon>
            </el-button>
            <el-button @click="toLeft" class="btn">
              <el-icon>
                <ArrowLeft/>
              </el-icon>
            </el-button>
          </div>
        </el-col>
        <el-col :span="11">
          <div style="height: 50px;" v-if="searchType === '内部人员'">选中人员</div>
          <div style="height: 50px;" v-if="searchType === '供应商'">选中供应商</div>
          <el-table
              ref="multipleTableRef2"
              :data="choosetableRight"
              style="width: 100%"
              height="calc(100% - 60px)"
              @select="choosetbrtChange"
              v-if="searchType === '内部人员'"
          >
            <el-table-column type="selection" width="55"/>
            <el-table-column property="staffName" label="姓名"/>
            <el-table-column property="tagId" label="标签"/>
            <el-table-column property="phonenumber" label="电话"/>
            <el-table-column property="deptName" label="所属部门"/>
          </el-table>
          <el-table
              ref="multipleTableRef2"
              :data="choosetableRight"
              style="width: 100%"
              height="calc(100% - 60px)"
              @select="choosetbrtChange"
              v-if="searchType === '供应商'"
          >
            <el-table-column type="selection" width="55"/>
            <el-table-column property="personnelName" label="姓名"/>
            <el-table-column property="tagId" label="标签"/>
            <el-table-column property="post" label="岗位"/>
            <el-table-column property="phone" label="电话"/>
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="choosryClose">关闭</el-button>
					<el-button type="primary" @click="chooserySave">
						保存
					</el-button>
				</span>
      </template>
    </el-dialog>
    <!-- 选择部门 -->
    <el-dialog
        v-model="choosebumenDialog"
        title="选择部门"
        custom-class="chooseTanchu"
        width="50%"
    >
      <el-row :gutter="10">
        <el-col :span="10">
          <el-button type="primary" @click="checkAll">全选/全不选</el-button>
          <div class="bmchoose">
            <el-checkbox-group
                v-model="checkedBumens"
                @change="CheckedBumensChange"
            >
              <el-checkbox v-for="bumen in BumenLIst" :key="bumen" :label="bumen">
                {{ bumen }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="14">
          <el-table
              ref="multipleTableRef5"
              :data="choosesbumentable"
              style="width: 100%"
              height="calc(100% - 60px)"
          >
            <el-table-column property="name" label="部门"/>
            <el-table-column label="操作" width="80px">
              <template #default="scope">
                <el-button
                    link
                    type="text"
                    @click="deleteRow(scope.$index)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="choosebumenClose">关闭</el-button>
					<el-button type="primary" @click="choosebumenSave">
						保存
					</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 边界弹出 -->
    <el-dialog
        v-model="dialogBianjie"
        title="边界绘制"
        width="90%"
        custom-class="bianjiedialog"
    >
      <div class="bianjiebox">
        <div class="tools">
          <!--          <el-button>-->
          <!--            <img src="@/assets/images/weilanbianjie-ico1.png" width="20"/>-->
          <!--          </el-button>-->
          <el-button>
            <img src="@/assets/images/weilanbianjie-ico2.png" width="20" @click="addLayer"/>
          </el-button>
          <!--          <el-button>-->
          <!--            <img src="@/assets/images/weilanbianjie-ico3.png" width="20"/>-->
          <!--          </el-button>-->
          <el-button @click="bianjieRemove">清除</el-button>
          <el-button @click="dialogBianjie = false">取消</el-button>
          <el-button @click="bianjieSave">保存</el-button>
        </div>
        <div class="mapbox">
          <div id="cesiumContainer2"></div>
        </div>
      </div>
    </el-dialog>

    <!-- 人员弹出 -->
    <el-dialog
        v-model="dialogRenyuan"
        title="人员信息"
        width="90%"
        custom-class="infodialog"
    >
      <div class="searchbox">
        <el-form :model="renyuansearchform" label-width="80px">
          <el-row :gutter="20">
            <!-- <el-col :span="8">
              <el-form-item label="围栏名称">
                <el-input v-model="renyuansearchform.fencename"/>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="人员类别">
                <el-select v-model="renyuansearchform.type" placeholder="请选择">
                  <el-option label="内部人员" value="内部人员"/>
                  <el-option label="访客" value="访客"/>
                  <el-option label="承包商" value="承包商"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="定位标签">
                <el-input v-model="renyuansearchform.cardid"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名">
                <el-input v-model="renyuansearchform.name"/>
              </el-form-item>
            </el-col>
            <!--            <el-col :span="6">-->
            <!--              <el-form-item label="进入围栏开始时间">-->
            <!--                <el-date-picker-->
            <!--                    v-model="renyuansearchform.starttime"-->
            <!--                    type="datetime"-->
            <!--                    placeholder="选择开始时间"-->
            <!--                />-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <!--            <el-col :span="6">-->
            <!--              <el-form-item label="进入围栏结束时间">-->
            <!--                <el-date-picker-->
            <!--                    v-model="renyuansearchform.endtime"-->
            <!--                    type="datetime"-->
            <!--                    placeholder="选择结束时间"-->
            <!--                />-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="3">
              <el-button type="primary" @click="renyuanTanchuSearch">查询</el-button>
              <el-button type="primary" @click="dialogRenyuan = false" style="margin-left: 15px;">返回</el-button>
            </el-col>
            <el-col :span="3">
              <div style="text-align: right;line-height: 34px;font-weight: bold;">
                人员总数：{{ renyuantableDataback.length }}
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="renyuantable">
        <el-table :data="renyuantableData" style="width: 100%;" height="100%">
          <el-table-column prop="type" label="人员类别"/>
          <el-table-column prop="name" label="姓名"/>
          <el-table-column prop="phone" label="手机"/>
          <el-table-column prop="tagId" label="卡ID"/>
          <!--          <el-table-column fixed="right" label="操作" width="120">-->
          <!--            <template #default="scope">-->
          <!--              <el-button type="text" @click="renyuanDetail(scope.row)">-->
          <!--                人员详情-->
          <!--              </el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
      </div>
    </el-dialog>

    <!-- 人员详情 -->
    <el-dialog
        v-model="dialogRenyuanDetail"
        title="人员详情"
        width="50%"
    >
      人员详情
    </el-dialog>

    <!-- 告警弹出 -->
    <el-dialog
        v-model="dialogWarn"
        title="告警信息"
        width="90%"
        custom-class="infodialog"
    >
      <div class="searchbox">
        <el-form :model="warnsearchform" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="围栏名称">
                <el-input v-model="warnsearchform.fencename"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="告警类别">
                <el-select v-model="warnsearchform.type" placeholder="请选择">
                  <el-option label="Zone one" value="shanghai"/>
                  <el-option label="Zone two" value="beijing"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="告警状态">
                <el-select v-model="warnsearchform.status" placeholder="请选择">
                  <el-option label="Zone one" value="shanghai"/>
                  <el-option label="Zone two" value="beijing"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="告警开始时间">
                <el-date-picker
                    v-model="warnsearchform.starttime"
                    type="datetime"
                    placeholder="选择开始时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="告警结束时间">
                <el-date-picker
                    v-model="warnsearchform.endtime"
                    type="datetime"
                    placeholder="选择结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary">查询</el-button>
              <el-button type="primary" @click="dialogWarn = false" style="margin-left: 15px;">返回</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="renyuantable">
        <el-table :data="warntableData" style="width: 100%;" height="100%">
          <el-table-column prop="type" label="告警类型"/>
          <el-table-column prop="name" label="围栏名称"/>
          <el-table-column prop="warntime" label="告警时间"/>
          <el-table-column prop="status" label="告警处理状态"/>
          <el-table-column prop="info" label="提示消息"/>
          <el-table-column prop="people" label="处理人员姓名"/>
          <el-table-column prop="result" label="处理结果"/>
          <el-table-column prop="handletime" label="处理时间" width="200"/>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="text" @click="warnDetail(scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 告警详情 -->
    <el-dialog
        v-model="dialogWarnDetail"
        title="告警详情"
        width="50%"
    >
      告警详情
    </el-dialog>

    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="center" prop="name" label="围栏名称"/>
        <!--        <el-table-column align="center" prop="attr" label="告警属性" width="120"/>-->
<!--        <el-table-column align="center" prop="takeEffectStartTimeStr" label="生效开始时间"/>-->
<!--        <el-table-column align="center" prop="takeEffectEndTimeStr" label="生效结束时间"/>-->
        <el-table-column align="center" prop="tagNumbers" label="人员数量" width="120"/>
        <!--				<el-table-column prop="carnum" label="车辆数量" width="120" />-->
        <!--				<el-table-column prop="certnum" label="安全作业证数量" width="120" />-->
        <!--				<el-table-column prop="videonum" label="摄像头数量" width="120" />-->
        <el-table-column align="center" prop="state" label="围栏状态" width="120" :formatter="stateFormatter"/>
        <el-table-column align="center" prop="remark" label="备注" width="120"/>
        <el-table-column align="center" fixed="right" label="操作" width="240">
          <template #default="scope">
            <el-button type="text" @click="bianjieTanchu(scope.row)">边界</el-button>
            <el-button type="text" v-if="scope.row.state === 0" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" v-if="scope.row.state === 1" @click="read(scope.row)">查看</el-button>
            <el-button type="text" @click="onoroff(scope.row)">
              <span v-if="scope.row.state === 0">启用</span>
              <span v-if="scope.row.state === 1">停用</span>
            </el-button>
            <el-button type="text" @click="renyuanTanchu(scope.row)">人员</el-button>
            <el-button type="text" v-if="scope.row.state === 0" @click="deleteTableRow(scope.row)">删除</el-button>
            <!--            <el-button type="text" @click="warnTanchu(scope.row)">告警</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  listEnclosure,
  tagListByEnclosure,
  addEnclosure2,
  selectZyEnclosureAddWebRequestByZyId,
  getEnclosure,
  updateEnclosure, updateEnclosure2, firing, stop, getAllArea, delEnclosure
} from "@/api/system/enclosure";
import {bindTagStaff, listStaff} from "@/api/system/staff";
import {bindTagContractorPersonnelList} from "@/api/contractorManage/personnel";
import {getMapConfig} from "@/api/system/positioning";
import {getLayerColor} from "@/utils/pointUtil";
import jquery from 'jquery'
import {listDept} from "@/api/system/dept";
import {ElMessageBox} from "element-plus";
import Bjt3DClass from "@/utils/Bjt3DClass";


export default {
  watch: {},

  data() {
    return {
      bjt3D: null,
      deptList: [],
      selectEnclosureId: null,
      layerParams: {layer: null, modelId: null},
      form: reactive({
        name: '',
        state: '',
      }),
      tableData: [],
      addDialog: false,
      addform: reactive({
        id: null,
        num: '',
        name: '',
        warntype: [],
        chaoyuan: '',
        chaoyuanshow: true,
        queyuan: '',
        queyuanshow: true,
        zhiliu: '',
        zhiliushow: true,
        jingzhi: '',
        jingzhishow: true,
        ppquanxian: true,
        qxpeople: '指定内部人员',
        takingtime: '',
        longtime: false,
        beizhu: '',
        peopletags: [],
        bumentags: [],
        suppliertags: [],
        ligangData: []
      }),
      ligangData: [{
        time: [],
        neiburenyuan: [],
        supplier: []
      }],

      chooserenyuan: false,
      chooseContractor: false,
      contractorshaixuan: reactive({
        name: ''
      }),
      peopleshaixuan: reactive({
        name: '',
        bumen: ''
      }),
      areaList: [],
      choosetableLeft: [],
      choosetableRight: [],
      choosetableLeft2: [],
      choosetableRight2: [],
      lefttbzancun: [],
      righttbzancun: [],
      peopletags: [],
      suppliertags: [],
      searchType: '',
      chooseDialogTitle: '',
      neiburenyuanList: [],
      supplierList: [],
      neiburenyuanListzancun: [],
      supplierListzancun: [],

      choosebumenDialog: false,
      choosesbumentable: [],
      choosebmzancun: [],
      chechbmall: false,
      checkedBumens: [],
      bumentags: [],
      BumenLIst: ['部门一', '部门二', '部门三', '部门四', '部门五', '部门六', '部门七', '部门八', '部门九'],

      ligangTanchu: 0,
      ligangrowid: '',
      ligangryzancun: [],
      ligangsupplierzancun: [],

      alreadypush: false,

      dialogBianjie: false,
      dialogRenyuan: false,
      dialogWarn: false,
      dialogRenyuanDetail: false,
      dialogWarnDetail: false,
      renyuansearchform: reactive({
        fencename: '',
        type: '',
        cardid: '',
        name: '',
        starttime: '',
        endtime: ''
      }),
      renyuantableData: [],
      renyuantableDataback: [],
      warnsearchform: reactive({
        fencename: '',
        type: '',
        status: '',
        starttime: '',
        endtime: ''
      }),
      warntableData: [
        {
          type: '',
          name: '张三三',
          warntime: '18965346589',
          status: '',
          info: '',
          people: '',
          result: '',
          handletime: '2023-10-10 10:00:00',
        }, {
          type: '',
          name: '张三三',
          warntime: '18965346589',
          status: '',
          info: '',
          people: '',
          result: '',
          handletime: '2023-10-10 10:00:00',
        },
      ],
			addforbid: false,
    }
  },
  created() {

  },

  mounted: function () {
    this.bjt3D = new Bjt3DClass();
    this.getTableData()
    this.getNeiburenyuan();
    this.getSupplier();
    this.neiburenyuanListzancun = JSON.parse(JSON.stringify(this.neiburenyuanList));
    this.supplierListzancun = JSON.parse(JSON.stringify(this.supplierList));
    this.ligangryzancun.push(this.neiburenyuanList)
    this.ligangsupplierzancun.push(this.supplierList)
  },

  methods: {
    deleteTableRow(row) {
      delEnclosure(row.id).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.getTableData()
      })
    },
    getDeptList() {
      listDept({deptFlag: '0', status: '0'}).then(response => {
        this.deptList = response.data;
      })
    },
    bianjieRemove() {
      this.layerParams.modelId = 1
      this.layerParams.layer = null
      this.bjt3D.removeAll()
    },
    bianjieSave() {
      console.log(this.selectEnclosureId)
      updateEnclosure({
        id: this.selectEnclosureId,
        modelId: this.layerParams.modelId,
        polygonPoint: JSON.stringify(this.layerParams.layer)
      }).then(res => {
        this.dialogBianjie = false
      })
    },
    getTableData() {
      listEnclosure(this.form).then(res => {
        console.log(res)
        this.tableData = res.rows;
      })
    },
    // 获取内部人员列表
    getNeiburenyuan() {
      this.neiburenyuanList = [
        {
          name: '张三',
          tag: '0909',
          tel: '18978965674',
          bumen: '车间车间',
        }, {
          name: '李四',
          tag: '0910',
          tel: '18978965674',
          bumen: '车间车间'
        }, {
          name: '王五',
          tag: '0911',
          tel: '18978965674',
          bumen: '车间车间'
        }, {
          name: '六六六',
          tag: '0912',
          tel: '18978965674',
          bumen: '车间车间'
        }, {
          name: '七七七',
          tag: '0913',
          tel: '18978965674',
          bumen: '车间车间'
        }, {
          name: '小八',
          tag: '0914',
          tel: '18978965674',
          bumen: '车间车间'
        }, {
          name: '小九九',
          tag: '0915',
          tel: '18978965674',
          bumen: '车间车间'
        },
      ]
    },
    //获取供应商列表
    getSupplier() {
      this.supplierList = [
        {
          name: '商张三',
          tag: '0909',
          tel: '18978965674',
        }, {
          name: '商李四',
          tag: '0910',
          tel: '18978965674',
        }, {
          name: '商王五',
          tag: '0911',
          tel: '18978965674',
        }, {
          name: '商六六六',
          tag: '0912',
          tel: '18978965674',
        }, {
          name: '商七七七',
          tag: '0913',
          tel: '18978965674',
        }, {
          name: '商小八',
          tag: '0914',
          tel: '18978965674',
        }, {
          name: '商小九九',
          tag: '0915',
          tel: '18978965674',
        },
      ]
    },
    addTanchu() {
      this.addforbid = false
      this.getDeptList()
      this.addDialog = true;
      this.addform.qxpeople = '指定内部人员'
      this.peopletags = []
      this.bumentags = []
      this.suppliertags = []
      this.ligangData = [{
        time: [],
        neiburenyuan: [],
        supplier: []
      }]
      this.addform = {
        areaId: '',
        num: '',
        name: '',
        warntype: [''],
        chaoyuan: '',
        chaoyuanshow: true,
        queyuan: '',
        queyuanshow: true,
        zhiliu: '',
        zhiliushow: true,
        jingzhi: '',
        jingzhishow: true,
        ppquanxian: false,
        qxpeople: '指定内部人员',
        takingtime: '',
        longtime: false,
        beizhu: '',
        peopletags: [],
        bumentags: [],
        suppliertags: [],
        ligangData: []
      }
      getAllArea().then(res => {
        this.areaList = res.data.data
      })
    },
    addSave() {
      this.addform.peopletags = this.peopletags
      this.addform.bumentags = this.bumentags
      this.addform.suppliertags = this.suppliertags
      this.addform.ligangData = this.ligangData
      console.log(this.addform)
      if (null == this.addform.id) {
        addEnclosure2(this.addform).then(res => {
          this.getTableData()
        })
      } else {
        updateEnclosure2(this.addform).then(res => {
          this.getTableData()
        })
      }
      this.addDialog = false;
    },
    warntypeChange() {
      if (this.addform.warntype.includes('超员')) {
        this.addform.chaoyuanshow = false;
      } else {
        this.addform.chaoyuanshow = true;
      }
      if (this.addform.warntype.includes('缺员')) {
        this.addform.queyuanshow = false;
      } else {
        this.addform.queyuanshow = true;
      }
      if (this.addform.warntype.includes('滞留')) {
        this.addform.zhiliushow = false;
      } else {
        this.addform.zhiliushow = true;
      }
      if (this.addform.warntype.includes('静止')) {
        this.addform.jingzhishow = false;
      } else {
        this.addform.jingzhishow = true;
      }
      if (this.addform.warntype.includes('不限人员权限')) {
        this.addform.ppquanxian = true;
      } else {
        this.addform.ppquanxian = false;
      }
    },
    // buxianryqx(value) {
    //   this.addform.ppquanxian = value
    // },

    chaxun(type) {
      if (type === '内部人员') {
        this.getTagStaff()
      }
      if (type === '供应商') {
        this.getContractorPersonnelList();
      }
    },
    stateFormatter(v) {
      if (v.state == 0) {
        return '停用'
      } else if (v.state == 1) {
        return '启用'
      }
    },
    chooseneibu() {

      this.getTagStaff()

      this.chooserenyuan = true;
      this.ligangTanchu = 0;
      // 查询类别
      this.searchType = '内部人员';
      this.chooseDialogTitle = '选择内部人员';
      this.choosetableLeft = this.neiburenyuanListzancun;
      //按tag排序
      this.choosetableLeft = this.choosetableLeft.sort((a, b) => a.tag - b.tag);
      this.choosetableRight = [];
      this.peopletags.forEach((row, index) => {
        this.choosetableRight.push(row);
        //按tag排序
        this.choosetableRight = this.choosetableRight.sort((a, b) => a.tag - b.tag)
      })
    },
    choosetblfChange(val, row) {
      this.lefttbzancun = val;
    },
    toRight() {
      this.alreadypush = true;
      this.lefttbzancun.forEach((row, index) => {
        this.choosetableRight.push(row);
        //按tag排序
        this.choosetableRight = this.choosetableRight.sort((a, b) => a.tag - b.tag)
        this.choosetableLeft.splice(this.choosetableLeft.indexOf(row), 1)
        console.log(this.choosetableRight)
      })
    },
    layerLoad(rowId) {
      this.bjt3D.layRemoveByType(109)
      getEnclosure(rowId).then(res => {
        console.log(res)
        this.bjt3D.layerLoad1(res.data.modelId, res.data.name, 109, res.data.polygonPoint, getLayerColor(109))
        if (res.data.polygonPoint == '' || res.data.polygonPoint == null) {
          this.layerParams.layer = null
        } else {
          this.layerParams.layer = res.data.polygonPoint
        }
      })
    },
    addLayer() {

      if (this.layerParams.layer != null) {
        this.$message({
          type: 'error',
          message: '请先清除已画围栏!'
        });
        return
      }

      let set = {height: 0, name: ""}
      this.$prompt('请设置围栏高度', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        set.height = value
        this.$prompt('请设置围栏名称', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          set.name = value
          this.bjt3D.layer(parseInt(set.height), set.name, getLayerColor(109), (layer, id) => {
            this.layerParams.layer = layer;
            this.layerParams.modelId = id;
            this.bjt3D.removeDefaultHandler();
          })
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    choosetbrtChange(val, row) {
      this.righttbzancun = val;
    },
    toLeft() {
      this.alreadypush = true;
      this.righttbzancun.forEach((row, index) => {
        this.choosetableLeft.push(row);
        //按tag排序
        this.choosetableLeft = this.choosetableLeft.sort((a, b) => a.tag - b.tag)
        this.choosetableRight.splice(this.choosetableRight.indexOf(row), 1)
      })
    },
    choosryClose() {
      this.chooserenyuan = false;
      if (this.alreadypush === true) {
        this.lefttbzancun.forEach((row, index) => {
          this.choosetableLeft.push(row);
          //按tag排序
          this.choosetableLeft = this.choosetableLeft.sort((a, b) => a.tag - b.tag)
          this.choosetableRight.splice(this.choosetableRight.indexOf(row), 1)
        })
        this.righttbzancun.forEach((row, index) => {
          this.choosetableRight.push(row);
          //按tag排序
          this.choosetableRight = this.choosetableRight.sort((a, b) => a.tag - b.tag)
          this.choosetableLeft.splice(this.choosetableLeft.indexOf(row), 1)
        })
      } else {
        this.lefttbzancun = [];
        this.righttbzancun = [];
      }
      this.alreadypush = false;
      //取消两边表格选中状态
      this.$refs.multipleTableRef1.clearSelection()
      this.$refs.multipleTableRef2.clearSelection()
    },
    chooserySave() {
      this.chooserenyuan = false;
      this.lefttbzancun = [];
      this.righttbzancun = [];
      if (this.searchType === '内部人员') {
        if (this.ligangTanchu === 0) {
          this.peopletags = this.choosetableRight;
        } else {
          this.ligangData[this.ligangrowid].neiburenyuan = this.choosetableRight;
        }
      }
      if (this.searchType === '供应商') {
        if (this.ligangTanchu === 0) {
          this.suppliertags = this.choosetableRight;
        } else {
          this.ligangData[this.ligangrowid].supplier = this.choosetableRight;
        }
      }
      this.alreadypush = false;
    },
    handleClose(row) {
      this.peopletags.splice(this.peopletags.indexOf(row), 1)
      this.neiburenyuanListzancun.push(row);
    },
    getContractorPersonnelList() {
      bindTagContractorPersonnelList().then(res => {
        if (this.choosetableRight.length > 0) {
          this.choosetableLeft = res.data
          for (let i = 0; i < this.choosetableRight.length; i++) {
            for (let j = 0; j < this.choosetableLeft.length; j++) {
              if (this.choosetableRight[i].id == this.choosetableLeft[j].id) {
                this.choosetableLeft.splice(j, 1);
              }
            }
          }
        } else {
          this.choosetableLeft = res.data
        }
      })
    },
    choosesupplier() {
      this.getContractorPersonnelList();
      this.chooserenyuan = true;
      this.ligangTanchu = 0;
      // 查询类别
      this.searchType = '供应商';
      this.chooseDialogTitle = '选择供应商';
      this.choosetableLeft = this.supplierListzancun;
      //按tag排序
      this.choosetableLeft = this.choosetableLeft.sort((a, b) => a.tag - b.tag)
      this.choosetableRight = [];
      this.suppliertags.forEach((row, index) => {
        this.choosetableRight.push(row);
        //按tag排序
        this.choosetableRight = this.choosetableRight.sort((a, b) => a.tag - b.tag)
      })
    },
    suppierhandleClose(row) {
      this.suppliertags.splice(this.suppliertags.indexOf(row), 1)
      this.supplierListzancun.push(row);
    },

    chooseBumen() {
      this.choosebumenDialog = true;
    },
    deleteRow(id) {
      this.choosesbumentable.splice(id, 1);
      this.checkedBumens = [];
      this.choosesbumentable.forEach((row, index) => {
        this.checkedBumens.push(row.name);
      });
    },
    checkAll() {
      if (this.chechbmall === true) {
        this.chechbmall = false;
        this.checkedBumens = [];
        this.choosesbumentable = [];
      } else {
        this.chechbmall = true;
        this.checkedBumens = JSON.parse(JSON.stringify(this.BumenLIst))
        this.checkedBumens.forEach((row, index) => {
          this.choosesbumentable.push({name: row});
        });
      }
    },
    CheckedBumensChange() {
      this.choosesbumentable = [];
      this.checkedBumens.forEach((row, index) => {
        this.choosesbumentable.push({name: row});
      });
      //console.log(this.choosebmzancunleft)
    },
    choosebumenClose() {
      this.choosebumenDialog = false;

      this.checkedBumens = [];
      this.choosesbumentable = [];
      this.choosebmzancun.forEach((row, index) => {
        this.checkedBumens.push(row.name);
        this.choosesbumentable.push(row);
      })
      this.chechbmall = !this.chechbmall
    },
    choosebumenSave() {
      this.choosebumenDialog = false;
      this.bumentags = JSON.parse(JSON.stringify(this.choosesbumentable));

      this.choosebmzancun = JSON.parse(JSON.stringify(this.choosesbumentable));
    },
    bumenhandleClose(row) {
      this.bumentags.splice(this.bumentags.indexOf(row), 1)
      this.checkedBumens = [];
      this.choosesbumentable = [];
      this.bumentags.forEach((row, index) => {
        this.checkedBumens.push(row.name);
        this.choosesbumentable.push(row);
      });
      this.choosebmzancun = JSON.parse(JSON.stringify(this.choosesbumentable));
    },

    addligang() {
      this.ligangData.push({
        time: [],
        neiburenyuan: [],
        supplier: []
      });
      this.ligangryzancun.push(this.neiburenyuanList)
      this.ligangsupplierzancun.push(this.supplierList)
    },
    getTagStaff() {
      bindTagStaff().then(res => {
        if (this.choosetableRight.length > 0) {
          this.choosetableLeft = res.data
          for (let i = 0; i < this.choosetableRight.length; i++) {
            for (let j = 0; j < this.choosetableLeft.length; j++) {
              if (this.choosetableRight[i].staffId == this.choosetableLeft[j].staffId) {
                this.choosetableLeft.splice(j, 1);
              }
            }
          }
        } else {
          this.choosetableLeft = res.data
        }
      })
    },
    ligangrenyuan(id) {

      this.getTagStaff()

      this.chooserenyuan = true;
      this.ligangTanchu = 1;
      this.ligangrowid = id;
      this.searchType = '内部人员';
      this.chooseDialogTitle = '选择内部人员';
      if (this.ligangData[id].neiburenyuan.length === 0) {
        this.ligangryzancun[id] = JSON.parse(JSON.stringify(this.neiburenyuanList));
      }
      this.choosetableLeft = this.ligangryzancun[id];
      //按tag排序
      this.choosetableLeft = this.choosetableLeft.sort((a, b) => a.tag - b.tag);
      this.choosetableRight = [];
      this.ligangData[id].neiburenyuan.forEach((item, index) => {
        this.choosetableRight.push(item);
        //按tag排序
        this.choosetableRight = this.choosetableRight.sort((a, b) => a.tag - b.tag)
      })
    },
    ligangsupplier(id) {
      this.getContractorPersonnelList();
      this.chooserenyuan = true;
      this.ligangTanchu = 1;
      this.ligangrowid = id;
      this.searchType = '供应商';
      this.chooseDialogTitle = '选择供应商';
      if (this.ligangData[id].supplier.length === 0) {
        this.ligangsupplierzancun[id] = JSON.parse(JSON.stringify(this.neiburenyuanList));
      }
      this.choosetableLeft = this.ligangsupplierzancun[id];
      //按tag排序
      this.choosetableLeft = this.choosetableLeft.sort((a, b) => a.tag - b.tag);
      this.choosetableRight = [];
      this.ligangData[id].supplier.forEach((item, index) => {
        this.choosetableRight.push(item);
        //按tag排序
        this.choosetableRight = this.choosetableRight.sort((a, b) => a.tag - b.tag)
      })
    },
    ligangDelete(index) {
      this.ligangData.splice(index, 1)
      this.ligangryzancun.splice(index, 1)
      this.ligangsupplierzancun.splice(index, 1)
    },

    bianjieTanchu(row) {
      this.dialogBianjie = true;
      jquery('#cesiumContainer2').html('')
      this.selectEnclosureId = row.id
      getMapConfig().then(res => {
        let data = res.data;
        this.bjt3D.init('cesiumContainer2', data.mapAddress, data, () => {
          this.layerLoad(row.id);
        })
      });
    },
    renyuanTanchu(row) {
      tagListByEnclosure(row.id).then(res => {
        console.log(res)
        this.renyuantableDataback = res.data
        this.renyuantableData = this.renyuantableDataback.slice();
      })
      this.dialogRenyuan = true;
    },
    renyuanTanchuSearch() {
      this.renyuantableData = this.renyuantableDataback.slice();
      if (null != this.renyuansearchform.name && "" != this.renyuansearchform.name) {
        for (let i = 0; i < this.renyuantableData.length; i++) {
          if (!this.renyuantableData[i].name.includes(this.renyuansearchform.name)) {
            this.renyuantableData.splice(i, 1);
          }
        }
      }
      if (null != this.renyuansearchform.cardid && "" != this.renyuansearchform.cardid) {
        console.log(this.renyuansearchform.cardid)
        for (let i = 0; i < this.renyuantableData.length; i++) {
          if (!this.renyuantableData[i].tagId.includes(this.renyuansearchform.cardid)) {
            this.renyuantableData.splice(i, 1);
          }
        }
      }
      if (null != this.renyuansearchform.type && "" != this.renyuansearchform.type) {
        for (let i = 0; i < this.renyuantableData.length; i++) {
          if (!this.renyuantableData[i].type.includes(this.renyuansearchform.type)) {
            this.renyuantableData.splice(i, 1);
          }
        }
      }
    },
    warnTanchu(row) {
      this.dialogWarn = true;
    },
    renyuanDetail(row) {
      this.dialogRenyuanDetail = true;
    },
    warnDetail(row) {
      this.dialogWarnDetail = true;
    },
    onoroff(row) {
      if (row.state === 1) {
        ElMessageBox.confirm('确定停用该围栏？', "系统提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "warning",
        }).then(() => {
          stop(row.id).then(res => {
            if (200 == res.code || 'success' === res.msg) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
            this.getTableData()
          })
        })
      } else {
        ElMessageBox.confirm('确定启用该围栏？', "系统提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "warning",
        }).then(() => {
          firing(row.id).then(res => {
            this.getTableData()
            if (res.code == 200 || 'success' === res.msg) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
            }else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
            this.getTableData()
          })
        })
      }
    },
    edit(row) {
      this.addforbid = false
      selectZyEnclosureAddWebRequestByZyId(row.id).then(res => {
        getAllArea().then(res => {
          this.areaList = res.data.data
        })
        this.addform = res.data
        this.peopletags = this.addform.peopletags
        this.suppliertags = this.addform.suppliertags
        console.log(this.suppliertags)
        this.addform.qxpeople = '指定内部人员'
        this.getDeptList()
        this.addDialog = true;
        if (null == this.addform.ligangData || this.addform.ligangData.length === 0) {
          this.ligangData = [{
            time: [],
            neiburenyuan: [],
            supplier: []
          }]
        } else {
          this.ligangData = this.addform.ligangData;
        }
        if (this.addform.ppquanxian === true) {
          this.addform.warntype.push('不限人员权限');
        }
      })
    },
    read(row) {
      selectZyEnclosureAddWebRequestByZyId(row.id).then(res => {
        getAllArea().then(res => {
          this.areaList = res.data.data
        })
        this.addform = res.data
        this.peopletags = this.addform.peopletags
        this.suppliertags = this.addform.suppliertags
        this.addform.qxpeople = '指定内部人员'
        this.getDeptList()
        this.addDialog = true;
        if (null == this.addform.ligangData || this.addform.ligangData.length === 0) {
          this.ligangData = [{
            time: [],
            neiburenyuan: [],
            supplier: []
          }]
        } else {
          this.ligangData = this.addform.ligangData;
        }
        if (this.addform.ppquanxian === true) {
          this.addform.warntype.push('不限人员权限');
        }
        this.addforbid = true
      })
    }
  },

}
</script>


<style scoped lang="scss">
.electricfence {
  height: calc(100vh - 84px);
  overflow: auto;
  background: #f8f8f8;
  padding: 10px;

  .searchbox {
    background: #fff;
    padding: 18px 15px 0;
    margin: 0 0 10px;
  }

  .w100 {
    width: 100%;
    font-size: 14px;
  }

  .mb5 {
    margin-bottom: 5px;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .peopletag {
    margin-left: 10px;
  }

  :deep .el-dialog {
    .el-input {
      max-width: 300px;
    }

    .el-input-group {
      max-width: 300px;
    }
  }

  :deep .el-range-editor {
    width: 100%;
    max-width: 300px;
  }
	
	:deep .xinjianTanchu{
		.el-dialog__body{
			position: relative;border-top: 1px solid #eee;
		}
		.zhezhao{
			position: absolute;left: 0;top: 0;
			width: 100%;height: 100%;
			z-index: 9;
			cursor: not-allowed;
		}
	}
	
  :deep .chooseTanchu {
    .el-row {
      height: 100%;

      .el-col {
        height: 100%;
        position: relative;
      }
    }

    .el-dialog__body {
      height: 500px;
      padding: 20px;
      border-top: 1px solid #eee;

      .el-input__inner {
        width: 150px;
      }

      .el-form--inline .el-form-item {
        margin-right: 15px;
      }
    }

    .midarrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;

      .btn {
        margin: 5px auto;
        display: block;
      }
    }
  }

  .bmchoose {
    margin: 10px 0 0;

    :deep .el-checkbox {
      width: 100%;
      margin-right: 0;
    }
  }

  .table {
    height: calc(100% - 80px);
    background: #fff;

    :deep .el-table {

    }
  }

  :deep .bianjiedialog {
    height: 88vh;
    overflow: auto;

    .el-dialog__body {
      height: calc(100% - 54px);
      padding: 10px 20px 20px;
    }

    .bianjiebox {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .tools {
      width: 300px;
      height: 50px;
      padding: 10px 0;
      position: absolute;
      left: calc(50% - 220px);
      top: 10px;
      background: #fff;
      text-align: center;
      z-index: 9;
    }

    .mapbox {
      width: 100%;
      height: 100%;
      border: 1px solid #eee;
      background: #f9f9f9;

      #cesiumContainer2 {
        width: 100%;
        height: 100%;
      }
    }
  }

  :deep .infodialog {
    height: 88vh;
    overflow: auto;

    .el-dialog__body {
      height: calc(100% - 54px);
      padding: 10px 20px 20px;
      border-top: 1px solid #eee;
    }

    .renyuantable {
      height: calc(100% - 130px);
    }
  }
}

</style>




