<template>
  <div class="home">
    <div id="allmap" class="allmap" style="height:100vh"></div>

    <!-- 顶部 -->
    <div class="top">
      <div class="top-middle">赢信商贸车载GPS监控平台</div>
      <div class="top-left">
        <div style="margin-bottom: 5px;">
          <span>{{ datetime }}</span>
        </div>
        <div>
          <span>
					<iframe allowtransparency="true" frameborder="0" width="317" height="50" scrolling="no"
                  style="pointer-events: none"
                  src="//tianqi.2345.com/plugin/widget/index.htm?s=3&z=1&t=1&v=0&d=1&bd=0&k=&f=ffffff&ltf=009944&htf=cc0000&q=1&e=0&a=1&c=54511&w=317&h=28&align=left">
          </iframe>
          </span>
        </div>
      </div>
      <div class="top-right">
        车辆：<span>{{ countCar }}</span> 辆&nbsp;&nbsp;&nbsp;&nbsp;
        目的地：<span>{{ countDes }}</span> 个
      </div>
    </div>
    <!-- 右侧菜单 -->
    <div class="rightlist-btn" @click="rightlistBtn" v-if="rightlistbtn == true">
      <img src="@/assets/images/fuji/rightlist-btn.png"/>
    </div>
    <div class="rightlist">
      <el-drawer
          v-model="rightdrawer"
          :with-header="false"
          :modal="false">
        <div class="rightlist-openbtn" @click="rightlistClose">
          <img src="@/assets/images/fuji/rightlist-openbtn.png"/>
        </div>
        <div class="tit">目的地列表</div>
        <div class="table" id="table2">
          <el-table
              :data="regionList"
              height="100%"
              tripe
              style="width: 100%"
              @row-click="regionRightDetails"
          >
            <el-table-column
                type="index"
                label="序号"
                width="80">
            </el-table-column>
            <el-table-column
                prop="name"
                label="目的地名称">
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>

    <!-- 目的地详情弹出 -->
    <div class="xiangqing">
      <el-dialog
          v-model="dialogVisible"
          title="目的地详情"
          width="36%"
      >
        <div class="target">
          <el-row>
            <el-col :span="4">名称：</el-col>
            <el-col :span="20">{{ desName }}</el-col>
            <el-col :span="4">省市区：</el-col>
            <el-col :span="20">{{ desCity }}</el-col>
            <el-col :span="4">详细地址：</el-col>
            <el-col :span="20">{{ desAddress }}</el-col>
          </el-row>
        </div>
        <template #footer>
		      <span class="dialog-footer">
		        <el-button @click="dialogVisible = false">关闭</el-button>
		      </span>
        </template>
      </el-dialog>
    </div>

    <!-- 车辆详情弹出 -->
    <div class="cartanchu">
      <el-dialog
          v-model="dialogCar"
          title="车辆详情"
          width="calc(100% - 200px)"
          :modal="false"
          @opened="dialogCarOpened"
      >
        <div class="time">
          <span>时间选择</span>
          <el-date-picker
              v-model="starttime"
              value-format="YYYY-MM-DD"
              type="datetime"
              placeholder="开始时间"
          />
          <el-button class="chaxun" @click="getCarMap">查询</el-button>
          <el-button class="goback" @click="closeCarMap">返回</el-button>
        </div>
        <div id="carmap"></div>
      </el-dialog>
    </div>

  </div>


</template>

<script>
import {
  listDestination,
} from "@/api/car/destination";
import {
  currentLocation,
  currentLocationByCar,
  historicalTrack,
  GPSToBD
} from "@/api/car/carbase.js";


export default {
  name: "Index",
  data() {
    return {
      datetime: '',
      activeName: 'first',
      rightdrawer: false,
      rightlistbtn: true,
      dialogVisible: false,
      dialogCar: false,
      starttime: '',
      checkCarId: null,
      endtime: '',
      regionList: [],
      name: '',
      city: '',
      address: '',
      map: null,
      countCar: 0,
      countDes: 0,
      desName: '',
      desCity: '',
      desAddress: ''
    };
  },
  mounted: function () {
    this.$nextTick(() => {
      this.getMap();
      this.carInit();
    })
    this.dateTimer = setInterval(this.getDate, 1000);

  },
  unmounted() {
    clearInterval(this.dateTimer)
    clearInterval(this.carLocTimer)
  },
  created() {

  },
  watch: {},
  methods: {
    rightlistBtn() {
      this.rightdrawer = true;
      this.rightlistbtn = false;

    },
    rightlistClose() {
      this.rightdrawer = false;
      this.rightlistbtn = true;
    },
    regionRightDetails(row) {
      this.desName = row.name;
      this.desCity = row.city;
      this.desAddress = row.address;
      this.dialogVisible = true;
    },
    getDate() {
      //获取当前日期、时间、周几
      //当前年月日时分秒
      let yy = new Date().getFullYear();
      let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      var gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
      //当前星期
      let wk = new Date().getDay();
      let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      let week = weeks[wk];
      this.datetime = gettime + ' ' + week;
    },
    getMap() {
      var that = this;
      this.map = new BMapGL.Map('allmap');
      this.map.centerAndZoom('烟台市', 10);
      this.map.enableScrollWheelZoom(true);
      var point = new Array(); //存放标注点经纬信息的数组
      var marker = new Array(); //存放标注点对象的数组


      listDestination().then(res => {
        this.countDes = res.rows.length;
        for (let i = 0; i < res.rows.length; i++) {
          this.regionList.push({
            longitude: res.rows[i].lng,
            latitude: res.rows[i].lat,
            name: res.rows[i].name,
            id: res.rows[i].id,
            address: res.rows[i].address,
            city: res.rows[i].city
          })
        }
        for (var i = 0; i < this.regionList.length; i++) {
          var targetIcon = new BMapGL.Icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAA7CAYAAAAEorgfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGt2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyY2ZjNTE4Ny04YjQ0LTRmNzYtODA3ZC03Yzg4ZjQ1OTQ3MjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDNFMTk5QzA0RjZFMTFFRDk2MDlDNUJDNzEyQjg1MDEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjM5MTJjYTUtOTFiMi0wZTQ5LWJkZjMtY2ExMjg5MTZjMTljIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTEwLTE5VDEzOjI0OjEyKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0xMC0yMVQxMDo0OTo1NiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0xMC0yMVQxMDo0OTo1NiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmY0YzYwY2FmLTM3YTYtOGM0NS04NjA4LTVjNTNlYWZmMzA5YiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MTFDRjY5RjA2M0YxMUVEODBDMUE2NzRCRUY5MjIzRCIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkMDQxZDgzZS1jODgxLTJiNGMtYjVlMC1kNTM5ODIyYjAxNTAiIHN0RXZ0OndoZW49IjIwMjItMTAtMjFUMTA6MzQ6MDIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIzOTEyY2E1LTkxYjItMGU0OS1iZGYzLWNhMTI4OTE2YzE5YyIgc3RFdnQ6d2hlbj0iMjAyMi0xMC0yMVQxMDo0OTo1NiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5t0aIWAAAC50lEQVRoge2ZTUhUQRzAf/OebzW3Vpc+/IAoF4oyoQghIQgMRCwpqkMqFWimhRQE4aGoEKlD9AFFkSB0KbvUIYOgS9EhwkOHQA+SgVLSpUNJRpm912FbdGvfvpnnc0J4Pxh4y8z/P783/GeY3RWO47AQMf63gF9Ccd2E4roJxXUTiusmFNdNKK6bUFw3obhuQnHdhOK6CcV1E4rrJhTXTSiumwUrnqM0uudADdADLAvY4wtwkva7D2QD1MQd0QmUKUrJsATEZWDexC+Qm19OTm4pQqjKueR0ICcC01PdKmHCxz8STcA91SAJCkmWjBTyK36zeQvQRsmaMooSyZUKAiHAsWHoxQ2mp/rpuCNVLvLitugCahkfgfERv5rZOAhiJ5J1Llcq11sjwFfAmpOaHOs40TvsNUjuHLeNw9iGhW2goR2VUZIUF8exBZraEa62e3p51/iVYwkw1ku9YDBEgRrgabZB3uK20RiQkApNBCDeEZSNAru9BnjXuG2YrhupuAxsM3NfbDnES9w3YUki2wY1gxA/lzm5CXuaIV6UefJt9VDXkLnPMWHXIShY4SZ+e+7iZ671YJv3kyv7p4lc2NcCsTjs2A+RxaT1Jypgw2ZYmYDySv6J3dsChUuhvhGsaHq/bT7BNju9tOTvKl2ddcBattc2sLW6CmPWO3+bhNcD8OM7FJdCxab02OEheD8GlgUbK6EwPqvTgcE30zzsOwWMcv7SIxkdP5esx0xM1BOLqcZlZnISIpEJLKtAJUz+rnL2dBXwEjBYtRpa29QE3Xj+DAZexQAbaKP7Yq9MmMIlyxCk9kRe1IehC4vykxsSBOB5mqRQEf8180E6vzeOkRIH+CkbJi/uzD6AAvr2k8rleB9uf6NyH8/8PFccf/lUSmXmOZKnPJEr+dH03JL4K5VPn+HtqPJkGRn7qLFU3n2AW33Kk7kzn6XiGOrLos48HIdOUD+kZEXaR0V8EOgHqn0IyZDKL8VveBgK5Ujq8WgAAAAASUVORK5CYII=", new BMapGL.Size(35, 50));
          var lng = this.regionList[i].longitude;
          var lat = this.regionList[i].latitude;
          var name = this.regionList[i].name;
          var regionId = this.regionList[i].id;
          var address = this.regionList[i].address;
          var city = this.regionList[i].city;

          point[i] = new BMapGL.Point(lng, lat);

          if (regionId == 3) { //判断如果是车，使用的icon

          } else { //目的地icon
            marker[i] = new BMapGL.Marker(point[i], {
              icon: targetIcon
            });

            let opts = `<ul>
												<li>
													<span>名称：` + name + `</h5>
												</li>
												<li>
													<span>省市区：` + city + `</h5>
												</li>
												<li>
													<span>详细地址：` + address + `</span>
												</li>
											</ul>`;
            let infoWindow = new BMapGL.InfoWindow(opts);
            // 目的地添加点击事件
            marker[i].addEventListener('click', function () {
              this.openInfoWindow(infoWindow, point); // 开启信息窗口
            });
          }
          this.map.addOverlay(marker[i]);
        }
      })
    },
    carInit() {
      let that = this;
      var carIcon = new BMapGL.Icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAA7CAYAAAAEorgfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGt2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyY2ZjNTE4Ny04YjQ0LTRmNzYtODA3ZC03Yzg4ZjQ1OTQ3MjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0Q2NDNEQTI0RjZFMTFFREE2NzNCOTE2MTI2QjBDNTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YmQxM2I1MjktMjZiZS1kYzRlLTg4NDAtNjIzOTdjNTIzMThlIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTEwLTE5VDEzOjI0OjAxKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0xMC0yMVQxMDo0MjoyNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0xMC0yMVQxMDo0MjoyNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmY0YzYwY2FmLTM3YTYtOGM0NS04NjA4LTVjNTNlYWZmMzA5YiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MTFDRjY5RjA2M0YxMUVEODBDMUE2NzRCRUY5MjIzRCIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNTNiOThmMi0wMGY5LWY1NDYtODU2Yi0wYjkwYWM1MmQ3NGMiIHN0RXZ0OndoZW49IjIwMjItMTAtMjFUMTA6MTQ6MTMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJkMTNiNTI5LTI2YmUtZGM0ZS04ODQwLTYyMzk3YzUyMzE4ZSIgc3RFdnQ6d2hlbj0iMjAyMi0xMC0yMVQxMDo0MjoyNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6buMu/AAAH6UlEQVRoge2aa4xc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", new BMapGL.Size(35, 50));
      currentLocation().then(res => {
        let i = 0;
        for (let key in res.data) {
          i++;
          let params = []
          let id = res.data[key].car.id;
          params.push({
            lng: res.data[key].lng,
            lat: res.data[key].lat
          })
          GPSToBD(params).then(parse => {
            let point = new BMapGL.Point(parse.data[0].lng, parse.data[0].lat);
            let marker = new BMapGL.Marker(point, {
              icon: carIcon,
              setTop: true
            });
            //创建文本标注对象
            let labelopts = {
              position: point, // 指定文本标注所在的地理位置
              offset: new BMapGL.Size(-28, 15) // 设置文本偏移量
            };
            let label = new BMapGL.Label(res.data[key].car.carNumber, labelopts);
            label.setStyle({
              color: "#222",
              fontSize: "10px",
              backgroundColor: "transparent",
              border: "0",
              fontWeight: "bold",
              transform: "scale(0.9,0.9)"
            });

            this.map.addOverlay(label);
            // 车辆标记添加点击事件
            marker.addEventListener('click', function () {
              that.dialogCar = true;
              that.checkCarId = res.data[key].car.id
            });
            this.map.addOverlay(marker);

            this.carLocTimer = setInterval(() => {
              currentLocationByCar(id).then(newPositionRes => {
                let params = []
                params.push({
                  lng: newPositionRes.data.lng,
                  lat: newPositionRes.data.lat
                })
                GPSToBD(params).then(newParse => {
                  let newPosition = new BMapGL.Point(newParse.data[0].lng, newParse.data[0].lat);
                  marker.setPosition(newPosition);
                  this.map.addOverlay(marker);
                  label.setPosition(newPosition)
                  this.map.addOverlay(label);
                })
              })
            }, 1000 * 60)
          })
        }
        this.countCar = i;
      })
    },
    getCarMap() { //车辆轨迹地图
      let start = this.starttime + " 00:00:00"
      let end = this.starttime + " 23:59:59"
      historicalTrack(this.checkCarId, start, end).then(res => {
        var bmap = new BMapGL.Map('carmap');
        if (res.data.length > 0) {
          bmap.centerAndZoom(new BMapGL.Point(res.data[res.data.length - 1].lng, res.data[res.data.length - 1].lat), 13);
          var trackLine = new BMapGL.Polyline(res.data, {
            strokeColor: "#188fa4",//设置颜色
            strokeWeight: 8,//宽度
            strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
            enableEditing: false,//是否启用线编辑，默认为false
            enableClicking: false,//是否响应点击事件，默认为true
          });
          bmap.addOverlay(trackLine);
        }
        bmap.enableScrollWheelZoom(true);
      })
    },
    dialogCarOpened() {
      let yy = new Date().getFullYear();
      let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      this.starttime = yy + "-" + mm + "-" + dd;
      this.endtime = yy + "-" + mm + "-" + dd + " 23:59:59";
      this.$nextTick(() => {
        this.getCarMap();
      })
    },
    closeCarMap() { //关闭车辆详情，清除地图
      this.dialogCar = false;
      //this.getDefaultMap();
      document.getElementById('carmap').innerHTML = '';
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  position: relative;

  .allmap {
    width: 100%;
    height: calc(100vh - 84px) !important;
  }

  .top {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 90px;
    padding: 0 30px;
    background: url("@/assets/images/fuji/top-bg.png") no-repeat;
    background-size: 100% 100%;

    .top-left {
      padding-top: 15px;
      font-size: 14px;
      width: 50%;
      float: left;

      span {
        vertical-align: text-bottom;
        margin-left: 15px;
        color: #00ebff;
      }

      i {
        color: #00ebff;
      }
    }

    .top-right {
      float: right;
      padding: 28px 0 0;
      color: #fff;
      font-size: 18px;

      span {
        color: #00ebff;
        font-size: 30px;
        font-weight: bold;
        display: inline-block;
      }
    }

    .top-middle {
      background: url("@/assets/images/fuji/toptitle-bg.png") no-repeat;
      background-size: 100% 100%;
      font-size: 28px;
      font-weight: bold;
      padding: 15px 0;
      width: 440px;
      text-align: center;
      position: absolute;
      bottom: 10px;
      left: 50%;
      margin-left: -220px;
      color: #00ebff;
    }
  }

  .rightlist-btn {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -120px;
    cursor: pointer;
    z-index: 999;
  }

  .rightlist {

    :deep(.el-drawer) {
      width: 25% !important;
      background: url("@/assets/images/fuji/rightlist-bg.png") no-repeat;
      background-size: 100% 100%;
      box-shadow: 0 0 0 transparent;
      overflow: initial;
      padding-right: 15px;

      .rightlist-openbtn {
        position: absolute;
        top: 0;
        right: 100%;
        height: 100%;
        cursor: pointer;

        img {
          height: 100%;
        }
      }

      .tit {
        width: 200px;
        text-align: center;
        color: #00ebff;
        font-size: 18px;
        font-weight: bold;
        background: url("@/assets/images/fuji/box-title-bg.png") no-repeat center;
        background-size: contain;
        line-height: 1;
        margin: 15px 0;
      }

      i {
        display: block;
        width: 20px;
        height: 20px;
      }

      .online {
        background: url("../assets/images/online.png");
        background-size: 100%;
      }

      .outline {
        background: url("../assets/images/outline.png");
        background-size: 100%;
      }
    }
  }

  .table {
    :deep(.el-table::before) {
      display: none;
    }

    /*修改table 表体的背景颜色和文字颜色*/
    :deep(.el-table) {
      background-color: transparent;

      th,
      td, tr {
        background-color: transparent !important;
        font-size: 12px;
      }

      .el-table__expanded-cell {
        background-color: transparent !important;
      }

      // 表头背景色
      th.el-table__cell {
        color: #00ebff;
        font-weight: normal;
        padding: 5px 0;
        height: auto;
      }

      tr > td {
        color: #fff;
        padding: 5px 0;
      }

      .el-table__body tr:nth-child(odd) {
        background-color: #0a1127 !important;
      }

      th.el-table__cell.is-leaf,
      td.el-table__cell {
        border: 0;
      }

      // hover效果
      tr:hover > td {
        background-color: rgba(0, 0, 0, 0) !important;
        cursor: pointer;
      }

      tbody tr:hover > td {
        background-color: #0a1127 !important;
        // text-align: center;
      }

      // 滚动条宽高
      .el-table__body-wrapper::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      .el-table__body-wrapper::-webkit-scrollbar {
        width: 5px;
        /*滚动条宽度*/
        height: 10px;
        /*滚动条高度*/
      }

      /*定义滚动条轨道 内阴影+圆角*/
      .el-table__body-wrapper::-webkit-scrollbar-track {
        box-shadow: 0px 1px 3px #0a1127 inset;
        /*滚动条的背景区域的内阴影*/
        border-radius: 10px;
      }

      /*定义滑块 内阴影+圆角*/
      .el-table__body-wrapper::-webkit-scrollbar-thumb {
        box-shadow: 0px 1px 3px #0a1127 inset;
        border-radius: 6px;
        background-color: #0a1127;
      }
    }
  }

  .cartanchu {
    :deep(.el-dialog) {
      margin: 84px 0 0 200px !important;
      height: calc(100vh - 84px);
      box-shadow: 0 0 0 transparent;
      border-radius: 0;

      .el-dialog__header {
        background: url("@/assets/images/fuji/cardet-titbg.png");
        padding-bottom: 20px;
        width: 100%;
        position: absolute;
        z-index: 9;
      }

      .el-dialog__title {
        color: #00ebff !important;
        font-weight: bold;
        width: 200px;
        text-align: center;
        background: url("@/assets/images/fuji/box-title-bg.png") no-repeat center;
        background-size: contain;
        line-height: 1;
        display: block;
      }

      .el-dialog__body {
        padding: 0;
        height: 100%;
      }

      .el-dialog__close {
        display: none;
      }
    }

    #carmap {
      height: 100%;
    }

    .time {
      position: absolute;
      right: 20px;
      top: 13px;
      z-index: 9;
      color: #00ebff;

      span {
        margin: 0 10px;
      }

      :deep(.el-input) {
        vertical-align: middle;

        .el-input__inner {
          background: transparent;
          border: 1px solid #00ebff;
          color: #fff;
        }
      }

      .chaxun {
        background: #00ebff;
        color: #333;
        border: 1px solid #00ebff;
        margin-left: 12px;
      }

      .goback {
        border: 1px solid #00ebff;
        color: #00ebff;
        background: transparent;
      }
    }
  }

  .xiangqing {
    :deep(.el-dialog) {
      background: #151b2b;
      border: 1px solid #00ebff;

      .el-dialog__title {
        color: #00ebff;
        font-weight: bold;
      }

      .el-button {
        border: 0;
        background: #00ebff;
        color: #222;
      }
    }

    .target {
      line-height: 2;
      color: #fff;
    }
  }
}
</style>
