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
        url: '/environment/base/alertList',
        method: 'get',
        params: param
    })
}
