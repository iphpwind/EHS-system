import request from '@/utils/request'

export function alarmList(pageNum, pageSize, startTime, endTime) {
    let param;
    if (typeof startTime !== 'undefined') {
        let parseStartMonth = (startTime.getMonth() + 1) < 10 ? '0' + (startTime.getMonth() + 1) : (startTime.getMonth() + 1);
        let parseStartDate = startTime.getDate() < 10 ? '0' + startTime.getDate() : startTime.getDate()
        let parseEndMonth = (endTime.getMonth() + 1) < 10 ? '0' + (endTime.getMonth() + 1) : (endTime.getMonth() + 1);
        let parseEndDate = endTime.getDate() < 10 ? '0' + endTime.getDate() : endTime.getDate()
        param = {
            pageNum: pageNum,
            pageSize: pageSize,
            startTime: startTime.getFullYear() + '-' + parseStartMonth + '-' + parseStartDate,
            endTime: endTime.getFullYear() + '-' + parseEndMonth + '-' + parseEndDate + ' 23:59:59'
        }
    } else {
        param = {
            pageNum: pageNum,
            pageSize: pageSize,
        }
    }
    return request({
        url: '/energy/electric/alertList',
        method: 'get',
        params: param
    })
}
export function totalAlarmList(deal){
    let param = {
        deal:deal
    }
    return request({
        url: '/energy/electric/totalAlarmList',
        method: 'get',
        params: param
    })
}

export function handler(list, content) {
    return request({
        url: '/energy/electric/alarmHandler',
        method: 'post',
        data: {
            list: list,
            content: content
        }
    })
}

// export function allAlertList(list, content) {
//     return request({
//         url: '/energy/electric/allAlertList',
//         method: 'get',
//         params: {
//             pageNum: 1,
//             pageSize: 10000,
//         }
//     })
// }
