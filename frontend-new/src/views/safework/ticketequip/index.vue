<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="ticketequipList">
      <el-table-column label="布控球名称" align="center" prop="ballName" />
      <el-table-column label="序列号" align="center" prop="serialNumber" />
      <el-table-column label="绑定时间" align="center" prop="addTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解绑时间" align="center" prop="delTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.delTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            @click="returnHf(scope.row)"
          >监控回放</el-button>
          <el-button
            type="text"
            @click="nowHf(scope.row)"
          >实时监控</el-button>
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

    <!-- 添加或修改作业票和移动球机设备关联对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <div id="video-container"></div>
    </el-dialog>

    <el-dialog :title="title" v-model="openreturn" width="800px" append-to-body>
      <div id="video-return"></div>
    </el-dialog>
  </div>
</template>

<script setup name="Ticketequip">
import { listTicketequip, getTicketequip, delTicketequip, addTicketequip, updateTicketequip } from "@/api/safework/ticketequip";
import {getAccessToken, getUrl} from "@/api/safework/yscloud";
import EZUIKit from 'ezuikit-js';
import {listYsconfig} from "@/api/safework/ysconfig";
var player = null;

const { proxy } = getCurrentInstance();

const ticketequipList = ref([]);
const open = ref(false);
const openreturn = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const AppKey = ref("");
const Secret = ref("");
const accessToken = ref("");
const zburl = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    addUser: null,
    addTime: null,
    delTime: null,
    monitorEquipId: null,
    mainId:proxy.$route.query.mainId
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

watch(
    [openreturn,open],
    (newValue,oldValue) => {
      if(newValue.toString()=='false,false' && (oldValue.toString()=='false,true' || oldValue.toString()=='true,false')){
        player.stop();
      }
    },
    {immediate:true}
);

/** 查询作业票和移动球机设备关联列表 */
function getList() {
  ticketequipList.value=[];
  loading.value = true;
  listTicketequip(queryParams.value).then(response => {
    ticketequipList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getToken(){
  listYsconfig().then(response => {
    if(response.rows.length>0){
      Secret.value = response.rows[0].secret;
      AppKey.value = response.rows[0].appkey;
      //通过AppKey和Secret获取token
      getAccessToken({appKey:AppKey.value,appSecret:Secret.value}).then(res=>{
        accessToken.value = res.data.data.accessToken
      })
    }
  });
}

/** 新增按钮操作 */
function nowHf(row) {
  getUrl({accessToken:accessToken.value,deviceSerial:row.serialNumber}).then(re=>{
    zburl.value = re.data.data.url
    player = new EZUIKit.EZUIKitPlayer({
      id: 'video-container', // 视频容器ID
      accessToken: accessToken.value,
      url: zburl.value,
      // simple - 极简版; pcLive-pc直播；pcRec-pc回放；mobileLive-移动端直播；mobileRec-移动端回放;security - 安防版;voice-语音版;
      //template: 'simple',
      plugin: ['talk'], // 加载插件，talk-对讲
      width: 600,
      height: 400,
    });
    window.player = player;
  })
  open.value = true;
  title.value = "移动布控球";
}

/** 修改按钮操作 */
function returnHf(row) {//video-return
  getUrl({accessToken:accessToken.value,deviceSerial:row.serialNumber,type:2,startTime:row.addTime,stopTime:row.delTime}).then(re=>{
    zburl.value = re.data.data.url
    player = new EZUIKit.EZUIKitPlayer({
      id: 'video-return', // 视频容器ID
      accessToken: accessToken.value,
      url: zburl.value,
      // simple - 极简版; pcLive-pc直播；pcRec-pc回放；mobileLive-移动端直播；mobileRec-移动端回放;security - 安防版;voice-语音版;
      template: 'mobileRec',
      width: 600,
      height: 400,
    });
    window.player = player;
  })
  openreturn.value = true;
  title.value = "移动布控球";
}


getList();
getToken();
</script>
