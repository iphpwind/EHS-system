/**
 * GB30871-2022 国标自动校验引擎
 * 在作业票提交前自动比对 national_standards 规则表
 */

import { getConnection } from '../config/database';

export interface ValidationResult {
  passed: boolean;
  total: number;
  errors: ValidationItem[];
  warnings: ValidationItem[];
}

export interface ValidationItem {
  ruleKey: string;
  severity: 'error' | 'warning';
  description: string;
  tipMessage: string;
}

/**
 * 校验作业票数据是否符合国标要求
 * @param ticketType 作业类型: hot_work/high_work/confined_space 等
 * @param ticketData 作业票提交数据
 * @returns 校验结果
 */
export async function validateStandard(
  ticketType: string,
  ticketData: Record<string, any>
): Promise<ValidationResult> {
  const result: ValidationResult = { passed: true, total: 0, errors: [], warnings: [] };

  try {
    const conn = await getConnection();
    const [rules] = await conn.execute(
      `SELECT * FROM national_standards WHERE ticket_type = ? AND enabled = 1 ORDER BY sort_order ASC`,
      [ticketType]
    );

    const ruleList = rules as any[];
    result.total = ruleList.length;

    if (ruleList.length === 0) {
      return result;
    }

    for (const rule of ruleList) {
      const { rule_key, operator, rule_value, field_path, severity, description, tip_message } = rule;
      const fieldValue = getNestedValue(ticketData, field_path);
      const violation = checkRule(fieldValue, operator, rule_value);

      const item: ValidationItem = {
        ruleKey: rule_key,
        severity,
        description,
        tipMessage: tip_message || description
      };

      if (violation) {
        if (severity === 'error') {
          result.errors.push(item);
          result.passed = false;
        } else {
          result.warnings.push(item);
        }
      }
    }
  } catch (error) {
    console.error('[StandardValidator] 校验异常:', error);
    // 规则引擎故障时不阻断业务
  }

  return result;
}

/**
 * 获取嵌套字段值 (支持 a.b.c 路径)
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj) return undefined;
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = current[key];
  }
  return current;
}

/**
 * 执行单条规则校验
 */
function checkRule(value: any, operator: string, ruleValue: string | null): boolean {
  switch (operator) {
    case 'not_empty':
      return value === undefined || value === null || value === '' ||
             (Array.isArray(value) && value.length === 0) ||
             (typeof value === 'object' && Object.keys(value).length === 0);

    case 'exists':
      return value === undefined || value === null;

    case 'eq':
      return String(value) !== String(ruleValue);

    case 'ge':
      return Number(value) < Number(ruleValue);

    case 'le':
      return Number(value) > Number(ruleValue);

    case 'contain':
      if (typeof value === 'string') {
        return !value.includes(String(ruleValue));
      }
      if (Array.isArray(value)) {
        return !value.some((v: any) =>
          typeof v === 'string' ? v.includes(String(ruleValue)) :
          typeof v === 'object' ? JSON.stringify(v).includes(String(ruleValue)) : false
        );
      }
      return true;

    case 'in':
      if (!ruleValue) return true;
      const allowed = ruleValue.split(',').map(s => s.trim());
      return !allowed.includes(String(value));

    default:
      return false;
  }
}
