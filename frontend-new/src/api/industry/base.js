import request from '@/utils/request'

// 查询车辆位置信息列表
export function onLine(query) {
    return request({
        url: '/industry/base/onLine',
        method: 'get',
        params: query
    })
}
// 查询车辆位置信息列表
export function onLineAll(query) {
    return request({
        url: '/industry/base/onLineAll',
        method: 'get',
        params: query
    })
}

export function deptAndIndustryAreaTreeSelect(city) {
    if (city.cityNames) {
        let param = ''
        city.cityNames.forEach(i => {
            param += i + ','
        })
        param = param.slice(0, param.length - 1)
        console.log(param)
        return request({
            url: '/industry/base/deptAndIndustryAreaTreeSelect?city=' + param,
            method: 'get',
        })
    } else {
        return request({
            url: '/industry/base/deptAndIndustryAreaTreeSelect',
            method: 'get',
        })
    }
}
