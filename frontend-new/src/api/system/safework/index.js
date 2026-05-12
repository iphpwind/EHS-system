import request from '@/utils/request'

export function getSafeInvestigateTaskData(interval) {
    return request({
        url: '/safework/hazard/getSafeInvestigateTaskData/' + interval,
        method: 'get'
    })
}

export function getSafeInvestigateTaskDataNew(param) {
    return request({
        url: '/safework/hazard/getSafeInvestigateTaskData',
        data: param,
        method: 'post'
    })
}
export function getLast7DaysSafeInvestigateTaskData(param=[]) {
    return request({
        url: '/safework/hazard/getLast7DaysSafeInvestigateTaskData',
        params: param,
        method: 'get'
    })
}

export function getLast30DaysSafeInvestigateTaskData(param=[]) {
    return request({
        url: '/safework/hazard/getLast30DaysSafeInvestigateTaskData',
        params: param,
        method: 'get'
    })
}

export function getSafeHazardReportData(interval,param=[]) {
    return request({
        url: '/safework/hazard/getSafeHazardReportData/'+ interval,
        params:param,
        method: 'get'
    })
}
export function getLast7DaysSafeHazardReportData(param=[]) {
    return request({
        url: '/safework/hazard/getLast7DaysSafeHazardReportData',
        params:param,
        method: 'get'
    })
}
export function getLastDaysSafeHazardReportData30(param=[]) {
    return request({
        url: '/safework/hazard/getLastDaysSafeHazardReportData30',
        params:param,
        method: 'get'
    })
}
export function getLastDaysSafeHazardReportData7(param=[]) {
    return request({
        url: '/safework/hazard/getLastDaysSafeHazardReportData7',
        params:param,
        method: 'get'
    })
}
export function getSafeHazardReportDataByType(param=[]) {
    return request({
        url: '/safework/hazard/getSafeHazardReportDataByType',
        params:param,
        method: 'get'
    })
}
export function getHazardReportDataBySourceForEchart(param=[]) {
    return request({
        url: '/safework/hazard/getHazardReportDataBySourceForEchart',
        params:param,
        method: 'get'
    })
}
export function getHazardReportDataByLevelForEchart(param=[]) {
    return request({
        url: '/safework/hazard/getHazardReportDataByLevelForEchart',
        params:param,
        method: 'get'
    })
}
export function getHazardReportDataByLevelForEchart7(param=[]) {
    return request({
        url: '/safework/hazard/getHazardReportDataByLevelForEchart7',
        params:param,
        method: 'get'
    })
}
export function getHazardReportDataByLevelForEchart30(param=[]) {
    return request({
        url: '/safework/hazard/getHazardReportDataByLevelForEchart30',
        params:param,
        method: 'get'
    })
}


