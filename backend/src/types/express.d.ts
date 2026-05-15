import { Request } from 'express';

// 扩展Express的Request类型，添加user属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        role: number;
      };
    }
  }
}

export {};
