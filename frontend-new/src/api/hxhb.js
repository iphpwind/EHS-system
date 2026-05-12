import request from '@/utils/request'

export function getNongmiji(equipId) {
	return request({
		url: '/sensor/ecu/data/'+equipId,
		method: 'post',
	})
}

export function getJiayao(equipId) {
	return request({
		url: '/sensor/ecu/data/'+equipId,
		method: 'post'
	})
}

export function getDaishi(equipId) {
	return request({
		url: '/sensor/ecu/data/'+equipId,
		method: 'post'
	})
}

export function getDf(equipId){
	return request({
		url: '/sensor/ecu/data/'+equipId,
		method: 'post'
	})
}

export function ctl(equipId,tagNo,state){
	return request({
		url: '/sensor/ecu/ctl/'+equipId+'/'+tagNo+'/'+state,
		method: 'post'
	})
}

export function ztall(){
	return request({
		url: '/zutai/my',
		method: 'post'
	})
}