import { Request } from 'express';

// 扩展Express的Request类型，添加user属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        role: number;
        department_id?: number | null;  // ✅ P0新增
        roleId?: number;              // ✅ P0新增（新 RBAC 主角色）
      };
    }
  }
}

export {};
