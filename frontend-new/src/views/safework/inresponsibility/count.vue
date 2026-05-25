<template>
  <div class="report" v-loading="loading">
    <div class="reportbox">
      <div class="tit">{{ deptName }}安全包保责任人排查情况</div>
      <table>
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td rowspan="2">序号</td>
          <td colspan="2" rowspan="2">对象名称</td>
          <td colspan="2">总排查任务</td>
          <td colspan="2">主要负责人</td>
          <td colspan="2">技术负责人</td>
          <td colspan="2">操作负责人</td>
          <td colspan="2">隐患数量</td>
        </tr>
        <tr>
          <td>完成任务数</td>
          <td>完成率</td>
          <td>完成任务数</td>
          <td>完成率</td>
          <td>完成任务数</td>
          <td>完成率</td>
          <td>完成任务数</td>
          <td>完成率</td>
          <td>发现隐患数量</td>
          <td>完成整改数量</td>
        </tr>
        <tr v-for="(item,index) in taskList">
          <td colspan="1">{{index+1}}</td>
          <td colspan="2">{{item.objectName}}</td>
          <td>{{item.wanchengtask}}</td>
          <td>{{ ((item.wanchengtask/item.countTask)*100).toFixed(2)}}%</td>
          <td>{{item.mainfzr}}</td>
          <td>{{ ((item.mainfzr/item.countTask)*100).toFixed(2)}}%</td>
          <td>{{item.jishufzr}}</td>
          <td>{{ ((item.jishufzr/item.countTask)*100).toFixed(2)}}%</td>
          <td>{{item.operatefzr}}</td>
          <td>{{ ((item.operatefzr/item.countTask)*100).toFixed(2)}}%</td>
          <td>{{item.faxianyh}}</td>
          <td>{{item.wanchengzg}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { listByObject } from "@/api/safework/task";

const loading = ref(false);
const title = ref('');
const attAddress = ref([]);
const Camerashow = ref(false);
const form = ref({});
const taskList = ref([]);
const deptName = ref('');

const userStore = useUserStore()

onMounted(() => {
  deptName.value = userStore.user?.dept?.deptName || '';
  getList();
})

/** 查询隐患排查任务列表 */
function getList() {
  listByObject().then(response => {
    taskList.value = response.rows;
  });
}
</script>

<style scoped lang="scss">
.report{
  padding: 0 15px;
}
.tit{
  text-align: center;font-weight: bold;
  font-size: 20px;margin:20px 0;
  position: relative;
}
.topbtn{
  float: right;color: #fff;
  background: #09bec5;border-radius: 3px;padding: 5px 10px;
  border: 0;cursor: pointer;
  z-index: 999;position: relative;outline: none;
}
.localpic{
  width: 80%;max-width: 950px;
  margin: 0 auto 20px;
}
.reportbox table{
  margin: 0 auto 20px;width: 80%;
  max-width: 950px;
  border-collapse: collapse;
  td{
    border:1px solid #aaa;padding: 5px 10px;
    line-height: 2;font-size: 14px;
  }
  .noborder-lf{
    border-left: 0;
  }
  .noborder-rt{
    border-right: 0;
  }
  .noborder-tp{
    border-top: 0;
  }
  .noborder-bt{
    border-bottom: 0;
  }
  .noborder{
    border: 0;
  }
  .jingshi{
    display: inline-block;
  }
  .qianming{
    height: 30px;
  }
  tr.tablelayout{
    border: 0;
    td{
      border: 0;
    }
  }
}
@media print {
  .reportbox table{
    width: 100%;
  }
  .localpic{
    width: 100%;
  }
}
</style>
