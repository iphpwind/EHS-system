import video from '@/utils/videorequest'

export function push(url, param) {
    return video({
        url: url + '/api/v1/stream/start?'+param,
        method: 'get'
    })
}
export function stop(url, param) {
    return video({
        url: url + '/api/v1/stream/stop?'+param,
        method: 'get'
    })
}


