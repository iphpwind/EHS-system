<template>
  <div class="weather-widget">
    <el-card v-loading="loading" class="weather-card">
      <template #header>
        <div class="card-header">
          <span>🌤️ 天气信息</span>
          <el-button type="text" @click="refreshWeather">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </template>

      <!-- 实时天气 -->
      <div v-if="weatherData.realtime" class="realtime-weather">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="temperature">
              <h2>{{ weatherData.realtime.temp }}°C</h2>
              <p>体感 {{ weatherData.realtime.feelsLike }}°C</p>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="weather-info">
              <h3>{{ weatherData.realtime.text }}</h3>
              <p>风速：{{ weatherData.realtime.windDir }} {{ weatherData.realtime.windScale }}级</p>
              <p>湿度：{{ weatherData.realtime.humidity }}%</p>
              <p>能见度：{{ weatherData.realtime.vis }}km</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 空气质量 -->
      <div v-if="weatherData.airQuality" class="air-quality">
        <el-divider />
        <el-row :gutter="10">
          <el-col :span="8">
            <div class="aqi-item">
              <div class="aqi-value" :class="getAqiClass(weatherData.airQuality.aqi)">
                {{ weatherData.airQuality.aqi }}
              </div>
              <div class="aqi-label">AQI</div>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="aqi-details">
              <p>空气质量：{{ weatherData.airQuality.category }}</p>
              <p>PM2.5：{{ weatherData.airQuality.pm2p5 }} μg/m³</p>
              <p>PM10：{{ weatherData.airQuality.pm10 }} μg/m³</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 3天预报 -->
      <div v-if="weatherData.forecast && weatherData.forecast.length > 0" class="forecast">
        <el-divider />
        <h4>未来3天预报</h4>
        <el-row :gutter="10">
          <el-col :span="8" v-for="(day, index) in weatherData.forecast" :key="index">
            <div class="forecast-day">
              <p class="date">{{ formatDate(day.fxDate) }}</p>
              <p class="temp">{{ day.tempMin }}°C ~ {{ day.tempMax }}°C</p>
              <p class="text">{{ day.textDay }}</p>
              <p class="wind">{{ day.windDirDay }} {{ day.windScaleDay }}级</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 更新时间 -->
      <div v-if="weatherData.updateTime" class="update-time">
        <el-divider />
        <p>更新时间：{{ weatherData.updateTime }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import request from '@/utils/request';

interface WeatherData {
  city?: string;
  realtime?: any;
  forecast?: any[];
  airQuality?: any;
  updateTime?: string;
}

const loading = ref(false);
const weatherData = ref<WeatherData>({});
const city = ref('烟台'); // 默认城市，可以改为动态获取用户所在城市

const fetchWeatherData = async () => {
  loading.value = true;
  try {
    const response: any = await request.get('/weather/comprehensive', {
      params: { city: city.value }
    });
    
    if (response.success) {
      weatherData.value = {
        city: response.data.city,
        realtime: response.data.realtime,
        forecast: response.data.forecast,
        airQuality: response.data.airQuality,
        updateTime: response.data.updateTime
      };
    } else {
      ElMessage.error('获取天气数据失败');
    }
  } catch (error) {
    console.error('获取天气数据错误:', error);
    ElMessage.error('获取天气数据失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const refreshWeather = () => {
  fetchWeatherData();
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${month}/${day} ${weekday}`;
};

const getAqiClass = (aqi: number) => {
  if (aqi <= 50) return 'aqi-excellent';
  if (aqi <= 100) return 'aqi-good';
  if (aqi <= 150) return 'aqi-light-polluted';
  if (aqi <= 200) return 'aqi-moderate-polluted';
  if (aqi <= 300) return 'aqi-heavily-polluted';
  return 'aqi-severely-polluted';
};

onMounted(() => {
  fetchWeatherData();
});
</script>

<style scoped>
.weather-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.realtime-weather {
  text-align: center;
}

.temperature h2 {
  font-size: 36px;
  margin: 0;
  color: #409eff;
}

.temperature p {
  margin: 5px 0 0 0;
  color: #666;
}

.weather-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.weather-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.air-quality {
  margin-top: 10px;
}

.aqi-item {
  text-align: center;
}

.aqi-value {
  font-size: 32px;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  color: white;
}

.aqi-excellent {
  background-color: #00e400;
}

.aqi-good {
  background-color: #ffff00;
  color: #333;
}

.aqi-light-polluted {
  background-color: #ff7e00;
}

.aqi-moderate-polluted {
  background-color: #ff0000;
}

.aqi-heavily-polluted {
  background-color: #99004c;
}

.aqi-severely-polluted {
  background-color: #7e0023;
}

.aqi-label {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.aqi-details p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.forecast {
  margin-top: 10px;
}

.forecast h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.forecast-day {
  text-align: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.forecast-day p {
  margin: 5px 0;
  font-size: 14px;
}

.date {
  font-weight: bold;
  color: #333;
}

.temp {
  color: #409eff;
  font-weight: bold;
}

.text {
  color: #666;
}

.wind {
  font-size: 12px;
  color: #999;
}

.update-time {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
