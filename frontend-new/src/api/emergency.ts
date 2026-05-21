import request from '@/utils/request';

// 应急管理 API

// ============ 应急物资 ============

/**
 * 获取应急物资列表
 */
export function getSuppliesList(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  type?: string;
}) {
  return request({
    url: '/api/emergency/supplies',
    method: 'get',
    params
  });
}

/**
 * 创建应急物资
 */
export function createSupply(data: {
  name: string;
  supplyType?: string;
  specification?: string;
  quantity?: number;
  unit?: string;
  location?: string;
  responsiblePerson?: string;
  contactPhone?: string;
  expireDate?: string;
  supplier?: string;
  minAlertQuantity?: number;
}) {
  return request({
    url: '/api/emergency/supplies',
    method: 'post',
    data
  });
}

/**
 * 更新应急物资
 */
export function updateSupply(id: number, data: any) {
  return request({
    url: `/api/emergency/supplies/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除应急物资
 */
export function deleteSupply(id: number) {
  return request({
    url: `/api/emergency/supplies/${id}`,
    method: 'delete'
  });
}

// ============ 应急通讯录 ============

/**
 * 获取应急通讯录
 */
export function getContactsList(params?: { type?: string }) {
  return request({
    url: '/api/emergency/contacts',
    method: 'get',
    params
  });
}

/**
 * 创建应急联系人
 */
export function createContact(data: {
  contactType?: string;
  name: string;
  department?: string;
  position?: string;
  phone: string;
  priority?: number;
}) {
  return request({
    url: '/api/emergency/contacts',
    method: 'post',
    data
  });
}

// ============ 法律法规 ============

/**
 * 获取法律法规列表
 */
export function getLawList(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  typeId?: number;
  level?: string;
}) {
  return request({
    url: '/api/emergency/laws',
    method: 'get',
    params
  });
}

/**
 * 获取法律法规分类
 */
export function getLawTypes() {
  return request({
    url: '/api/emergency/law-types',
    method: 'get'
  });
}

/**
 * 创建法律法规
 */
export function createLaw(data: {
  title: string;
  documentNo?: string;
  lawTypeId?: number;
  issuingAuthority?: string;
  publishDate?: string;
  effectiveDate?: string;
  level?: string;
  content?: string;
  summary?: string;
  keywords?: string;
}) {
  return request({
    url: '/api/emergency/laws',
    method: 'post',
    data
  });
}

// ============ 隐患举报 ============

/**
 * 获取隐患举报列表
 */
export function getHazardReportList(params: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  return request({
    url: '/api/emergency/hazard-reports',
    method: 'get',
    params
  });
}

/**
 * 提交隐患举报
 */
export function createHazardReport(data: {
  hazardLocation: string;
  hazardDescription: string;
  hazardType?: string;
  hazardLevel?: string;
  isAnonymous?: boolean;
  reporterName?: string;
}) {
  return request({
    url: '/api/emergency/hazard-reports',
    method: 'post',
    data
  });
}

// 物资类型
export const SUPPLY_TYPE = {
  PROTECTIVE: 'protective',
  RESCUE: 'rescue',
  MEDICAL: 'medical',
  FIRE: 'fire',
  OTHER: 'other'
};

export const SUPPLY_TYPE_TEXT: Record<string, string> = {
  protective: '防护用品',
  rescue: '救援设备',
  medical: '医疗救护',
  fire: '消防器材',
  other: '其他'
};

// 联系人类型
export const CONTACT_TYPE = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
  GOVERNMENT: 'government'
};

export const CONTACT_TYPE_TEXT: Record<string, string> = {
  internal: '内部人员',
  external: '外部机构',
  government: '政府部门'
};

// 法规级别
export const LAW_LEVEL = {
  NATIONAL: 'national',
  PROVINCIAL: 'provincial',
  CITY: 'city',
  ENTERPRISE: 'enterprise'
};

export const LAW_LEVEL_TEXT: Record<string, string> = {
  national: '国家法规',
  provincial: '省级法规',
  city: '市级法规',
  enterprise: '企业制度'
};
