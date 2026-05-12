import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface CompanyInfo extends RowDataPacket {
  id: number; name: string; code?: string; address?: string;
  legal_person?: string; contact_phone?: string; email?: string;
}

export const getCompanyInfo = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<CompanyInfo[]>('SELECT * FROM enterprise_info LIMIT 1');
  res.json({ success: true, data: rows[0] || null });
});

export const updateCompanyInfo = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<CompanyInfo[]>('SELECT id FROM enterprise_info LIMIT 1');
  const { name, code, address, legal_person, contact_phone, email, website, established_date, business_scope, logo_url } = req.body;
  if (rows.length > 0) {
    await conn.execute(
      'UPDATE enterprise_info SET name=?, code=?, address=?, legal_person=?, contact_phone=?, email=?, website=?, established_date=?, business_scope=?, logo_url=? WHERE id=?',
      [name, code || null, address || null, legal_person || null, contact_phone || null, email || null, website || null, established_date || null, business_scope || null, logo_url || null, rows[0].id]
    );
  } else {
    await conn.execute<ResultSetHeader>(
      'INSERT INTO enterprise_info (name, code, address, legal_person, contact_phone, email, website, established_date, business_scope, logo_url) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [name, code || null, address || null, legal_person || null, contact_phone || null, email || null, website || null, established_date || null, business_scope || null, logo_url || null]
    );
  }
  res.json({ success: true, message: '企业信息更新成功' });
});
