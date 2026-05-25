<template>
  <div class="emergency-map">
    <div id="map-container" style="width: 100%; height: 500px;"></div>
    <div class="map-controls">
      <el-button type="primary" @click="addEmergencyResource">添加应急资源</el-button>
      <el-button @click="locateUser">定位当前位置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getMapConfig } from '@/api/system/positioning';

interface EmergencyResource {
  id: number;
  name: string;
  type: string; // 消防栓、灭火器、应急出口、急救箱等
  longitude: number;
  latitude: number;
  description?: string;
}

const map = ref<any>(null);
const mapContainer = ref<HTMLElement | null>(null);
const resources = ref<EmergencyResource[]>([]);

// 地图API配置
const mapAK = ref(''); // 百度地图AK，从后端获取
const mapCenter = ref({ lng: 121.39, lat: 37.54 }); // 烟台市中心坐标

const initMap = async () => {
  try {
    // 获取地图配置
    const configRes: any = await getMapConfig();
    if (configRes.success) {
      mapAK.value = configRes.data.ak || 'YOUR_BAIDU_MAP_AK';
    }

    // 动态加载百度地图API
    await loadBaiduMapAPI();
    
    // 初始化地图
    map.value = new (window as any).BMapGL.Map('map-container');
    map.value.centerAndZoom(new (window as any).BMapGL.Point(mapCenter.value.lng, mapCenter.value.lat), 15);
    map.value.enableScrollWheelZoom(true);

    // 添加导航控件
    map.value.addControl(new (window as any).BMapGL.NavigationControl());
    map.value.addControl(new (window as any).BMapGL.ScaleControl());
    map.value.addControl(new (window as any).BMapGL.OverviewMapControl());

    // 加载应急资源标注
    await loadEmergencyResources();
  } catch (error) {
    console.error('初始化地图错误:', error);
    ElMessage.error('初始化地图失败');
  }
};

const loadBaiduMapAPI = () => {
  return new Promise((resolve, reject) => {
    // 检查是否已加载
    if ((window as any).BMapGL) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=${mapAK.value}&callback=onBaiduMapLoad`;
    (window as any).onBaiduMapLoad = () => {
      resolve(true);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const loadEmergencyResources = async () => {
  try {
    // 这里应该从后端API获取应急资源数据
    // 模拟数据
    const mockResources: EmergencyResource[] = [
      { id: 1, name: '消防栓-A区', type: '消防栓', longitude: 121.39, latitude: 37.54, description: 'A区车间外' },
      { id: 2, name: '灭火器-B区', type: '灭火器', longitude: 121.395, latitude: 37.545, description: 'B区仓库' },
      { id: 3, name: '应急出口-主厂房', type: '应急出口', longitude: 121.385, latitude: 37.535, description: '主厂房北侧' },
      { id: 4, name: '急救箱-办公室', type: '急救箱', longitude: 121.4, latitude: 37.55, description: '办公楼一楼' }
    ];

    resources.value = mockResources;
    addResourceMarkers(mockResources);
  } catch (error) {
    console.error('加载应急资源错误:', error);
  }
};

const addResourceMarkers = (resourceList: EmergencyResource[]) => {
  if (!map.value) return;

  resourceList.forEach(resource => {
    const point = new (window as any).BMapGL.Point(resource.longitude, resource.latitude);
    const marker = new (window as any).BMapGL.Marker(point);

    // 设置标注图标（根据资源类型）
    const iconUrl = getResourceIcon(resource.type);
    const icon = new (window as any).BMapGL.Icon(iconUrl, new (window as any).BMapGL.Size(30, 30));
    marker.setIcon(icon);

    // 添加信息窗口
    const infoWindow = new (window as any).BMapGL.InfoWindow(
      `<div>
        <h4>${resource.name}</h4>
        <p>类型：${resource.type}</p>
        <p>描述：${resource.description || '无'}</p>
        <p>坐标：${resource.longitude}, ${resource.latitude}</p>
      </div>`,
      { width: 250, height: 150, title: resource.name }
    );

    marker.addEventListener('click', () => {
      map.value.openInfoWindow(infoWindow, point);
    });

    map.value.addOverlay(marker);
  });
};

const getResourceIcon = (type: string) => {
  // 返回不同资源类型的图标URL
  const iconMap: Record<string, string> = {
    '消防栓': '@/assets/images/emergency/fire-hydrant.png',
    '灭火器': '@/assets/images/emergency/fire-extinguisher.png',
    '应急出口': '@/assets/images/emergency/emergency-exit.png',
    '急救箱': '@/assets/images/emergency/first-aid-kit.png'
  };
  return iconMap[type] || '@/assets/images/emergency/default.png';
};

const addEmergencyResource = () => {
  ElMessage.info('添加应急资源功能开发中...');
  // TODO: 实现添加应急资源的功能
};

const locateUser = () => {
  if (!map.value) return;

  ElMessage.info('正在定位...');
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPoint = new (window as any).BMapGL.Point(
          position.coords.longitude,
          position.coords.latitude
        );
        map.value.panTo(userPoint);
        
        // 添加用户位置标注
        const userMarker = new (window as any).BMapGL.Marker(userPoint);
        map.value.addOverlay(userMarker);
        
        ElMessage.success('定位成功');
      },
      (error) => {
        console.error('定位错误:', error);
        ElMessage.error('定位失败，请检查定位权限');
      }
    );
  } else {
    ElMessage.error('浏览器不支持定位功能');
  }
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map.value) {
    map.value.destroy();
  }
});
</script>

<style scoped>
.emergency-map {
  width: 100%;
  height: 100%;
}

#map-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.map-controls {
  margin-top: 10px;
  text-align: center;
}
</style>
