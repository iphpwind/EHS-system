import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

// 查询人员管理列表
export function listStaff(query) {
  return request({
    url: '/system/staff/list',
    method: 'get',
    params: query
  })
}

export function bindTagStaff(param) {
  return request({
    url: '/system/staff/bindTagStaff',
    method: 'get',
    params: param
  })
}

export function listStaffNoLog(query) {
  return request({
    url: '/system/staff/staffList',
    method: 'get',
    params: query
  })
}

// 查询人员管理列表
export function listNouserStaff(query) {
  return request({
    url: '/system/staff/listNouserStaff',
    method: 'get',
    params: query
  })
}

// 查询人员管理详细
export function getStaff(staffId) {
  return request({
    url: '/system/staff/' + parseStrEmpty(staffId),
    method: 'get'
  })
}

// 新增人员管理
export function addStaff(data) {
  return request({
    url: '/system/staff',
    method: 'post',
    data: data
  })
}

// 修改人员管理
export function updateStaff(data) {
  return request({
    url: '/system/staff',
    method: 'put',
    data: data
  })
}

// 删除人员管理
export function delStaff(staffId) {
  return request({
    url: '/system/staff/' + staffId,
    method: 'delete'
  })
}
