<template>
  <div class="app-container">
		<div id="map" class="map">
		</div>
  </div>
</template>

<script setup name="Location">
import 'echarts/extension/bmap/bmap'
import { listLocation } from "@/api/industry/location";
import {parseTime} from "@/utils/ruoyi";

const { proxy } = getCurrentInstance();

const markers = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sensorId: null,
    longitude: null,
    latitude: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询车辆位置信息列表 */
function getList() {
  listLocation(queryParams.value).then(response => {
    markers.value = response.rows;
		showMap();
	})
}

function showMap(){
	  const chartmaindom = document.getElementById('map');
	  chartmaindom.removeAttribute('_echarts_instance_');
	  let myChart = proxy.echarts.init(document.getElementById('map'))
	  myChart.setOption({
	    tooltip: {
	      trigger: 'item'
	    },
	    bmap: {
	      center: [120.08633, 36.2184],
	      zoom: 12,//当前视角的缩放比例
	      roam: true
	    }
	  });
		
		var bmap = myChart.getModel().getComponent('bmap').getBMap(); 
		for(let marker of markers.value){
			var src = "";
			if(marker.num==0){
				src = "../src/assets/images/marker-huoche.png"
			}else{
				src = "../src/assets/images/marker-jingshi.gif"
			}
			var carIcon = new BMap.Icon(
				src,
				new BMap.Size(40, 40),
				{
					imageSize: new BMap.Size(28,28),
					imageOffset:new BMap.Size(0,0) 
		　　 }
			);
			var point = new BMap.Point(marker.longitude,marker.latitude);
			var mark = new BMap.Marker(point,{icon:carIcon});
			bmap.addOverlay(mark);
			let myGeo = new BMap.Geocoder();
			// 根据坐标得到地址描述
			myGeo.getLocation(point, function(result){
			    if (result){
			        marker.pjryjjx = result.address;
			    }else{
			        marker.pjryjjx = "位置地点";
			    }
			})
			mark.addEventListener("click", function(){
					var opts = {
						width: 280,     // 信息窗口宽度
						height: 280,     // 信息窗口高度
						title : marker.equipmentName // 信息窗口标题
					};
					var content = `
					<p>当前车速:&nbsp;`+ marker.speed +`km/h</p>
					<p>车辆状态:&nbsp;`+ marker.equipmentCurr == 0 ? "离线" : "在线" +`</p>
					<p>运行时长:&nbsp;`+ (marker.runTime/60/60).toFixed(2) +`小时</p>
					<p>发动机运行时长:&nbsp;`+ (marker.fdjRunTime/60/60).toFixed(2) +`小时</p>
					<p>上装运行时长:&nbsp;`+ (marker.szRunTime/60/60).toFixed(2) +`小时</p>` 
					+ (marker.num == 0 ? `<p style="color:#000">` : `<p style="color:red">`) + `告警数量:&nbsp;`+ marker.num +`个</p>
					<p>车辆位置:&nbsp;`+ marker.pjryjjx +`</p>
					<p>定位时间:&nbsp;`+ parseTime(marker.ycDt) +`</p>`;
					var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
					bmap.openInfoWindow(infoWindow, point); //开启信息窗口
				}
			);
		}
}

getList();
</script>
<style lang="scss" scoped>
.app-container{
  min-height: calc(100vh - 84px);
}
.map{
	min-height: calc(100vh - 120px);
	width: 100%;
}
</style>
