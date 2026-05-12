/**
 * 自定义应用错误类
 */
export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request - 请求参数错误
 */
export class BadRequestError extends AppError {
  constructor(message: string = '请求参数错误', details?: any) {
    super(message, 400, 'BAD_REQUEST', details);
    this.name = 'BadRequestError';
  }
}

/**
 * 401 Unauthorized - 未认证
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = '未认证，请先登录', details?: any) {
    super(message, 401, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 Forbidden - 无权限
 */
export class ForbiddenError extends AppError {
  constructor(message: string = '权限不足，无法访问此资源', details?: any) {
    super(message, 403, 'FORBIDDEN', details);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found - 资源不存在
 */
export class NotFoundError extends AppError {
  constructor(message: string = '请求的资源不存在', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 Conflict - 资源冲突（如用户名已存在）
 */
export class ConflictError extends AppError {
  constructor(message: string = '资源冲突', details?: any) {
    super(message, 409, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

/**
 * 422 Unprocessable Entity - 验证错误
 */
export class ValidationError extends AppError {
  constructor(message: string = '数据验证失败', details?: any) {
    super(message, 422, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * 429 Too Many Requests - 请求过于频繁
 */
export class TooManyRequestsError extends AppError {
  constructor(message: string = '请求过于频繁，请稍后再试', details?: any) {
    super(message, 429, 'TOO_MANY_REQUESTS', details);
    this.name = 'TooManyRequestsError';
  }
}

/**
 * 500 Internal Server Error - 服务器内部错误
 */
export class InternalServerError extends AppError {
  constructor(message: string = '服务器内部错误', details?: any) {
    super(message, 500, 'INTERNAL_ERROR', details);
    this.name = 'InternalServerError';
  }
}

/**
 * 错误处理中间件
 */
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // 如果是自定义错误类
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      details: err.details,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // MySQL错误
  if (err.code && err.code.startsWith('ER_')) {
    return handleMySQLError(err, res);
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: '认证令牌无效或已过期',
      code: 'INVALID_TOKEN'
    });
  }

  // 默认服务器错误
  return res.status(500).json({
    success: false,
    message: '服务器内部错误',
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message,
      stack: err.stack 
    })
  });
};

/**
 * 处理MySQL错误
 */
const handleMySQLError = (err: any, res: any) => {
  let statusCode = 500;
  let message = '数据库操作失败';
  let code = 'DB_ERROR';

  switch (err.code) {
    case 'ER_DUP_ENTRY':
      statusCode = 409;
      message = '数据已存在，请勿重复提交';
      code = 'DUPLICATE_ENTRY';
      break;
    
    case 'ER_NO_REFERENCED_ROW_2':
      statusCode = 400;
      message = '关联的数据不存在';
      code = 'FOREIGN_KEY_CONSTRAINT';
      break;
    
    case 'ER_DATA_TOO_LONG':
      statusCode = 400;
      message = '数据超出字段长度限制';
      code = 'DATA_TOO_LONG';
      break;
    
    case 'ER_BAD_NULL_ERROR':
      statusCode = 400;
      message = '必填字段不能为空';
      code = 'NOT_NULL_VIOLATION';
      break;
    
    default:
      message = `数据库错误: ${err.code}`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { 
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState
    })
  });
};

/**
 * 异步错误捕获包装器
 * 用于包装async/await路由处理器，自动捕获错误并传递给下一个中间件
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
