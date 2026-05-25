import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors';
import { RowDataPacket } from 'mysql2';
import { getConnection } from '../config/database';
import * as COS from 'cos-nodejs-sdk-v5';

// ============ 腾讯云 COS 配置 ============
const cosConfig = {
  SecretId: process.env.COS_SECRET_ID || '',
  SecretKey: process.env.COS_SECRET_KEY || '',
  Bucket: process.env.COS_BUCKET || '',
  Region: process.env.COS_REGION || 'ap-guangzhou',
};

// 初始化 COS 客户端
const cos = new COS.COS({
  SecretId: cosConfig.SecretId,
  SecretKey: cosConfig.SecretKey,
});

// ============ 获取上传签名（前端直传 COS 用） ============
export const getCOSUploadSignature = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, fileType, fileSize } = req.body;
  const userId = (req as any).user?.userId;

  // 验证文件大小和类型
  const maxSize = 500 * 1024 * 1024; // 500MB
  if (fileSize > maxSize) {
    return res.status(400).json({ success: false, message: '视频文件不能超过 500MB' });
  }

  if (!fileType.startsWith('video/')) {
    return res.status(400).json({ success: false, message: '只能上传视频文件' });
  }

  // 生成唯一文件名
  const ext = fileName.split('.').pop();
  const key = `training/videos/${userId}_${Date.now()}.${ext}`;

  // 返回前端直传 COS 所需的参数
  res.json({
    success: true,
    data: {
      bucket: cosConfig.Bucket,
      region: cosConfig.Region,
      key,
      // 前端使用 cos-js-sdk-v5 直传
      dir: `https://${cosConfig.Bucket}.cos.${cosConfig.Region}.myqcloud.com/`,
    }
  });
});

// ============ 视频上传成功回调（前端直传 COS 后调用） ============
export const onVideoUploaded = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { courseId, sectionId, videoUrl, videoName, videoSize, videoDuration } = req.body;

  if (!courseId || !videoUrl) {
    return res.status(400).json({ success: false, message: '参数不完整' });
  }

  let conn;
  try {
    conn = await getConnection();

    // 如果提供了 sectionId，更新章节视频地址
    if (sectionId) {
      await conn.execute(
        'UPDATE course_sections SET video_url = ?, updated_at = NOW() WHERE id = ? AND course_id = ?',
        [videoUrl, sectionId, courseId]
      );
    }

    // 记录上传日志
    await conn.execute(
      `INSERT INTO training_files (user_id, course_id, section_id, file_type, file_name, file_url, file_size, duration, created_at)
       VALUES (?, ?, ?, 'video', ?, ?, ?, ?, NOW())`,
      [userId, courseId, sectionId || null, videoName || 'video', videoUrl, videoSize || 0, videoDuration || 0]
    );

    res.json({ success: true, message: '视频上传成功（已存储到腾讯云 COS）', data: { videoUrl } });
  } catch (error) {
    console.error('视频上传回调失败:', error);
    res.status(500).json({ success: false, message: '视频上传回调失败' });
  } finally {
    if (conn) conn.release();
  }
});

// ============ 获取视频播放地址（带签名，防止盗链） ============
export const getVideoPlayAuth = asyncHandler(async (req: Request, res: Response) => {
  const { videoUrl } = req.query;

  if (!videoUrl) {
    return res.status(400).json({ success: false, message: '视频地址不能为空' });
  }

  // 从 videoUrl 中提取 COS key
  let key = videoUrl as string;
  if (key.startsWith('http')) {
    const urlObj = new URL(key);
    key = urlObj.pathname.slice(1); // 移除开头的 '/'
  }

  // 生成带签名的临时播放地址（有效期 1 小时）
  const signedUrl = cos.getObjectUrl({
    Bucket: cosConfig.Bucket,
    Region: cosConfig.Region,
    Key: key,
    Sign: true,
    Expires: 3600, // 1 小时
  });

  res.json({
    success: true,
    data: {
      playUrl: signedUrl,
      expiresIn: 3600,
    }
  });
});

// ============ 记录考试异常行为（防作弊） ============
export const logExamViolation = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { examId, violationType, violationDetail, timestamp } = req.body;

  if (!examId || !violationType) {
    return res.status(400).json({ success: false, message: '参数不完整' });
  }

  let conn;
  try {
    conn = await getConnection();

    await conn.execute(
      `INSERT INTO exam_violations (user_id, exam_id, violation_type, violation_detail, timestamp, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, examId, violationType, violationDetail || '', timestamp || Date.now()]
    );

    res.json({ success: true, message: '异常行为已记录' });
  } catch (error) {
    console.error('记录考试异常行为失败:', error);
    res.status(500).json({ success: false, message: '记录失败' });
  } finally {
    if (conn) conn.release();
  }
});

// ============ 获取考试异常行为记录（教师查看） ============
export const getExamViolations = asyncHandler(async (req: Request, res: Response) => {
  const { examId } = req.params;
  const user = (req as any).user;

  // 只有教师或管理员可以查看
  if (user.role > 2) {
    return res.status(403).json({ success: false, message: '权限不足' });
  }

  let conn;
  try {
    conn = await getConnection();

    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT v.*, u.username, u.real_name 
       FROM exam_violations v 
       LEFT JOIN users u ON v.user_id = u.id 
       WHERE v.exam_id = ? 
       ORDER BY v.timestamp DESC`,
      [examId]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('获取考试异常行为记录失败:', error);
    res.status(500).json({ success: false, message: '查询失败' });
  } finally {
    if (conn) conn.release();
  }
});
