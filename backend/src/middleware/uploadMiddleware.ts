/**
 * 图片上传中间件（Phase 3.1 隐患排查模块增强）
 * 功能：限制图片大小（5MB）、添加水印（使用 sharp）
 */
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads/hazards');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// 文件过滤：只允许图片
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件（JPEG, PNG, GIF, WebP）'), false);
  }
};

// 创建 multer 实例（限制 5MB）
export const uploadHazardImages = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // 最多 5 个文件
  }
});

/**
 * 添加水印到图片（使用 sharp）
 * @param filePath 图片文件路径
 * @param watermarkText 水印文字（默认：EHS 系统 + 时间戳）
 */
export const addWatermark = async (filePath: string, watermarkText?: string): Promise<string> => {
  try {
    const text = watermarkText || `EHS 系统 | ${new Date().toLocaleString('zh-CN')}`;
    
    // 读取原始图片
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('无法获取图片尺寸');
    }
    
    // 创建水印 SVG
    const svgText = `
      <svg width="${metadata.width}" height="${metadata.height}">
        <text x="20" y="${metadata.height - 20}" 
              font-family="Arial, sans-serif" 
              font-size="${Math.max(20, metadata.width / 50)}" 
              fill="rgba(255, 255, 255, 0.5)" 
              stroke="rgba(0, 0, 0, 0.3)" 
              stroke-width="1">
          ${text}
        </text>
      </svg>`;
    
    const svgBuffer = Buffer.from(svgText);
    
    // 添加水印
    await image
      .composite([{ input: svgBuffer, top: 0, left: 0 }])
      .toFile(filePath + '.watermarked' + path.extname(filePath));
    
    // 替换原始文件
    fs.unlinkSync(filePath);
    fs.renameSync(filePath + '.watermarked' + path.extname(filePath), filePath);
    
    return filePath;
  } catch (error) {
    console.error('添加水印失败:', error);
    throw error;
  }
};

/**
 * 处理上传后的图片（添加水印）
 */
export const processUploadedImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return next();
    }
    
    const files = req.files as Express.Multer.File[];
    
    // 为每个上传的图片添加水印
    for (const file of files) {
      await addWatermark(file.path);
    }
    
    next();
  } catch (error) {
    console.error('处理上传图片失败:', error);
    next(error);
  }
};

/**
 * 格式化上传响应
 */
export const formatUploadResponse = (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).json({ code: 400, msg: '没有上传文件' });
  }
  
  const files = req.files as Express.Multer.File[];
  const filePaths = files.map(file => `/uploads/hazards/${file.filename}`);
  
  res.json({
    code: 200,
    msg: '上传成功（已添加水印，GB 30871-2022 合规）',
    data: {
      files: filePaths,
      count: files.length
    }
  });
};
