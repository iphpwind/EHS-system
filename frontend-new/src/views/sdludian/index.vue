<template>
  <div class="ludian">
    <div class="fangda">
      <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()"><img
          src="@/assets/images/fangda.png"></i>
      <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()"><img
          src="@/assets/images/suoxiao.png"></i>
    </div>
    <div class="ludianmain">
      <img src="@/assets/images/ludian/ludian-mainpic.png" class="mainpic"/>
      <div v-for="(item,index) in industryAreaSensorList" :key="index">
        <div class="tanchubox tanchu1" @mouseenter="infotc1 = true"
             v-if="item.sensorName == '锻压-630线' || item.sensorId =='391267904486621184'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc1 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
              <!-- <span v-if="item.statusCurr == 'run'" class="green"><i></i></span>
              <span v-else-if ="item.statusCurr == 'shutdown'" class="grey"><i></i></span>
              <span v-else-if ="item.statusCurr == 'stop'" class="orange"><i></i></span>
              <span v-else class="red"><i></i></span> -->
            </div>
            <div class="info" v-show="infotc1 == true" @mouseleave="infotc1 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="tanchubox tanchu2" @mouseenter="infotc2 = true"
             v-if="item.sensorName == '锻压-1000线' || item.sensorId =='391267906013347840'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc2 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc2 == true" @mouseleave="infotc2 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="tanchubox tanchu3" @mouseenter="infotc3 = true"
             v-if="item.sensorName == '压铸-300高压线' || item.sensorId =='391267906919317504'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc3 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc3 == true" @mouseleave="infotc3 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="tanchubox tanchu4" @mouseenter="infotc4 = true"
             v-if="item.sensorName == '压铸-650高压线' || item.sensorId =='391267907183558656'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc4 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc4 == true" @mouseleave="infotc4 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu5" @mouseenter="infotc5 = true"
             v-if="item.sensorName == '压铸-低压线-1' || item.sensorId =='391267907456188416'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc5 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc5 == true" @mouseleave="infotc5 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
<!--                <p><strong>运行状态:</strong> <span class="green">运行 <i></i></span></p>-->
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
<!--                   状态：在线green,告警red,离线grey-->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu6" @mouseenter="infotc6 = true"
             v-if="item.sensorName == '碗头生产线' || item.sensorId =='435136060354179072'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc6 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc6 == true" @mouseleave="infotc6 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu7" @mouseenter="infotc7 = true"
             v-if="item.sensorName == '钢锚生产线-1#' || item.sensorId =='435136060089937920'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc7 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc7 == true" @mouseleave="infotc7 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu8" @mouseenter="infotc8 = true"
             v-if="item.sensorName == '钢锚生产线-2#' || item.sensorId =='435136059511123968'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc8 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc8 == true" @mouseleave="infotc8 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu9" @mouseenter="infotc9 = true"
             v-if="item.sensorName == '直角挂板生产线' || item.sensorId =='435136059825696768'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc9 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc9 == true" @mouseleave="infotc9 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu10" @mouseenter="infotc10 = true"
             v-if="item.sensorName == '锻造-630T 摩擦压力生产线' || item.sensorId =='435136902377484288'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc10 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc10 == true" @mouseleave="infotc10 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu11" @mouseenter="infotc11 = true"
             v-if="item.sensorName == '锻造-400生产线' || item.sensorId =='435134286796926976'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc11 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc11 == true" @mouseleave="infotc11 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2">
										<strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} 
										<span v-if="index <= 1">件</span>
										<span v-if="index > 1 && index <=4">分钟</span>
									</p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu12" @mouseenter="infotc12 = true"
             v-if="item.sensorName == '锻压160T/300T' || item.sensorId =='435136902713028608'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc12 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc12 == true" @mouseleave="infotc12 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu13" @mouseenter="infotc13 = true"
             v-if="item.sensorName == '铁制品热处理中心' || item.sensorId =='435136903270871040'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc13 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc13 == true" @mouseleave="infotc13 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu14" @mouseenter="infotc14 = true"
             v-if="item.sensorName == '等离子' || item.sensorId =='435136903556083712'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc14 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc14 == true" @mouseleave="infotc14 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu15" @mouseenter="infotc15 = true"
             v-if="item.sensorName == '铝制品热处理中心' || item.sensorId =='435136902981464064'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc15 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc15 == true" @mouseleave="infotc15 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span
                      v-if="index > 1 && index <=4">分钟</span></p>
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="tanchubox tanchu16" @mouseenter="infotc16 = true"
             v-if="item.sensorName == '激光切割打磨生产线' || item.sensorId =='435727524000178176'">
          <div :class="[item.statusCurr == 'shutdown'?'grey':'',
					item.statusCurr == 'run'?'green':'',
					item.statusCurr == 'stop'?'orange':'',
					item.statusCurr == 'warn'?'red':''
					]">
            <div class="tit" v-show="infotc16 == false">
              <h4>{{ item.sensorName }}</h4>
              <span><i></i></span>
            </div>
            <div class="info" v-show="infotc16 == true" @mouseleave="infotc16 = false">
              <h4>{{ item.sensorName }}</h4>
              <div class="infobox">
                <p><strong>运行状态:</strong> <span v-if="item.statusCurr == 'run'" class="green">运行 <i></i></span>
                  <!-- 状态：在线green,告警red,离线grey -->
                  <span v-else-if="item.statusCurr == 'shutdown' " class="grey">关机 <i></i></span>
                  <span v-else-if="item.statusCurr == 'stop'" class="orange">待机 <i></i></span>
                  <span v-else class="red">告警 <i></i></span></p>
                <p v-for="(yc,index) in item.equipmentYcList" :key="index">
                  <p v-if="index > 4 && index <9"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }}</p>
<!--                    <p v-if="index <= 2"><strong>{{ yc.ycName }}:</strong> {{ yc.ycValue }} <span v-if="index <= 1">件</span><span-->
<!--                      v-if="index > 1 && index <=4">分钟</span></p>-->
                </p>
                <p v-if="item.pro != null"><strong>生产单号:</strong> {{ item.pro.mo }}</p>
                <p v-if="item.pro != null"><strong>产品名称:</strong> {{ item.pro.product_name }}</p>
                <p v-if="item.pro != null"><strong>订单:</strong> {{ item.pro.mo_orders }}</p>
                <p v-if="item.pro != null"><strong>计划产量:</strong> {{ item.pro.qty_plan }}</p>
                <p v-if="item.pro != null"><strong>开始时间:</strong> {{ item.pro.startTime }}</p>
                <p v-if="item.pro != null"><strong>结束时间:</strong> {{ item.pro.endTime }}</p>
                <p v-if="item.pro != null"><strong>实际产量:</strong> {{ item.pro.qtyReal }}</p>
                <p v-if="item.pro != null"><strong>订单状态:</strong> {{ item.pro.status }}</p>
              </div>
            </div>
          </div>
        </div>


      </div>

    </div>
  </div>
</template>

<script>
import {listRealIndustryAreaSensor, selectLudian} from "@/api/industry/industryAreaSensor";

export default {
  name: "山东鲁电",
  data() {
    return {
      infotc1: false,
      infotc2: false,
      infotc3: false,
      infotc4: false,
      infotc5: false,
      infotc6: false,
      infotc7: false,
      infotc8: false,
      infotc9: false,
      infotc10: false,
      infotc11: false,
      infotc12: false,
      infotc13: false,
      infotc14: false,
      infotc15: false,
      infotc16: false,
      infotc17: false,
      industryAreaSensorList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        industryAreaId: null,
        deptId: '',
      },
      size: 'small',
      isFullscreen: false,
      timer: '',
    }
  },

  watch: {},
  created() {
    this.getList();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getList();
    }, 300000)
  },

  methods: {
    toggleScreen() {
      // 切换全屏r
      // 如果当前未开启 点击就开启  如果已开启 点击关闭全屏
      if (this.isFullScreen) {
        // 关闭
        document.exitFullscreen()
      } else {
        // 打开
        document.documentElement.requestFullscreen()
      }
      this.isFullScreen = !this.isFullScreen
    },
    changeSize() {
      this.toggleScreen()
      if (this.size == 'small') {
        this.size = 'big'
        document.querySelector('.sidebar-container').style = "width:0!important";
        document.querySelector('.main-container').style = "margin-left:0!important";
        document.querySelector('.app-main').style.minHeight = '100vh';
        document.querySelector('.ludian').style.minHeight = '100vh';
        document.querySelector('.ludianmain').setAttribute("class", "ludianmain quanping")
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.tags-view-container').style.display = 'none';
        document.querySelector('.hit').style.height = 'calc(100vh - 60px)';


      } else if (this.size == 'big') {
        this.size = 'small'
        document.querySelector('.sidebar-container').style.width = "";
        document.querySelector('.main-container').style.marginLeft = "";
        document.querySelector('.navbar').style.display = 'block';
        document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.ludian').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.ludianmain').setAttribute("class", "ludianmain")
        document.querySelector('.tags-view-container').style.display = 'block'
        document.querySelector('.hit').style.height = '100%';
      }
    },
    getList() {
      this.loading = true;
      listRealIndustryAreaSensor(this.queryParams).then(response => {
        console.log(response)
        this.industryAreaSensorList = response.rows;
        for (let dat of this.industryAreaSensorList) {
          let statusCurr = '';
          if (dat.equipmentYxStatusList !== undefined && dat.equipmentYxStatusList != null && dat.equipmentYxStatusList.length > 0) {
            for (let dd of dat.equipmentYxStatusList) {
              if (dd.yxstatusCode == 'run' && dd.yxCurr == 1) {
                statusCurr = 'run';
              } else if (dd.yxstatusCode == 'stop' && dd.yxCurr == 1) {
                statusCurr = 'stop';
              } else if (dd.yxstatusCode == 'warn' && dd.yxCurr == 1) {
                statusCurr = 'warn';
              }
            }
          } else if (dat.equipmentYcStatusList !== undefined && dat.equipmentYcStatusList != null && dat.equipmentYcStatusList.length > 0) {
            for (let dd of dat.equipmentYcStatusList) {
              if (dd.ycstatusCode == 'run' && dd.ycCurr == 1) {
                statusCurr = 'run';
              } else if (dd.ycstatusCode == 'stop' && dd.ycCurr == 1) {
                statusCurr = 'stop';
              } else if (dd.ycstatusCode == 'warn' && dd.ycCurr == 1) {
                statusCurr = 'warn';
              }
            }
          }
          if (statusCurr == '') {
            dat.statusCurr = 'shutdown';
          } else {
            dat.statusCurr = statusCurr;
          }
          if (dat.sensorId != null) {
            console.log(dat.sensorId)
            selectLudian(dat.sensorId).then(res => {
              console.log(res)
              if (res.data != null) {
                dat.pro = res.data
              }
            })
          }
        }
      });
    }
  },
}
</script>

<style scoped lang="scss">
.ludian {
  height: calc(100vh - 84px);
  background: url("@/assets/images/ludian/ludian-bg.jpg") no-repeat center;
  background-size: cover;

  .ludianmain {
    position: relative;
    height: 100%;

    .mainpic {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0 auto;
    }

    .tanchubox::after {

    }

    .tanchubox {
      cursor: pointer;
      position: absolute;
      background: rgba(0, 85, 190, 0.8);

      .tit {
        position: relative;
        cursor: pointer;
        // background: url("@/assets/images/ludian/ludian-tctitbg.png") no-repeat center;
        // background-size: 100% 100%;
        width: 220px;
        padding: 20px 15px;
        color: #fff;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: bold;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #fff;
        }

        span i {
          width: 10px;
          height: 10px;
          position: absolute;
          top: 15px;
          right: 14px;
          border-radius: 50%;
        }
      }

      .info {
        position: relative;
        // background: url("@/assets/images/ludian/ludian-tcbg.png") no-repeat center;
        // background-size: 100% 100%;
        width: 230px;
        padding: 12px 8px 10px 15px;

        img {
          width: 170px;
          min-height: 100%;
        }

        h4 {
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
        }

        .infobox {
          color: #fff;
          font-size: 12px;
          width: 100%;
					// max-height: 140px;overflow: auto;
					
          p {
            margin: 0;line-height: 1.3;
						// min-width: 50%;float: left;
						strong{
							color: #c6f1ff;
						}
            i {
              width: 10px;
              height: 10px;
              display: inline-block;
              border-radius: 50%;
              margin-left: 1px;
            }
          }
        }
				.infobox::before,.infobox::after{
					content: '';clear: both;display: table;
				}
				.infobox::-webkit-scrollbar {
				  width: 5px;
				  /*滚动条宽度*/
				  height: 10px;
				  /*滚动条高度*/
				}
				
				/*定义滚动条轨道 内阴影+圆角*/
				.infobox::-webkit-scrollbar-track {
				  /*滚动条的背景区域的内阴影*/
				  border-radius: 10px;
					background: #203151;
				}
				
				/*定义滑块 内阴影+圆角*/
				.infobox::-webkit-scrollbar-thumb {
				  border-radius: 6px;
				  background-color: rgba(255, 255, 255, 0.1);
				}
      }

      .tit:before, .info:before {
        content: '';
        height: 80px;
        width: 1px;
        border-left: 2px dotted #0ff5fe;
        position: absolute;
        left: -20px;
        top: 37px;
      }

      .tit::after, .info::after {
        content: '';
        width: 12px;
        height: 12px;
        background: #fff;
        border: 2px solid #0ff5fe;
        box-shadow: 0 0 10px #18acff;
        position: absolute;
        top: calc(80px + 37px);
        left: -25px;
        border-radius: 50%;
      }

      .grey::before,
      .red::before,
      .orange::before,
      .green::before {
        content: '';
        width: calc(100% - 10px);
        height: calc(100% - 10px);
        position: absolute;
        left: 5px;
        top: 5px;
        border: 2px solid #0ab7e4;
      }

      .grey::after,
      .red::after,
      .orange::after,
      .green::after {
        content: '';
        height: 1px;
        width: 22px;
        border-top: 2px dotted #0ff5fe;
        transform: rotate(-30deg);
        position: absolute;
        left: -21px;
        top: 30px;
      }

      .grey {
        background: rgba(120, 120, 120, 0.8);

        .tit:before, .info:before, .tit::after, .info::after {
          border-color: #999;
        }

        span {
          background: transparent;
        }
      }

      .grey::before, .grey::after {
        border-color: grey;
      }

      .red {
        .tit:before, .info:before, .tit::after, .info::after {
          border-color: red;
        }

        span {
          background: transparent;
        }
      }

      .red::before, .red::after {
        border-color: red;
      }

      .orange {
        background: rgba(237, 173, 0, 0.6);

        .tit:before, .info:before, .tit::after, .info::after {
          border-color: orange;
        }

        span {
          background: transparent;
        }
      }

      .orange::before, .orange::after {
        border-color: orange;
      }

      .green {
        background: rgba(0, 200, 80, 0.6);

        .tit:before, .info:before, .tit::after, .info::after {
          border-color: green;
        }

        span {
          background: transparent;
        }
      }

      .green::before, .green::after {
        border-color: green;
      }
    }

    .tanchu1 {
      top: 59%;
      left: calc(74% + 20px);
      z-index: 5;
    }

    .tanchu2 {
      top: 66%;
      left: calc(79% + 20px);
      z-index: 4;

      .tit::before, .info::before {
        height: 30px;
      }

      .tit::after, .info::after {
        top: 67px;
      }
    }

    .tanchu3 {
      top: 50%;
      left: calc(42% + 20px);
      z-index: 7;
    }

    .tanchu4 {
      left: calc(39% + 20px);
      z-index: 7;
      top: 45%;

      .tit::before, .info::before {
        height: 120px;
        top: 38px;
      }

      .tit::after, .info::after {
        top: 148px;
      }
    }

    .tanchu5 {
      top: 67%;
      left: calc(49% + 20px);

      .tit::before, .info::before {
        height: 40px;
        top: -3px;
      }

      .tit::after, .info::after {
        top: -8px;
      }
    }

    .tanchu6 {
      top: 27%;
      left: calc(20.5% + 20px);

      .tit::before, .info::before {
        height: 70px;
        top: -33px;
      }

      .tit::after, .info::after {
        top: -38px;
      }
    }

    .tanchu7 {
      top: 9%;
      left: calc(31% + 20px);
    }

    .tanchu8 {
      top: 27%;
      left: calc(36% + 20px);
      z-index: 9;

      .tit::before, .info::before {
        height: 70px;
        top: -33px;
      }

      .tit::after, .info::after {
        top: -38px;
      }
    }

    .tanchu9 {
      top: 9%;
      left: calc(45% + 20px);
    }

    .tanchu10 {
      top: 25%;
      left: calc(64% + 20px);
      z-index: 9;

      .tit::before, .info::before {
        height: 60px;
        top: 38px;
      }

      .tit::after, .info::after {
        top: 88px;
      }
    }

    .tanchu11 {
      top: 30%;
      left: calc(70% + 20px);
      z-index: 8;
    }

    .tanchu12 {
      top: 40%;
      left: calc(78% + 20px);
      z-index: 7;

      .tit::before, .info::before {
        height: 70px;
        top: -33px;
      }

      .tit::after, .info::after {
        top: -38px;
      }
    }

    .tanchu13 {
      top: 49%;
      left: calc(73% + 20px);
      z-index: 6;
    }

    .tanchu14 {
      top: 71.5%;
      left: calc(81% + 20px);

      .tit::before, .info::before {
        height: 70px;
        top: 38px;
      }

      .tit::after, .info::after {
        top: 98px;
      }
			
    }

    .tanchu15 {
      top: 40%;
      left: calc(36% + 20px);
      z-index: 8;

      .tit::before, .info::before {
        height: 160px;
      }

      .tit::after, .info::after {
        top: 197px;
      }
    }

    .tanchu16 {
      top: 70%;
      left: calc(8% + 20px);
    }

    .green i {
      background: #5de168;
      box-shadow: 0 0 10px #5de168;
    }

    .grey i {
      background: #b5b5b6;
      box-shadow: 0 0 10px #b5b5b6;
    }

    .red i {
      background: #f40000;
      box-shadow: 0 0 10px #f40000;
    }

    .orange i {
      background: #ffc000;
      box-shadow: 0 0 10px #ffc000;
    }
  }

  .fangda {
    position: absolute;
    z-index: 999;
    right: 20px;
    top: 20px;
    font-size: 18px;
    color: #2aa7d3;
  }

  .ludianmain.quanping {
    .tanchu4 {
      top: 48%;
    }

    .tanchu3 {
      top: 52%;
    }

    .tanchu1 {
      top: 64%;
    }

    .tanchu2 {
      top: 68%;
    }

    .tanchu15 {
      top: 44%;
    }

    .tanchu13 {
      top: 52%;
    }

    .tanchu11 {
      top: 31%;
    }
  }
}

//2k屏幕响应
@media screen and (min-width: 3000px) {
  .ludian {
    .ludianmain {
      .tanchu4 {
        top: 55%;
      }

      .tanchu3 {
        top: 57%;
      }

      .tanchu1 {
        top: 68%;
      }

      .tanchu2 {
        top: 71%;
      }

      .tanchu7 {
        top: 14%;
      }

      .tanchu9 {
        top: 14%;
      }

      .tanchu10 {
        top: 30%;
      }

      .tanchu11 {
        top: 37%;
      }

      .tanchu12 {
        top: 37%;
      }

      .tanchu13 {
        top: 57%;
      }

      .tanchu14 {
        top: 78%;
      }

      .tanchu15 {
        top: 53%;
      }
    }

    .ludianmain.quanping {
      .tanchu4 {
        top: 55%;
      }

      .tanchu3 {
        top: 57%;
      }

      .tanchu1 {
        top: 68%;
      }

      .tanchu2 {
        top: 71%;
      }

      .tanchu7 {
        top: 14%;
      }

      .tanchu9 {
        top: 14%;
      }

      .tanchu10 {
        top: 30%;
      }

      .tanchu11 {
        top: 37%;
      }

      .tanchu12 {
        top: 37%;
      }

      .tanchu13 {
        top: 57%;
      }

      .tanchu14 {
        top: 78%;
      }

      .tanchu15 {
        top: 53%;
      }
    }
  }

}
</style>