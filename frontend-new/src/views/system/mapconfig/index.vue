<template>
  <div class="map">

    <div class="map-top">
      <el-radio-group v-model="radio1" size="small">
        <el-radio-button label="总览" @change="zongClick"></el-radio-button>
        <el-radio-button label="风险分区管理" @change="handleClick"></el-radio-button>
        <el-radio-button label="地图标识管理" @change="dituClick"></el-radio-button>
        <el-radio-button label="电子围栏管理" @change="dzwlClick"></el-radio-button>
        <el-radio-button label="其他" @change="otherClick"></el-radio-button>
      </el-radio-group>
    </div>

    <!--视图-->
    <div class="view-con">
      <div class="title">视图</div>
      <el-row class="list">
        <el-col :span="24">
          <el-switch
              v-model="value1"
              inactive-text="四色图"
              @change="closeLayer">
          </el-switch>
          <el-switch
              style="display: block"
              v-model="value2"
              inactive-text="风险点"
              @change="closePoint">
          </el-switch>
        </el-col>
      </el-row>
    </div>

    <!-- 画图 -->
    <div class="view-huatu" v-show="showdzwl">
      <div class="title">电子围栏编辑</div>
      <el-row class="list">
        <el-col :span="24">
          <div class="btn" @click="dzwlLayer">
            <img src="@/assets/images/dzwl-huatu.png" style="width: 20px">
            <span>标注围栏</span>
          </div>
        </el-col>
        <!--        <el-col :span="24">-->
        <!--          <div class="btn" @click="guizepeizhi">-->
        <!--            <img src="@/assets/images/dzwl-shezhi.png" style="width: 20px">-->
        <!--            <span>规则配置</span>-->
        <!--          </div>-->
        <!--        </el-col>-->
      </el-row>
    </div>
    <!-- 围栏信息弹出 -->
    <div class="weilanxinxi">
      <el-drawer
          v-model="drawer"
          title="围栏信息"
          direction="rtl"
      >
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="基本信息" name="1">
            <el-form :model="form" label-width="100px">
              <el-form-item label="名称">
                <el-input v-model="form.name" disabled readonly/>
              </el-form-item>
              <el-form-item label="消抖阈值(秒)">
                <el-input v-model="form.xiaodouyuzhi" disabled readonly/>
              </el-form-item>
              <el-form-item label="超时值(秒)">
                <el-input v-model="form.chaoshizhi" disabled readonly/>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              报警配置
            </template>
            <el-row class="bjpz-item">
              <el-col :span="18">超员报警</el-col>
              <el-col :span="6">
                <el-icon @click="bjpzbtn" class="plusbtn">
                  <Plus/>
                </el-icon>
                <el-icon class="plusbtn" @click="alarmDeleteBtn(2)">
                  <Minus/>
                </el-icon>
              </el-col>
            </el-row>
            <el-row class="bjpz-item">
              <el-col :span="18">缺员报警</el-col>
              <el-col :span="6">
                <el-icon @click="vacanciesAlarmBtn" class="plusbtn">
                  <Plus/>
                </el-icon>
                <el-icon class="plusbtn" @click="alarmDeleteBtn(3)">
                  <Minus/>
                </el-icon>
              </el-col>
            </el-row>
            <el-row class="bjpz-item">
              <el-col :span="18">串岗报警</el-col>
              <el-col :span="6">
                <el-icon @click="visitAlarmBtn" class="plusbtn">
                  <Plus/>
                </el-icon>
                <el-icon class="plusbtn" @click="alarmDeleteBtn(4)">
                  <Minus/>
                </el-icon>
              </el-col>
            </el-row>
            <el-row class="bjpz-item">
              <el-col :span="18">离岗报警</el-col>
              <el-col :span="6">
                <el-icon @click="leaveAlarmBtn" class="plusbtn">
                  <Plus/>
                </el-icon>
                <el-icon class="plusbtn" @click="alarmDeleteBtn(5)">
                  <Minus/>
                </el-icon>
              </el-col>
            </el-row>
            <el-row class="bjpz-item">
              <el-col :span="18">静止报警</el-col>
              <el-col :span="6">
                <el-icon @click="staticAlarmBtn" class="plusbtn">
                  <Plus/>
                </el-icon>
                <el-icon class="plusbtn" @click="alarmDeleteBtn(12)">
                  <Minus/>
                </el-icon>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-button type="info" style="margin-top: 60px" @click="enclosureDelete">删除围栏</el-button>

      </el-drawer>
    </div>
    <!-- 超员配置弹出 -->
    <div class="baojingpeizhi">
      <el-dialog
          v-model="dialogCyBjpz"
          title="报警配置"
          width="30%"
      >
        <el-form label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="alarmForm.name"/>
          </el-form-item>
          <el-form-item label="最多人数">
            <el-input v-model="alarmForm.maxCount"/>
          </el-form-item>
        </el-form>
        <template #footer>
					<span class="dialog-footer">
            <el-button @click="currentCommit">保存</el-button>
						<el-button @click="dialogCyBjpz = false">关闭</el-button>
					</span>
        </template>
      </el-dialog>
    </div>

    <!-- 缺员配置弹出 -->
    <div class="baojingpeizhi">
      <el-dialog
          v-model="dialogQyBjpz"
          title="报警配置"
          width="30%"
      >
        <el-form label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="alarmForm.name"/>
          </el-form-item>
          <el-form-item label="最少人数">
            <el-input v-model="alarmForm.minCount"/>
          </el-form-item>
        </el-form>
        <template #footer>
					<span class="dialog-footer">
            <el-button @click="vacanciesCommit">保存</el-button>
						<el-button @click="dialogQyBjpz = false">关闭</el-button>
					</span>
        </template>
      </el-dialog>
    </div>

    <!-- 串岗配置弹出 -->
    <div class="baojingpeizhi">
      <el-dialog
          v-model="dialogCgBjpz"
          title="串岗配置"
          width="30%"
      >
        <el-form label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="alarmForm.name"/>
          </el-form-item>
          <el-form-item label="允许进入">
            <el-button @click="cgPersonChooseTable">选择人员</el-button>
            <div class="personChoosedbox">
              <div class="item" v-for="item in cgpersonChoosed" :key="item.staffId">
                {{ item.staffName }}
                <el-icon class="persondelete" @click="persondelete(item.staffId)">
                  <Close/>
                </el-icon>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
					<span class="dialog-footer">
            <el-button type="primary" @click="visitCommit">保存</el-button>
						<el-button @click="dialogCgBjpz = false">关闭</el-button>
					</span>
        </template>
      </el-dialog>
    </div>
    <!-- 串岗人员弹出 -->
    <div class="baojingpeizhi">
      <el-dialog
          v-model="dialogCgPerson"
          title="选择人员"
          width="30%"
      >
        <el-table
            ref="cgtableRef"
            :data="cgpersonList"
            style="width: 100%"
            type="index"
            @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"/>
          <el-table-column property="staffId" v-if="false"/>
          <el-table-column property="staffNo" label="工号"/>
          <el-table-column property="staffName" label="姓名"/>
        </el-table>
        <template #footer>
					<span class="dialog-footer">
						<el-button type="primary" @click="cgPersonChoose">保存</el-button>
						<el-button @click="dialogCgPerson = false">取消</el-button>
					</span>
        </template>
      </el-dialog>
    </div>

    <!-- 离岗配置弹出 -->
    <div class="baojingpeizhi">
      <el-dialog
          v-model="dialogLgBjpz"
          title="离岗配置"
          width="30%"
      >
        <div>
          <el-form label-width="100px">
            <el-form-item label="名称">
              <el-input v-model="alarmForm.name"/>
            </el-form-item>
            <el-form-item label="不允许离开">
              <el-button @click="lgPersonChooseTable">选择人员</el-button>
              <div class="personChoosedbox">
                <div class="item" v-for="item in lgpersonChoosed" :key="item.staffId">
                  {{ item.staffName }}
                  <el-icon class="persondelete" @click="Lgpersondelete(item.staffId)">
                    <Close/>
                  </el-icon>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogLgBjpz = false">关闭</el-button>
						<el-button type="primary" @click="leaveAlarmCommit">确定</el-button>
					</span>
        </template>
      </el-dialog>
    </div>
    <!-- 离岗人员弹出 -->
    <div class="baojingpeizhi">
      <el-dialog
          v-model="dialogLgPerson"
          title="选择人员"
          width="30%"
      >
        <el-table
            ref="lgtableRef"
            :data="lgpersonList"
            style="width: 100%"
            type="index"
            @selection-change="lgpersonChange"
        >
          <el-table-column type="selection"/>
          <el-table-column property="staffId" v-if="false"/>
          <el-table-column property="staffNo" label="工号"/>
          <el-table-column property="staffName" label="姓名"/>
        </el-table>
        <template #footer>
					<span class="dialog-footer">
						<el-button type="primary" @click="lgPersonChoose">保存</el-button>
						<el-button @click="dialogLgPerson = false">取消</el-button>
					</span>
        </template>
      </el-dialog>
    </div>

    <!-- 静止配置弹出 -->
    <div class="baojingpeizhi">
      <el-dialog
          v-model="dialogJzBjpz"
          title="报警配置"
          width="30%"
      >
        <div>
          <el-form label-width="100px">
            <el-form-item label="名称">
              <el-input v-model="alarmForm.name"/>
            </el-form-item>
            <el-form-item label="静止时长（分钟）">
              <el-input v-model="alarmForm.stayTime"/>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
					<span class="dialog-footer">
            <el-button type="primary" @click="staticCommit">保存</el-button>
						<el-button @click="dialogJzBjpz = false">关闭</el-button>
					</span>
        </template>
      </el-dialog>
    </div>

    <div class="baojingpeizhi">
      <el-dialog
          v-model="dialogWlAdd"
          title="新增围栏"
          width="30%"
      >
        <el-form :model="wlForm" label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="wlForm.name"/>
          </el-form-item>
          <el-form-item label="消抖阈值(秒)">
            <el-input v-model="wlForm.threshold"/>
          </el-form-item>
          <el-form-item label="超时值(秒)">
            <el-input v-model="wlForm.overtime"/>
          </el-form-item>
          <el-form-item label="区域高度">
            <el-input v-model="wlForm.height"/>
          </el-form-item>
        </el-form>
        <template #footer>
					<span class="dialog-footer">
						<el-button @click="wlAdd">保存</el-button>
						<el-button @click="dialogWlAdd = false">关闭</el-button>
					</span>
        </template>
      </el-dialog>
    </div>

    <!--风险分区-->
    <div class="fxfq-tc" v-show="showfx">
      <div class="fxfq-top">
        <div class="popup-con">
          <div class="title">风险分区绘制</div>
          <div class="bagfa">
            <!--            <el-tooltip class="item" effect="dark" content="移动" placement="top">-->
            <!--              <el-button><img src="@/assets/images/move.png" style="width: 20px"></el-button>-->
            <!--            </el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="绘制" placement="top">
              <el-button @click="openDialogFqAdd"><img src="@/assets/images/difx.png" style="width: 25px"></el-button>
            </el-tooltip>
            <!--            <el-tooltip class="item" effect="dark" content="一般风险" placement="top">-->
            <!--              <el-button @click="layer(102)"><img src="@/assets/images/yiban.png" style="width: 25px"></el-button>-->
            <!--            </el-tooltip>-->
            <!--            <el-tooltip class="item" effect="dark" content="较大风险" placement="top">-->
            <!--              <el-button @click="layer(103)"><img src="@/assets/images/jiaoda.png" style="width: 25px"></el-button>-->
            <!--            </el-tooltip>-->
            <!--            <el-tooltip class="item" effect="dark" content="严重风险" placement="top">-->
            <!--              <el-button @click="layer(104)"><img src="@/assets/images/yanzhong.png" style="width: 25px"></el-button>-->
            <!--            </el-tooltip>-->
            <!--            <el-button>完成</el-button>-->
          </div>
        </div>
      </div>

      <div class="baojingpeizhi">
        <el-dialog
            v-model="dialogFqAdd"
            title="新增风险分区"
            width="30%"
        >
          <el-form :model="FqForm" label-width="100px">
            <el-form-item label="名称">
              <el-input v-model="FqForm.name"/>
            </el-form-item>
            <el-form-item label="模型高度">
              <el-input v-model="FqForm.height"/>
            </el-form-item>
            <el-form-item label="区域">
              <el-select v-model="FqForm.area" placeholder="请选择区域" clearable>
                <el-option
                    v-for="item in fqAreaList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
					<span class="dialog-footer">
						<el-button @click="getLayerColorByArea">保存</el-button>
						<el-button @click="dialogFqAdd = false">关闭</el-button>
					</span>
          </template>
        </el-dialog>
      </div>

      <div class="fxfq-bom" v-show="showfx">
        <div class="popup-con">
          <div class="title">风险分区管理-模型属性</div>
          <div class="bagfa">
            <el-row class="fxfqli">
              <el-col :span="10">
                <div class="">区域名称</div>
              </el-col>
              <el-col :span="14">
                <div class="">无</div>
              </el-col>
            </el-row>
            <el-row class="fxfqli">
              <el-col :span="10">
                <div class="">类型</div>
              </el-col>
              <el-col :span="14">
                <div class="">无</div>
              </el-col>
            </el-row>
            <el-row class="fxfqli">
              <el-col :span="24">
                <div class="">
                  <el-button type="text" @click="removeEntity">删除区域</el-button>
                </div>
              </el-col>
            </el-row>


          </div>
        </div>
      </div>
    </div>

    <!--地图标识-->
    <div class="ditu-top" v-show="showdt">
      <div class="popup-con">
        <div class="title">地图标识</div>
        <div class="bagfa">
          <el-button @click="point(1)">
            <div>
              <div class="ico">
                <img src="@/assets/images/fengxiandian.png" style="width: 20px">
              </div>
              <div>风险点</div>
            </div>
          </el-button>

          <el-button @click="point(7)">
            <div>
              <div class="ico">
                <img src="@/assets/images/youdu.png" style="width: 20px">
              </div>
              <div>有毒气体</div>
            </div>
          </el-button>

          <el-button @click="point(3)">
            <div>
              <div class="ico">
                <img src="@/assets/images/keran.png" style="width: 20px">
              </div>
              <div>可燃气体</div>
            </div>
          </el-button>

          <el-button @click="point(9)">
            <div>
              <div class="ico">
                <img src="@/assets/images/shexiangtou.png" style="width: 20px">
              </div>
              <div>视频监控</div>
            </div>
          </el-button>

          <el-button @click="point(8)">
            <div>
              <div class="ico">
                <img src="@/assets/images/WechatIMG51.png" style="width: 20px">
              </div>
              <div>消防</div>
            </div>
          </el-button>

          <!--          <el-button @click="point(13)">-->
          <!--            <div>-->
          <!--              <div class="ico">-->
          <!--                <img src="@/assets/images/shuxing.png" style="width: 20px">-->
          <!--              </div>-->
          <!--              <div>属性</div>-->
          <!--            </div>-->
          <!--          </el-button>-->

          <el-button @click="point(12)">
            <div>
              <div class="ico">
                <img src="@/assets/images/WechatIMG57.png" style="width: 20px">
              </div>
              <div>设备参数</div>
            </div>
          </el-button>

          <el-button @click="point(4)">
            <div>
              <div class="ico">
                <img src="@/assets/images/WechatIMG49.png" style="width: 20px">
              </div>
              <div>能源</div>
            </div>
          </el-button>

          <el-button @click="point(5)">
            <div>
              <div class="ico">
                <img src="@/assets/images/WechatIMG48.png" style="width: 20px">
              </div>
              <div>环保</div>
            </div>
          </el-button>
        </div>
      </div>
    </div>

    <!--其他-->
    <div class="other-tc" v-show="showqt">

      <div class="fxfq-bom">
        <div class="popup-con">
          <div class="title">其他</div>
          <div class="bagfa other">

            <el-row class="qt-li">
              <el-col :span="11">
                <div class="qt-title"> 模型x轴偏移量:</div>
              </el-col>
              <el-col :span="13">
                <div class="qtinput">
                  <el-input-number v-model="offsetX" @change="resetModel" label="模型x轴偏移量"></el-input-number>
                </div>
              </el-col>
            </el-row>

            <el-row class="qt-li">
              <el-col :span="11">
                <div class="qt-title"> 模型y轴偏移量:</div>
              </el-col>
              <el-col :span="13">
                <div class="qtinput">
                  <el-input-number v-model="offsetY" @change="resetModel" label="模型y轴偏移量"></el-input-number>
                </div>
              </el-col>
            </el-row>

            <el-row class="qt-li">
              <el-col :span="11">
                <div class="qt-title"> 模型z轴偏移量:</div>
              </el-col>
              <el-col :span="13">
                <div class="qtinput">
                  <el-input-number v-model="offsetZ" @change="resetModel" label="模型z轴偏移量"></el-input-number>
                </div>
              </el-col>
            </el-row>

            <el-row class="qt-li">
              <el-col :span="11">
                <div class="qt-title">初始化角度:</div>
              </el-col>
              <el-col :span="13">
                <div class="qtinput">
                  <el-input-number v-model="camera" @change="cameraChange" :min="-360" :max="360"
                                   label="初始化角度"></el-input-number>
                </div>
              </el-col>
            </el-row>

            <el-row class="qt-li">
              <el-col :span="11">
                <div class="qt-title">模型初始化角度:</div>
              </el-col>
              <el-col :span="13">
                <div class="qtinput">
                  <el-input-number v-model="modelAngle" :min="-360" :max="360"
                                   label="模型初始化角度" :precision="2"></el-input-number>
                </div>
              </el-col>
            </el-row>

            <el-row class="qt-li">
              <el-col :span="11">
                <div class="qt-title">最大可视高度:</div>
              </el-col>
              <el-col :span="13">
                <div class="qtinput">
                  <el-input-number v-model="maxHeight" @change="setMaxHeight" :max="10000"
                                   label="最大可视高度"></el-input-number>
                </div>
              </el-col>
            </el-row>

            <el-row class="qt-li">
              <el-col :span="11">
                <div class="qt-title">人员定位休眠时间(分钟):</div>
              </el-col>
              <el-col :span="13">
                <div class="qtinput">
                  <el-input-number v-model="dormancyTime" label="人员定位休眠时间(分钟)"></el-input-number>
                </div>
              </el-col>
            </el-row>

            <el-row class="qt-li">
              <el-col :span="11">
                <div class="qt-title">模型访问路径:</div>
              </el-col>
              <el-col :span="13">
                <div class="qtinput">
                  <el-input v-model="mapAddress" label="人员定位休眠时间(分钟)"></el-input>
                </div>
              </el-col>
            </el-row>

            <div class="tjbtn">
              <el-button type="primary" size="mini" style="width:100%" @click="saveConfig">保存</el-button>
            </div>

          </div>


        </div>
      </div>


    </div>

    <!--绑定弹出-->
    <div style="position: absolute;z-index: 999; top: 10%;left: 40%; width: 610px" class="tanchu-bd">
      <el-dialog
          title="点位绑定"
          v-model="cameraDialogVisible"
          width="610px"
          :before-close="handleClose">
        <div>

          <div class="topinput">
            <el-select v-model="cameraSelect" filterable placeholder="请选择摄像头"
                       style="display: block; width: 100%;">
              <el-option
                  v-for="item in cameraList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div style="margin: 0 auto;text-align: right;">
          <div style="margin-top: 15px;">
            <el-button type="success" @click="saveCamera">
              保存
            </el-button>
          </div>
        </div>
      </el-dialog>

    </div>
    <div style="position: absolute;z-index: 999; top: 10%;left: 40%; width: 610px" class="tanchu-bd">
      <el-dialog
          title="点位绑定"
          v-model="dialogVisible"
          width="610px"
          :before-close="handleClose">
        <div>

          <div class="topinput">
            <el-select v-model="value" filterable placeholder="请选择传感器" @change="search"
                       style="display: block; width: 100%;">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>

          <!--          <div class="search">-->
          <!--            <el-input v-model="input" placeholder="请输入需要匹配的测点名称" style="width: 60%"></el-input>-->
          <!--            <el-button type="primary" style="margin-left: 10px" @click="search">搜索</el-button>-->
          <!--          </div>-->
          <!-- 列表-->
          <div class="list-nr">
            <el-transfer
                filterable
                v-model="valuename"
                :data="transferData"
                :titles="['测点', '测点绑定']"
                filter-placeholder="请输入测点名称"
            ></el-transfer>
            <div style="margin: 0 auto;text-align: right;">
              <div style="margin-top: 15px;">
                <el-button type="success" @click="saveBind">
                  保存
                </el-button>
                <el-button type="danger" @click="removeEntity">
                  删除标点
                </el-button>
              </div>
            </div>
          </div>
        </div>

      </el-dialog>

    </div>

    <div class="map-con">
      <div id="cesiumContainer"></div>
    </div>


  </div>
</template>

<script>
import bjt3D from "../../../utils/bjt3DMap";
import {getImgSrc, getLayerColor, getRiskColor} from '@/utils/pointUtil'
import {addHazardSource, loadHazardSource, addLayer, removeById, getModelInfo} from '@/api/system/hazard'
import {
  selectSensorList,
  selectListBySensor,
  bind,
  getPointBind,
  mapConfig,
  cameraByUser,
  cameraBind,
  cameraByPoint,
  findAllZyDevice,
} from '@/api/system/mapconfig'
import {timeLine, key, getMapConfig} from '@/api/system/positioning'
import {listStaff} from '@/api/system/staff'

import * as Cesium from 'cesium';
import {
  addEnclosure,
  getEnclosure,
  delEnclosure,
  getInfoByModelId,
  overManAlarm,
  getOverManAlarm,
  vacanciesAlarm,
  getVacanciesAlarm,
  staticAlarm,
  getStaticAlarmAlarm,
  visitAlarm,
  getVisitAlarm,
  leaveAlarm,
  getLeaveAlarm,
  alarmDelete
} from '@/api/system/enclosure'
import {listObject} from '@/api/safework/object'


export default {
  name: "index",
  data() {
    return {
      dialogFqAdd: false,
      transferData: this.generateData(),
      valuename: [],

      radio1: '总览',
      value1: true,
      value2: true,
      visible: false,
      showfx: false,
      showdt: false,
      showqt: false,
      dialogWlAdd: false,
      showdzwl: false,
      dialogVisible: false,
      cameraDialogVisible: false,
      cameraList: [],
      cameraSelect: '',
      input: '',
      options: [],
      value: '',
      tableData: [],
      total: 100,
      pageNum: 1,
      pageSize: 5,
      checkEntityId: 0,
      tableSelection: [],
      filterMethod(v) {
        console.log(v)
        return 1;
      },
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,
      modelAngle: 0,
      maxHeight: 0,
      camera: 0,
      dormancyTime: 60 * 60 * 24,
      mapAddress: '',
      drawer: false,
      activeName: '1',
      form: reactive({
        name: '',
        xiaodouyuzhi: '',
        chaoshizhi: '',
        shexiangtou: '',
        yuanxinx: '',
        yuanxiny: '',
        banjing: '',
      }),
      FqForm: reactive({
        name: null,
        height: null,
        area: null,
      }),
      fqAreaList: [],
      alarmForm: reactive({
        name: '',
        maxCount: null,
        enclosureId: null,
        minCount: null,
        stayTime: null,
        entityIds: []
      }),
      wlForm: reactive({
        name: '',
        threshold: '',
        overtime: '',
        shexiangtou: '',
        yuanxinx: '',
        yuanxiny: '',
        banjing: '',
        modelId: null,
        polygonPointList: null,
        height: 0
      }),
      dialogCyBjpz: false,
      dialogQyBjpz: false,
      dialogCgBjpz: false,
      dialogLgBjpz: false,
      dialogJzBjpz: false,
      BTI: [],
      dialogCgPerson: false,
      cgpersonList: [],
      cgpersonChoosedProxy: [],
      cgpersonChoosed: [],
      dialogLgPerson: false,
      lgpersonList: [],
      lgpersonChoosedProxy: [],
      lgpersonChoosed: [],
    };
  },
  mounted() {
    document.getElementById('cesiumContainer').innerHTML = ''
    getMapConfig().then(res => {
      let data = res.data;
      console.log(data)
      bjt3D.init('cesiumContainer', data.mapAddress, data, () => {
      //bjt3D.init('cesiumContainer', 'http://172.16.1.126:7373/JHZY_3dTiles20220704/tileset.json', data, () => {
        this.pointAndLayerLoad()
      })
      bjt3D.pickEntity((id) => {
        getModelInfo(id).then(info => {
          this.checkEntityId = id;
          let infoData = info.data;
          if (infoData.modelType == 2) {
            console.log('这是个色块')
            getInfoByModelId(id).then(enclosure => {
              console.log(enclosure)
              if (enclosure.data) {
                this.drawer = true;
                this.form.chaoshizhi = enclosure.data.overtime
                this.form.name = enclosure.data.name
                this.form.xiaodouyuzhi = enclosure.data.threshold
              }
            })
          } else {
            switch (infoData.modelTypeId) {
              case 9:
                console.log('这是摄像头')
                this.openCameraDialog(id)
                break
              default:
                this.openDialog(id);
            }
          }
        })
      });
    });
  },
  methods: {
    enclosureDelete() {
      delEnclosure(this.checkEntityId).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除围栏成功!'
          });
          bjt3D.remove(this.checkEntityId)
        } else {
          this.$message({
            type: 'error',
            message: '删除围栏失败!原因:' + res.msg
          });
        }
        this.checkEntityId = null
        this.drawer = false
      })
    },
    alarmDeleteBtn(t) {
      let data = {
        modelId: this.checkEntityId,
        alarmType: t
      }
      alarmDelete(data).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '配置清除成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '配置清除失败!'
          });
        }
      })
    },
    handleSelectionChange(val) {
      //console.log(val);
      this.cgpersonChoosedProxy = val
    },
    lgPersonChooseTable() {
      listStaff().then(res => {
        this.lgpersonList = res.rows
        console.log(this.lgpersonList)
        // this.lgpersonList.forEach((i, index) => {
        //   this.cgpersonChoosed.forEach(async(j) => {
        //     if (i.staffId === j.staffId) {
        //       await this.$refs.cgtableRef
        //       if (this.$refs.cgtableRef) {
        //         this.$refs.cgtableRef.toggleRowSelection(i, true);
        //       }
        //     }
        //   })
        // })
        this.dialogLgPerson = true
      })
    },
    cgPersonChooseTable() {
      this.cgpersonList = []
      listStaff().then(res => {
        this.cgpersonList = res.rows
        this.cgpersonList.forEach((i, index) => {
          this.cgpersonChoosed.forEach(async (j) => {
            if (i.staffId === j.staffId) {
              await this.$refs.cgtableRef
              if (this.$refs.cgtableRef) {
                this.$refs.cgtableRef.toggleRowSelection(i, true);
              }
            }
          })
        })
        this.dialogCgPerson = true
      })
    },
    cgPersonChoose() {
      this.cgpersonChoosed = [];
      this.cgpersonList.forEach((i, index) => {
        this.cgpersonChoosedProxy.forEach((j, index) => {
          if (i.staffId === j.staffId) {
            this.cgpersonChoosed.push({staffId: i.staffId, staffNo: j.staffNo, staffName: j.staffName})
          }
        });
      })
      console.log(this.cgpersonChoosed)
      this.dialogCgPerson = false;
    },
    persondelete(val) {
      this.cgpersonChoosed.forEach((i, index) => {
        if (val === i.staffId) {
          this.cgpersonChoosed.splice(i, 1);
          this.$refs.cgtableRef.toggleRowSelection(i, false);
        }
      })
    },
    lgpersonChange(val) {
      //console.log(val);
      this.lgpersonChoosedProxy = val
    },
    lgPersonChoose() {
      this.lgpersonChoosed = [];
      this.lgpersonList.forEach((i, index) => {
        this.lgpersonChoosedProxy.forEach((j, index) => {
          if (i.staffId === j.staffId) {
            this.lgpersonChoosed.push({staffId: i.staffId, staffNo: j.staffNo, staffName: j.staffName})
          }
        });
      })
      this.dialogLgPerson = false;
    },
    Lgpersondelete(val) {
      console.log(val)
      this.lgpersonChoosed.forEach((i, index) => {
        if (val === i.staffId) {
          this.lgpersonChoosed.splice(i, 1);
          this.$refs.lgtableRef.toggleRowSelection(i, false);
        }
      })
    },
    resetModel() {
      bjt3D.offset(this.offsetX, this.offsetY, this.offsetZ);
    },
    cameraChange() {
      bjt3D.cameraChange(this.camera);
    },
    setMaxHeight() {
      bjt3D.viewer.scene.screenSpaceCameraController.maximumZoomDistance = this.maxHeight;
    },
    guizepeizhi() {
      this.drawer = true;
    },
    saveConfig() {
      let param = {
        x: this.offsetX,
        y: this.offsetY,
        z: this.offsetZ,
        cameraAngle: this.camera,
        modelAngle: this.modelAngle,
        dormancyTime: this.dormancyTime,
        mapAddress: this.mapAddress,
        maxHeight: this.maxHeight,
      }
      mapConfig(param).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: '保存成功'
          })
        }
      })
    },

    handleClick: function () {
      this.showfx = true;
      this.showdt = false;
      this.showqt = false;
      this.showdzwl = false;
      this.BTIClear();
    },
    BTIClear: function () {
      if (this.BTI.length > 0) {
        this.BTI.forEach(e => {
          bjt3D.remove(e.id);
        })
      }
    },
    dzwlClick: function () {
      let that = this
      findAllZyDevice({deviceType: "BTI"}).then(res => {
        res.data.records.forEach(e => {
          let BTI_P = bjt3D.viewer.entities.add({
            position: bjt3D.parseCartesian3({longitude: e.longitude, latitude: e.latitude}),
            point: {
              color: Cesium.Color.BLUE,
              pixelSize: 5,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
          });
          that.BTI.push(BTI_P)
        })
      })
      this.showdt = false;
      this.showfx = false;
      this.showqt = false;
      this.showdzwl = true;
    },
    dituClick: function () {
      this.BTIClear();
      this.showdt = true;
      this.showfx = false;
      this.showqt = false;
      this.showdzwl = false;
    },
    openDialogFqAdd() {
      listObject().then(res => {
        this.fqAreaList = res.rows
        this.dialogFqAdd = true;
      })
    },
    zongClick: function () {
      this.BTIClear();
      this.showdt = false;
      this.showfx = false;
      this.showqt = false;
      this.showdzwl = false;
    },
    otherClick: function () {
      this.BTIClear();
      this.showqt = true;
      this.showfx = false;
      this.showdt = false;
      this.showdzwl = false;
      getMapConfig().then(res => {
        let data = res.data;
        this.offsetZ = parseInt(data.mapOffsetZ);
        this.offsetX = parseInt(data.mapOffsetX);
        this.offsetY = parseInt(data.mapOffsetY);
        this.camera = parseInt(data.mapInitAngle);
        this.maxHeight = data.maxViewingHeight - 0;
        this.modelAngle = data.mapViewingAngle - 0;
        this.camera = data.mapInitAngle - 0;
        this.dormancyTime = data.dormancyTime - 0;
        this.mapAddress = data.mapAddress
      })
    },
    pointAndLayerLoad(type, typeId) {
      loadHazardSource(type, typeId).then((res) => {
        listObject().then(listRes => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].modelType == 1) {
              bjt3D.pointLoad(res.data[i].id, res.data[i].modelTypeId, res.data[i].modelPosition, getImgSrc(res.data[i].modelTypeId))
            } else {
              if (res.data[i].areaId) {
                listRes.rows.forEach(e => {
                  if (e.id == res.data[i].areaId) {
                    bjt3D.layerLoad1(res.data[i].id, res.data[i].modelLabel, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(getRiskColor(e.riskName)))
                  }
                })
              } else {
                bjt3D.layerLoad1(res.data[i].id, res.data[i].modelLabel, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(res.data[i].modelTypeId))
              }
            }
          }
          bjt3D.removeDefaultHandler();
        })
      })
    },
    point(type) {
      bjt3D.point(type, getImgSrc(type), (p, d, t) => {
        addHazardSource(p, d, t).then((result) => {
          console.log(result)
        });
        bjt3D.removeDefaultHandler()
      })
    },
    getLayerColorByArea() {
      let str = ''
      let type = ''
      this.fqAreaList.forEach(e => {
        if (e.id === this.FqForm.area) {
          str = e.riskName
        }
      })
      type = getRiskColor(str)
      this.layer(type)
    },
    layer(type) {
      this.dialogFqAdd = false;
      let that = this;
      bjt3D.layer(this.FqForm.height - 0, this.FqForm.name, getLayerColor(type), (layer, id) => {
        addLayer(layer, this.FqForm.name, id, type, this.FqForm.area).then((result) => {
          that.$message({
            type: 'success',
            message: '标注成功'
          });
        });
        bjt3D.removeDefaultHandler()
      })
    },
    wlAdd() {
      let that = this
      let type = 109
      this.dialogWlAdd = false
      bjt3D.layer(that.wlForm.height - 0, '', getLayerColor(type), (layer, id) => {
        that.wlForm.modelId = id;
        that.wlForm.polygonPointList = layer
        addEnclosure(that.wlForm).then(res => {
          addLayer(layer, '', id, type).then((result) => {
            that.$message({
              type: 'success',
              message: '标注成功'
            });
            that.dialogWlAdd = false
          });
          bjt3D.removeDefaultHandler()
        })
      })
    },
    dzwlLayer() {
      this.wlForm = reactive({
        name: '',
        threshold: '',
        overtime: '',
        shexiangtou: '',
        yuanxinx: '',
        yuanxiny: '',
        banjing: '',
        modelId: null,
        polygonPointList: null,
        height: 0
      })
      this.dialogWlAdd = true
    },
    openCameraDialog(id) {
      this.cameraDialogVisible = true;
      cameraByUser().then(res => {
        if (res.data) {
          res.data.forEach(item => {
            this.cameraList.push({
              label: item.equipmentCode,
              value: item.id
            })
          })

          cameraByPoint(id).then(cameraId => {
            if (cameraId.data) {
              this.cameraSelect = cameraId.data
            }
          })
        }
      })
    },
    openDialog(id) {
      this.valuename = [];
      this.transferData = [];
      this.options = [];
      this.value = '';
      selectSensorList().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.options.push({
            value: res.data[i].equipmentId,
            label: res.data[i].equipmentName
          })
        }
        getPointBind(this.checkEntityId).then(bindList => {
          if (bindList.data.length > 0) {
            this.value = bindList.data[0].sensorId;
            this.search();
          }
        })
      })
      this.dialogVisible = true;
    }
    ,
    search() {
      this.valuename = [];
      let sensorId = this.value
      selectListBySensor(sensorId).then(res => {
        this.generateData(res);
      })
    }
    ,
    handleCurrentChange(v) {
      this.pageNum = v;
      this.search();
    }
    ,
    closePoint() {
      if (!this.value2) {
        let keys = bjt3D.typePoints.keys();
        for (let i = 0; i < bjt3D.typePoints.size; i++) {
          let typePoints = bjt3D.typePoints.get(parseInt(keys.next().value));
          if (typePoints) {
            for (let i = 0; i < typePoints.length; i++) {
              bjt3D.remove(typePoints[i], null)
            }
          }
        }
      } else {
        this.pointAndLayerLoad(1, undefined)
      }
    }
    ,
    closeLayer() {
      if (!this.value1) {
        let keys = bjt3D.typeLayers.keys();
        for (let i = 0; i < bjt3D.typeLayers.size; i++) {
          let typeLayer = bjt3D.typeLayers.get(parseInt(keys.next().value));
          if (typeLayer) {
            for (let i = 0; i < typeLayer.length; i++) {
              bjt3D.remove(typeLayer[i], null)
            }
          }
        }
      } else {
        this.pointAndLayerLoad(2, undefined)
      }
    }
    ,
    removeEntity() {
      let id = this.checkEntityId;
      var that = this;
      this.$confirm('确认删除？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      }).then(function () {
        console.log(id)
        bjt3D.remove(id, () => {
          removeById(id).then(res => {
            if (res.code == 200) {
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
              that.dialogVisible = false;
            }
          })
        })
      })
    }
    ,
    selectChange(v) {
      this.tableSelection = v;
    },
    saveCamera() {
      let id = this.cameraSelect;
      cameraBind(this.checkEntityId, id).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '绑定成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '绑定失败，请重试一次。'
          });
        }
        this.cameraDialogVisible = false;
      })
    },
    saveBind() {
      let ids = this.valuename;
      console.log(ids)
      ids = [...new Set(ids)]
      bind(this.checkEntityId, this.value, ids, '').then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '绑定成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '绑定失败，请重试一次。'
          });
        }
        this.dialogVisible = false;
      })
    }
    ,
    generateData(res) {
      console.log(res)
      const data = [];
      this.valuename = [];
      if (typeof res === 'undefined') {
        return data;
      }
      let dataObj = res.data;
      dataObj.ycs.forEach(e => {
        data.push({
          label: e.ycName,
          key: e.ycNo,
          type: 'yc'
        });
      })
      dataObj.yxs.forEach(e => {
        data.push({
          label: e.yxName,
          key: e.yxNo,
          type: 'yx'
        });
      })
      dataObj.yks.forEach(e => {
        data.push({
          label: e.ykName,
          key: e.ykNo,
          type: 'yk'
        });
      })
      getPointBind(this.checkEntityId).then(list => {
        let bindList = list.data;
        if (bindList) {
          bindList.forEach(bindRow => {
            this.valuename.push(bindRow.measuringNo)
          })
        }
      })

      this.transferData = data
    },
    clearAlarmForm() {
      this.alarmForm = reactive({
        name: '',
        maxCount: null,
        enclosureId: null,
        minCount: null,
        stayTime: null,
        entityIds: []
      })
    },
    bjpzbtn() {
      this.clearAlarmForm()
      getOverManAlarm({modelId: this.checkEntityId}).then(res => {
        if (res.data) {
          this.alarmForm.name = res.data.name
          let condition = JSON.parse(res.data.conditions)
          this.alarmForm.maxCount = condition.maxCount
        }
        this.dialogCyBjpz = true
      })
    },
    vacanciesAlarmBtn() {
      this.clearAlarmForm()
      getVacanciesAlarm({modelId: this.checkEntityId}).then(res => {
        if (res.data) {
          this.alarmForm.name = res.data.name
          let condition = JSON.parse(res.data.conditions)
          this.alarmForm.minCount = condition.minCount
        }
        this.dialogQyBjpz = true
      })
    },
    leaveAlarmBtn() {
      this.clearAlarmForm()
      getLeaveAlarm({modelId: this.checkEntityId}).then(res => {
        this.lgpersonChoosed = []
        if (res.data) {
          console.log(res.data)
          this.alarmForm.name = res.data.name
          res.data.staffNames.forEach(i => {
            this.lgpersonChoosed.push({staffId: i.staffId, staffNo: i.staffNo, staffName: i.staffName})
          })
        }
        this.dialogLgBjpz = true
      })
    },
    visitAlarmBtn() {
      this.clearAlarmForm()
      getVisitAlarm({modelId: this.checkEntityId}).then(res => {
        this.cgpersonChoosed = []
        console.log(res.data)
        if (res.data) {
          this.alarmForm.name = res.data.name
          res.data.staffNames.forEach(i => {
            this.cgpersonChoosed.push({staffId: i.staffId, staffNo: i.staffNo, staffName: i.staffName})
          })
        }
        this.dialogCgBjpz = true
      })
    },
    staticAlarmBtn() {
      this.clearAlarmForm()
      getStaticAlarmAlarm({modelId: this.checkEntityId}).then(res => {
        if (res.data) {
          this.alarmForm.name = res.data.name
          let condition = JSON.parse(res.data.conditions)
          this.alarmForm.stayTime = condition.stayTime
        }
        this.dialogJzBjpz = true;
      })
    },
    currentCommit() {
      this.alarmForm.enclosureId = this.checkEntityId
      overManAlarm(this.alarmForm).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        }
        this.dialogCyBjpz = false
      })
    },
    vacanciesCommit() {
      this.alarmForm.enclosureId = this.checkEntityId
      vacanciesAlarm(this.alarmForm).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        }
        this.dialogQyBjpz = false
      })
    },
    staticCommit() {
      this.alarmForm.enclosureId = this.checkEntityId
      staticAlarm(this.alarmForm).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        }
        this.dialogJzBjpz = false
      })
    },
    visitCommit() {
      this.alarmForm.enclosureId = this.checkEntityId
      this.cgpersonChoosed.forEach(i => {
        this.alarmForm.entityIds.push(i.staffId)
      })
      console.log(this.alarmForm)
      visitAlarm(this.alarmForm).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        }
        this.dialogCgBjpz = false
      })
    },
    leaveAlarmCommit() {
      this.alarmForm.enclosureId = this.checkEntityId
      this.lgpersonChoosed.forEach(i => {
        this.alarmForm.entityIds.push(i.staffId)
      })
      console.log(this.alarmForm)
      leaveAlarm(this.alarmForm).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        }
        this.dialogLgBjpz = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}

.weilanxinxi {
  :deep(.el-drawer) {
    .el-drawer__body {
      border-top: 1px solid #dedede;
    }
  }

  :deep(.el-collapse) {
    border-top: 0;

    .el-collapse-item__header {
      position: relative
    }

    .el-collapse-item__wrap {
      border: 0;
    }
  }

  .total {
    position: absolute;
    top: 0px;
    right: 50px;
  }

  .bjpz-item {
    line-height: 48px;
    height: 48px;
    border-top: 1px solid #eee;
    cursor: pointer;

    .plusbtn {
      cursor: pointer;
      margin-right: 15px;
      font-size: 16px;
    }
  }

  .bjpz-item:last-child {
    border-bottom: 1px solid #eee;
  }
}

.tanchu-bd {
  :deep(.el-dialog__body) {
    padding: 10px 20px 30px;
  }

  .topinput {
    margin-bottom: 10px;

  }

  .search {
    .el-select {
      width: 86%;
      float: left;
    }
  }

  .list-nr {
    margin-top: 10px;

    :deep(.el-checkbox__label) {
      font-size: 14px;
    }
  }

  .pages {
    margin-top: 10px;
  }
}

.map {
  position: relative;
  width: 100%;
  height: 100%;

  .map-top {
    color: #303133;
    padding: 5px 15px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    right: 0;
    background-color: RGBA(255, 255, 255, 0.9);
    font-size: 14px;
  }

  .popup-con {
    background: #f2f2f2;
  }

  .title {
    background: #ffffff;
    font-size: 14px;
    padding: 10px 6px;
  }

  .bagfa {
    padding: 10px 10px;
  }

  .ditu-top {
    position: absolute;
    right: 8px;
    top: 45px;
    background: #f2f2f2;
    z-index: 2;

    .el-button {
      height: 50px;
      width: 70px;
      font-size: 12px;

      span {
        display: block !important;

        .ico {
          margin-bottom: 2px;
        }
      }
    }
  }

  .fxfq-top {
    position: absolute;
    right: 8px;
    top: 45px;
    background: #f2f2f2;
    z-index: 2;
  }

  .fxfq-bom {
    position: absolute;
    right: 8px;
    bottom: 45px;
    background: #f2f2f2;
    z-index: 2;
    width: 200px;
    min-height: 240px;

    .fxfqli {
      background: #FFFFFF;
      margin-bottom: 2px;
      font-size: 14px;
      line-height: 32px;
      padding: 0 4px;
    }
  }

  .other-tc {
    .fxfq-bom {
      width: 360px;
    }

    .other {
      .qt-li {
        margin-bottom: 6px;
        background: #fff;
        padding: 2px 4px;

        .qtinput {
          .el-input-number {
            width: 165px;
            margin-left: 15px;
          }
        }

        .qt-title {
          font-size: 14px;
          line-height: 32px;
        }
      }

      .tjbtn {
        margin-top: 4px;
      }
    }
  }
  .view-con {
    position: absolute;
    left: 8px;
    top: 45px;
    background: #FFFFFF;
    z-index: 2;
    width: 130px;

    .title {
      padding: 8px 5px;
      font-size: 14px;
    }

    .list {
      background: #f5f5f5;
      padding: 8px 10px;

      .el-switch {
        background: #fff;
        width: 100%;
        padding: 0 4px;
        margin-bottom: 3px;
        //line-height: 32px;
        //font-size: 14px;
        //display: block;
      }
    }
  }

  .view-huatu {
    position: absolute;
    right: 8px;
    top: 45px;
    background: #FFFFFF;
    z-index: 2;
    text-align: left;
    width: 140px;

    .title {
      padding: 8px 5px;
      font-size: 14px;
    }

    .list {
      background: #f5f5f5;
      padding: 8px 10px;
      height: 86px;

      .btn {
        background: #fff;
        margin: 0 0 3px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        padding: 0 5px;
        font-size: 14px;

        img {
          vertical-align: middle;
        }

        span {
          float: right;
        }
      }
    }
  }

  .map-con {
    height: calc(100vh - 84px)
  }

  #cesiumContainer {
    width: 100%;
  }

  .baojingpeizhi {
    .personChoosedbox {
      clear: both;
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 3px;
      height: 120px;
      overflow: auto;

      .item {
        display: inline-block;
        margin-right: 5px;
        background: #e8f6ff;
        border: 1px solid #1670ff;
        border-radius: 3px;
        padding: 0px 5px;
        color: #1670ff;
        margin: 0 5px 10px
      }

      .persondelete {
        margin-left: 5px;
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
}


</style>
