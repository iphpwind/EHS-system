import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

// 和风天气API配置
const QWEATHER_API_KEY = process.env.QWEATHER_API_KEY || 'YOUR_API_KEY'; // 需要用户配置
const QWEATHER_API_BASE = 'https://devapi.qweather.com/v7';

interface WeatherData {
  temp: number;
  feelsLike: number;
  text: string;
  icon: string;
  windDir: string;
  windScale: string;
  humidity: number;
  precip: number;
  pressure: number;
  vis: number;
  cloud: number;
}

interface WeatherForecast {
  fxDate: string;
  tempMin: number;
  tempMax: number;
  textDay: string;
  textNight: string;
  iconDay: string;
  iconNight: string;
  windDirDay: string;
  windScaleDay: string;
  humidity: number;
  precip: number;
  pressure: number;
  vis: number;
  uvIndex: number;
}

interface AirQuality {
  aqi: number;
  level: string;
  category: string;
  primary: string;
  pm10: number;
  pm2p5: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

/**
 * 获取实时天气
 * GET /api/weather/realtime
 * 参数：city (城市名称或ID，默认：烟台)
 */
export const getRealtimeWeather = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = (req.query.city as string) || '烟台';
    
    // 先获取城市ID
    const cityResponse = await axios.get(`${QWEATHER_API_BASE}/city/lookup`, {
      params: {
        location: city,
        key: QWEATHER_API_KEY,
        range: 'cn'
      }
    });

    if (!cityResponse.data.location || cityResponse.data.location.length === 0) {
      return res.status(404).json({
        success: false,
        message: '城市未找到'
      });
    }

    const cityId = cityResponse.data.location[0].id;

    // 获取实时天气
    const weatherResponse = await axios.get(`${QWEATHER_API_BASE}/weather/now`, {
      params: {
        location: cityId,
        key: QWEATHER_API_KEY
      }
    });

    const weatherData = weatherResponse.data.now;

    res.json({
      success: true,
      data: {
        city: cityResponse.data.location[0].name,
        ...weatherData,
        updateTime: weatherResponse.data.updateTime
      }
    });
  } catch (error: any) {
    console.error('获取实时天气错误:', error);
    next(error);
  }
};

/**
 * 获取天气预报（3天）
 * GET /api/weather/forecast
 * 参数：city (城市名称或ID，默认：烟台)
 */
export const getWeatherForecast = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = (req.query.city as string) || '烟台';
    
    // 先获取城市ID
    const cityResponse = await axios.get(`${QWEATHER_API_BASE}/city/lookup`, {
      params: {
        location: city,
        key: QWEATHER_API_KEY,
        range: 'cn'
      }
    });

    if (!cityResponse.data.location || cityResponse.data.location.length === 0) {
      return res.status(404).json({
        success: false,
        message: '城市未找到'
      });
    }

    const cityId = cityResponse.data.location[0].id;

    // 获取3天预报
    const forecastResponse = await axios.get(`${QWEATHER_API_BASE}/weather/3d`, {
      params: {
        location: cityId,
        key: QWEATHER_API_KEY
      }
    });

    res.json({
      success: true,
      data: {
        city: cityResponse.data.location[0].name,
        forecast: forecastResponse.data.daily
      }
    });
  } catch (error: any) {
    console.error('获取天气预报错误:', error);
    next(error);
  }
};

/**
 * 获取空气质量
 * GET /api/weather/air-quality
 * 参数：city (城市名称或ID，默认：烟台)
 */
export const getAirQuality = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = (req.query.city as string) || '烟台';
    
    // 先获取城市ID
    const cityResponse = await axios.get(`${QWEATHER_API_BASE}/city/lookup`, {
      params: {
        location: city,
        key: QWEATHER_API_KEY,
        range: 'cn'
      }
    });

    if (!cityResponse.data.location || cityResponse.data.location.length === 0) {
      return res.status(404).json({
        success: false,
        message: '城市未找到'
      });
    }

    const cityId = cityResponse.data.location[0].id;

    // 获取空气质量
    const airResponse = await axios.get(`${QWEATHER_API_BASE}/airquality/now`, {
      params: {
        location: cityId,
        key: QWEATHER_API_KEY
      }
    });

    res.json({
      success: true,
      data: {
        city: cityResponse.data.location[0].name,
        aqi: airResponse.data.now
      }
    });
  } catch (error: any) {
    console.error('获取空气质量错误:', error);
    next(error);
  }
};

/**
 * 获取综合天气数据（实时+预报+空气质量）
 * GET /api/weather/comprehensive
 * 参数：city (城市名称或ID，默认：烟台)
 */
export const getComprehensiveWeather = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = (req.query.city as string) || '烟台';
    
    // 先获取城市ID
    const cityResponse = await axios.get(`${QWEATHER_API_BASE}/city/lookup`, {
      params: {
        location: city,
        key: QWEATHER_API_KEY,
        range: 'cn'
      }
    });

    if (!cityResponse.data.location || cityResponse.data.location.length === 0) {
      return res.status(404).json({
        success: false,
        message: '城市未找到'
      });
    }

    const cityId = cityResponse.data.location[0].id;
    const cityName = cityResponse.data.location[0].name;

    // 并行获取实时天气、天气预报、空气质量
    const [weatherResponse, forecastResponse, airResponse] = await Promise.all([
      axios.get(`${QWEATHER_API_BASE}/weather/now`, {
        params: { location: cityId, key: QWEATHER_API_KEY }
      }),
      axios.get(`${QWEATHER_API_BASE}/weather/3d`, {
        params: { location: cityId, key: QWEATHER_API_KEY }
      }),
      axios.get(`${QWEATHER_API_BASE}/airquality/now`, {
        params: { location: cityId, key: QWEATHER_API_KEY }
      })
    ]);

    res.json({
      success: true,
      data: {
        city: cityName,
        realtime: weatherResponse.data.now,
        forecast: forecastResponse.data.daily,
        airQuality: airResponse.data.now,
        updateTime: weatherResponse.data.updateTime
      }
    });
  } catch (error: any) {
    console.error('获取综合天气数据错误:', error);
    next(error);
  }
};
