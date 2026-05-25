import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getRealtimeWeather,
  getWeatherForecast,
  getAirQuality,
  getComprehensiveWeather
} from '../controllers/weatherController';

const router = Router();

/**
 * 获取实时天气
 * GET /api/weather/realtime
 * 参数：city (城市名称，默认：烟台)
 */
router.get('/realtime', authenticateToken, getRealtimeWeather);

/**
 * 获取天气预报（3天）
 * GET /api/weather/forecast
 * 参数：city (城市名称，默认：烟台)
 */
router.get('/forecast', authenticateToken, getWeatherForecast);

/**
 * 获取空气质量
 * GET /api/weather/air-quality
 * 参数：city (城市名称，默认：烟台)
 */
router.get('/air-quality', authenticateToken, getAirQuality);

/**
 * 获取综合天气数据（实时+预报+空气质量）
 * GET /api/weather/comprehensive
 * 参数：city (城市名称，默认：烟台)
 */
router.get('/comprehensive', authenticateToken, getComprehensiveWeather);

export default router;
