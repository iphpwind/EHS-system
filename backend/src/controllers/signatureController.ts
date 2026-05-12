import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import fs from 'fs';
import path from 'path';

// 签名图片存储目录（相对于项目根目录）
const SIGN_DIR = path.resolve(__dirname, '../../uploads/signatures');

// 确保目录存在
if (!fs.existsSync(SIGN_DIR)) {
  fs.mkdirSync(SIGN_DIR, { recursive: true });
}

/**
 * 保存签字（通用）
 * POST /api/signatures
 */
export const saveSignature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      bizType,       // hot_work / confined_space / high_work 等
      bizId,         // 作业票ID
      signType,      // apply / dept_approve / safety_approve / gas_check / work / acceptance / close
      signImage,     // base64 PNG 图片
      signerName = ''
    } = req.body;

    const userId = (req as any).user?.userId;
    const userName = (req as any).user?.username || signerName;
    const ipAddress = req.ip || '';

    if (!bizType || !bizId || !signType || !signImage) {
      return res.status(400).json({ code: 400, msg: '缺少必要参数' });
    }

    // 1. 保存图片文件
    const base64Data = signImage.replace(/^data:image\/png;base64,/, '');
    const fileName = `${bizType}_${bizId}_${signType}_${Date.now()}.png`;
    const filePath = path.join(SIGN_DIR, fileName);
    fs.writeFileSync(filePath, base64Data, 'base64');

    // 2. 获取相对URL路径
    const relativePath = `/uploads/signatures/${fileName}`;

    // 3. 写入数据库
    const conn = await getConnection();
    const [result] = await conn.execute<OkPacket>(
      `INSERT INTO signatures
       (biz_type, biz_id, sign_type, signer_id, signer_name, sign_image, sign_time, ip_address, device_info)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [bizType, bizId, signType, userId, userName, relativePath, ipAddress, 'PC/Web']
    );

    // 4. 同步更新 hot_work_details 对应签字字段
    if (bizType === 'hot_work') {
      const fieldMap: Record<string, string> = {
        'risk_analysis': 'risk_analysis_sign',
        'safety_disclosure': 'safety_disclosure_sign',
        'fire_worker': 'fire_worker_sign',
        'guardian': 'guardian_sign',
        'responsible': 'responsible_sign',
        'acceptance': 'acceptance_sign'
      };
      const field = fieldMap[signType];
      if (field) {
        await conn.execute(
          `UPDATE hot_work_details SET ${field} = ?, updated_at = NOW() WHERE ticket_id = ?`,
          [relativePath, bizId]
        );
      }
    }

    res.json({
      code: 200,
      msg: '签字保存成功',
      data: { id: result.insertId, path: relativePath }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 查询签字记录
 * GET /api/signatures?bizType=hot_work&bizId=123
 */
export const getSignatures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bizType, bizId, signType } = req.query;
    const conn = await getConnection();

    let sql = 'SELECT * FROM signatures WHERE 1=1';
    const params: any[] = [];

    if (bizType) {
      sql += ' AND biz_type = ?';
      params.push(bizType);
    }
    if (bizId) {
      sql += ' AND biz_id = ?';
      params.push(bizId);
    }
    if (signType) {
      sql += ' AND sign_type = ?';
      params.push(signType);
    }

    sql += ' ORDER BY sign_time ASC';
    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单张签字图片（直接返回图片）
 * GET /api/signatures/image/:filename
 */
export const getSignatureImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(SIGN_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ code: 404, msg: '图片不存在' });
    }

    res.setHeader('Content-Type', 'image/png');
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    next(error);
  }
};
