import request from '@/utils/request'

export function allCompany() {
    return request({
        url: '/energy/electricBasic/allCompany',
        method: 'get',
    })
}