import request from '@/utils/request'

export function listMeterreading(query) {
    console.log(query)
    return request({
        url: '/energy/electric/meterReading',
        method: 'post',
        data: query
    })
}
