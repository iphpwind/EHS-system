import request from '@/utils/request'


export function timeLine(id, startTime, endTime) {
    return request({
        url: '/positioning/position/selectUserTimeLineByTime',
        method: 'post',
        data: {
            tagId: id,
            startTime: startTime,
            endTime: endTime
        }
    });
}

export function timeLineByAlarmId(id) {
    return request({
        url: '/positioning/position/selectUserListTimeLineByGatherAlarm',
        method: 'get',
        params: {
            id: id,
        }
    });
}

export function key() {
    return request({
        url: '/positioning/position/buildSocketKey',
        method: 'get',
    });
}

export function getMapConfig() {
    return request({
        url: '/positioning/basic/mapConfig',
        method: 'get',
    });
}

export function getChildrenMapConfig(id) {
    return request({
        url: '/positioning/basic/childrenMapConfig',
        method: 'get',
        params: {
            id: id
        }
    });
}

export function lastLocation(data) {
    return request({
        url: '/positioning/position/lastLocation',
        method: 'get',
        params: data
    });
}

export function lastLocationByDept() {
    return request({
        url: '/positioning/position/lastLocationByDept',
        method: 'get',
    });
}

export function allCompany() {
    return request({
        url: '/positioning/position/allCompany',
        method: 'get',
    });
}

export function staffCountByEnclosure() {
    return request({
        url: '/positioning/position/staffCountByEnclosure',
        method: 'get',
    });
}

export function countByStaff() {
    return request({
        url: '/positioning/position/countByStaff',
        method: 'get',
    });
}
