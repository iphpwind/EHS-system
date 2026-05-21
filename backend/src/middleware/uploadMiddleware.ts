import multer from 'multer'
import path from 'path'
import { Request } from 'express'

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads/videos')
require('fs').mkdirSync(uploadDir, { recursive: true })

// multer 存储配置
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir)
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // 生成唯一文件名：作业票ID_时间戳_原始文件名
    const ticketId = req.params.id || 'unknown'
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, ext)
    cb(null, `ticket_${ticketId}_${timestamp}_${baseName}${ext}`)
  }
})

// 文件过滤：只允许视频文件
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'video/mp4',
    'video/quicktime',  // .mov
    'video/x-msvideo',  // .avi
    'video/x-matroska', // .mkv
    'video/webm',
  ]
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('只允许上传视频文件（MP4、MOV、AVI、MKV、WEBM）'))
  }
}

// 创建multer实例
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB限制
  },
})

export default upload
