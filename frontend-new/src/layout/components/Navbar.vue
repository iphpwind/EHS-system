<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="getters.sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!$store.state.settings.topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="$store.state.settings.topNav"/>

    <div class="right-menu">
      <template v-if="getters.device !== 'mobile'">
        <!-- <header-search id="header-search" class="right-menu-item"/> -->

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect"/>
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect"/>
        </el-tooltip> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect"/>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip> -->
      </template>
      <div class="avatar-container">
				<!-- 版本信息弹出 -->
<!--				<div class="versionbtn" @click="versioninfo = true">版本信息</div>-->

        <!-- 告警铃铛 -->
        <div class="bell" @click="drawer = true">
          <el-badge :value="num">
            <el-icon>
              <Bell/>
            </el-icon>
          </el-badge>
        </div>

        <!-- 头像 -->
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="getters.avatar || '/src/assets/images/profile.jpg'" class="user-avatar" @error="$event.target.src='/src/assets/images/profile.jpg'"/>
            <span class="dept-name">{{ getters.user && getters.user.thirdDeptName ? getters.user.thirdDeptName : (getters.user && getters.user.dept ? getters.user.dept.deptName : '') }}</span>
            <el-icon>
              <caret-bottom/>
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="avatar-container" v-if="deptList && deptList.length > 0">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            公司切换
            <el-icon>
              <caret-bottom/>
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in deptList" :key="index" @click="toggleClick(item.deptId)">
                <span>{{ item.deptName }}</span>
              </el-dropdown-item>
              <el-dropdown-item @click="toggleClick(0)">
                <span>返回</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>

	<!-- 版本信息弹出 -->
	<div class="versioninfo">
		<el-dialog
			v-model="versioninfo"
			title="版本信息"
			width="50%"
		>
			<h3>当前版本：V3.3</h3>
      <h4>版本更新记录</h4>

      <h5>V3.3</h5>
      <p>* 新增设备运行状态</p>
      <p>* 新增车辆管理功能</p>
      <p>* 新增用电分析报告</p>

      <h5>V3.2</h5>
      <p>* 巡检内容修改</p>
      <p>* 设备运行监控大屏bug修复</p>
      <p>* 新增api接口管理</p>

      <h5>V3.1</h5>
      <p>* 修复bug</p>
      <p>* 提供系统稳定性</p>
      <p>* 优化系统流畅度</p>

      <h5>V3.0</h5>
      <p>* 新版发布</p>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="versioninfo = false">关闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>

  <!-- 告警弹出 -->
  <div class="navbardrawer">
    <el-drawer v-model="drawer" title="">
      <div class="border-p warnbox">
        <div class="r-top title ">
          <h4>
            <img src="@/assets/images/screen/tit-9.png">告警
            <div class="handlebtn" @click="warnAllHandle">全部处理</div>
          </h4>
          <!-- <span class="warnclose"><el-icon><Close/></el-icon></span> -->
        </div>
        <el-table
            :data="alramlist"
            height="calc(100vh - 100px)"
            stripe
            row-key="row"
            style="width: 100%"
            @row-click="warnclick">
          <el-table-column
              prop="eqname"
              label="智能设备名称">
          </el-table-column>
          <el-table-column
              prop="pointName"
              label="测点名称">
          </el-table-column>
          <el-table-column
              prop="state"
              label="告警内容">
          </el-table-column>
          <el-table-column
              prop="dt"
              label="告警时间">
          </el-table-column>
        </el-table>


      </div>
    </el-drawer>
  </div>

  <!-- 告警详情弹出 -->
  <div class="warndetail">
    <el-dialog
        v-model="warndetbox"
        title="告警处理"
        width="30%"
    >
      <div class="inforow">
        <el-row>
          <el-col :span="6">
            <h4>智能设备名称</h4>
          </el-col>
          <el-col :span="18">
            <div class="info">{{ eqNameClick }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="inforow">
        <el-row>
          <el-col :span="6">
            <h4>测点名称</h4>
          </el-col>
          <el-col :span="18">
            <div class="info">{{ ycNameClick }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="inforow">
        <el-row>
          <el-col :span="6">
            <h4>告警内容</h4>
          </el-col>
          <el-col :span="18">
            <div class="info">{{ alarmContent }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="inforow">
        <el-row>
          <el-col :span="6">
            <h4>告警时间</h4>
          </el-col>
          <el-col :span="18">
            <div class="info">{{ alarmDate }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="inforow">
        <el-form :model="form" label-width="120px">
          <el-row>
            <el-col :span="6">
              <h4>处理信息</h4>
            </el-col>
            <el-col :span="18">
              <el-input v-model="form.info" type="textarea"/>
            </el-col>
          </el-row>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form>
      </div>

    </el-dialog>
  </div>

</template>

<script setup>
import {ElMessageBox} from 'element-plus'
import {handler} from '@/api/system/alarm';
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import {getDeptListBySecondDeptId, saveCurrChildrenDeptId} from "@/api/system/dept";
import {totalAlarmList} from "@/api/system/alarm"

import {ref} from 'vue'

const drawer = ref(false);
const warndetbox = ref(false);
const versioninfo = ref(false);
const ycNameClick = ref('')
const eqNameClick = ref('')
const alarmContent = ref('')
const alarmDate = ref('')
const checkId = ref('')
const checkType = ref('')
const deal = ref('')
const store = useStore();
const getters = computed(() => store.getters);
const deptList = ref([]);
const {proxy} = getCurrentInstance();

const num = ref(0);
const alramlist = ref([]);

const form = reactive({
  info: '',
})

function toggleSideBar() {
  store.dispatch('app/toggleSideBar')
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function getDeptListDeptId() {
  getDeptListBySecondDeptId().then(response => {
    deptList.value = response.data;
  })
}

function gettotalAlarm() {
  // console.log(getters)
  // allAlertList().then(response => {
  //   num.value = response.total;
  //   alramlist.value = response.rows;
  //   // console.log(alramlist.value[0].dt)
  // })
}

function toggleClick(item) {
  saveCurrChildrenDeptId(item).then(response => {
    location.href = '/index';
  })
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.dispatch('LogOut').then(() => {
      location.href = '/login';
    }).catch(() => {
      // 后端退出接口失败时，前端强制清理状态并跳转
      store.dispatch('FedLogOut').then(() => {
        location.href = '/login';
      });
    });
  }).catch(() => {});
}

function warnclick(row) {
  console.log(row)
  ycNameClick.value = row.pointName;
  eqNameClick.value = row.eqname;
  alarmContent.value = row.state;
  alarmDate.value = row.dt;
  checkId.value = row.id
  deal.value = row.deal
  checkType.value = row.type
  warndetbox.value = true;
}

function onSubmit() {
  let handlerList = [{
    id: checkId.value,
    deal: deal.value,
    yuexDealbz: form.info,
    type: checkType.value
  }]
  console.log(handlerList)
  handler(handlerList).then(res => {
    warndetbox.value = false;
    gettotalAlarm()
  })
}

function warnAllHandle() {
  ElMessageBox.confirm('确定处理全部告警信息？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let handlerList = []
    alramlist.value.forEach(item => {
      handlerList.push({
        id: item.id,
        deal: item.deal,
        yuexDealbz: '',
        type: item.type
      })
    })
    handler(handlerList).then(res => {
      gettotalAlarm()
    })
  }).catch(() => {
  });
}

const emits = defineEmits(['setLayout'])

function setLayout() {
  emits('setLayout');
}

getDeptListDeptId();
gettotalAlarm();
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.module.scss";

.navbar {
  height: $base-navbar-height;
  overflow: hidden;
  position: relative;
  background: #fff;
  border-bottom: 1px solid $gray-200;

  .hamburger-container {
    line-height: $base-navbar-height;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: $base-navbar-height;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: $gray-500;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 32px;

      .versionbtn {
        cursor: pointer;
        display: inline-block;
        float: left;
        font-size: 13px;
        margin-right: 30px;
        color: $gray-400;
      }

      .bell {
        font-size: 22px;
        margin-right: 16px;
        vertical-align: middle;
        color: $blue-primary;
        display: inline-block;
        position: relative;
        cursor: pointer;
      }

      .avatar-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          object-fit: cover;
          background: #e2e8f0;
        }

        .dept-name {
          font-size: 13px;
          color: $gray-600;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        i {
          font-size: 12px;
          color: $gray-400;
        }
      }
    }
  }
}

.versioninfo :deep(.el-dialog .el-dialog__body) {
  padding: 20px;
  border-top: 1px solid #eee;
  line-height: 2;
  font-size: 15px;
  color: #555;
  max-height: calc(100vh - 220px);
  overflow: auto;

  h3 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 0 0 20px;
  }
  h4 {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 15px;
  }
  h5 {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin: 15px 0 5px;
  }
  p {
    font-size: 14px;
    line-height: 2;
    color: #555;
    margin: 0;
  }
}

.warnbox {
  background: url("@/assets/images/screen/right-3.png") no-repeat;
  background-size: 100% 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  padding: 15px 25px 15px 15px;

  .title {
    margin: 0 0 10px;
    position: relative;

    h4 {
      margin: 0;
      padding: 10px 0;
      color: #aaddff;
      line-height: 28px;

      img {
        vertical-align: middle;
      }

      .handlebtn {
        color: #06b2f1;
        border-radius: 3px;
        border: 1px solid #06b2f1;
        margin-left: 20px;
        display: inline-block;
        font-size: 12px;
        padding: 0 10px;
        line-height: 1.8;
        cursor: pointer;
      }
    }

    .warnclose {
      color: #aaddff;
      font-size: 20px;
      position: absolute;
      right: 0;
      top: 2px;
    }
  }

  :deep(.el-table__header-wrapper th) {
    background-color: #1c2e6a !important;
    text-align: center;
    color: #06b2f1;
    padding: 2px 0;
    height: 30px !important;
  }

  :deep(.el-table) {
    background: transparent;

    .el-table__inner-wrapper::before {
      display: none;
    }

    tr {
      cursor: pointer;
    }
  }

  :deep(.el-table__cell) {
    background: #071f55 !important;
    color: #FFFFFF;
    padding: 2px 0;
    border-bottom: none !important;
    text-align: center;
    font-size: 12px;
  }

  :deep(.el-table__row--striped .el-table__cell) {
    background: #12295a !important;
  }
}

.warndetail {
  .inforow {
    margin: 0 0 10px;
    line-height: 40px;

    h4 {
      margin: 0;
      line-height: 40px;
      color: #06b2f1;
    }

    .info {
      color: #fff;
    }

    :deep(.el-button) {
      display: block;
      margin: 20px auto 0;
      width: 100px;
      text-align: center;
      background: #06b2f1;
    }
  }

  :deep(.el-dialog) {
    background: #001244;

    .el-dialog__title {
      color: #fff;
    }

    .el-textarea__inner {
      background: transparent;
      color: #fff;
    }
  }
}
</style>
