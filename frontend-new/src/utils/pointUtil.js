import combustiblegasUrl from '../assets/images/keran.png'
import environmentprotectionUrl from '../assets/images/WechatIMG48.png'
import firecontrolUrl from '../assets/images/WechatIMG51.png'
import gongyicanshuUrl from '../assets/images/WechatIMG57.png'
import huaxuepinUrl from '../assets/points/huaxuepin.png'
import monitorUrl from '../assets/images/shexiangtou.png'
import powerUrl from '../assets/images/WechatIMG49.png'
import productionequipmentUrl from '../assets/points/productionequipment.png'
import riskUrl from '../assets/images/fengxiandian.png'
import toxicgasUrl from '../assets/images/youdu.png'
import yingjiwuziUrl from '../assets/points/yingjiwuzi.png'
import peoplelocationUrl from '../assets/images/内部员工.png'
import peoplelocationSelectUrl from '../assets/images/内部员工-1.png'
import guestUrl from '../assets/images/外部人员.png'
import guestSelectUrl from '../assets/images/外部人员-1.png'
import shuxingUrl from '../assets/images/shuxing.png'
import contractorUrl from '../assets/images/承包商.png'
import contractorSelectUrl from '../assets/images/承包商-1.png'

export function getImgSrc(type) {
    switch (type) {
        case 0:
            return peoplelocationUrl;
        case 1:
            return riskUrl
        case 3:
            return combustiblegasUrl
        case 4:
            return powerUrl
        case 5:
            return environmentprotectionUrl
        case 6:
            return productionequipmentUrl
        case 7:
            return toxicgasUrl
        case 8:
            return firecontrolUrl
        case 9:
            return monitorUrl
        case 10:
            return yingjiwuziUrl
        case 11:
            return huaxuepinUrl
        case 12:
            return gongyicanshuUrl;
        case 13:
            return shuxingUrl;
        case 14:
            return shuxingUrl;
    }
}


export function positionImg() {
    return peoplelocationUrl;
}

export function positionSelectImg() {
    return peoplelocationSelectUrl;
}

export function contractorImg() {
    return contractorUrl;
}

export function contractorSelectImg() {
    return contractorSelectUrl;
}

export function guestImg() {

    return guestUrl;
}
export function guestSelectImg() {
    return guestSelectUrl;
}

export function getRiskColor(str) {
    let type;
    if (str === '重大风险') {
        type = 108
    } else if (str === '较大风险') {
        type = 107
    } else if (str === '一般风险') {
        type = 106
    } else if (str === '低风险') {
        type = 105
    } else {
        type = 110
    }
    return type;
}

export function getLayerColor(type) {
    switch (type) {
        case 101:
            return '#0fa5c6'
        case 102:
            return '#37c4e2'
        case 103:
            return '#dac011'
        case 104:
            return '#288cdf'
        case 105:
            return '#6495ED'
        case 106:
            return '#FFD700'
        case 107:
            return '#FF8C00'
        case 108:
            return '#f80d22'
        case 109:
            return '#FA8072'
        case 110:
            return '#c0c0bf'
    }
}
