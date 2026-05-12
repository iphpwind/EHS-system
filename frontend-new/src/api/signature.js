import request from '@/utils/request'

export function saveSignature(data) {
  return request({
    url: '/signatures',
    method: 'post',
    data
  })
}

export function listSignature(query) {
  return request({
    url: '/signatures',
    method: 'get',
    params: query
  })
}
