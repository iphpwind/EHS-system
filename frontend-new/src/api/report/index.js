import request from '@/utils/request'

// 查询用电分析报告 能耗总览
export function analysisReport(query) {
    return request({
        url: '/energy/electric/analysisReport',
        method: 'get',
        params: query
    })
}
// 查询用电分析报告 告警总数
export function analysisReportAlertTotal(query) {
    return request({
        url: '/energy/electric/analysisReportAlertTotal',
        method: 'get',
        params: query
    })
}
// 查询用电分析报告 日能耗分析
export function getReportTimePowerByArea(query) {
    return request({
        url: '/energy/timePower/getReportTimePowerByArea',
        method: 'get',
        params: query
    })
}
// 查询用电分析报告 日能耗分析
export function getReportTimePowerRankByArea(query) {
    return request({
        url: '/energy/timePower/getReportTimePowerRankByArea',
        method: 'get',
        params: query
    })
}
// 查询用电分析报告 异常报告
export function analysisReportAlertDetail(query) {
    return request({
        url: '/energy/electric/analysisReportAlertDetail',
        method: 'get',
        params: query
    })
}
// 查询用电分析报告 异常报告
export function analysisReportAlertRank(query) {
    return request({
        url: '/energy/electric/analysisReportAlertRank',
        method: 'get',
        params: query
    })
}