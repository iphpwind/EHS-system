import request from '@/utils/request'

// 查询运行监控
export function yxjk() {
  return request({
    url: '/system/screen/yxjk',
    method: 'get'
  });
}
// 设备类别
export function equimentType() {
  return request({
    url: '/system/screen/equimentType',
    method: 'get'
  });
}
// 设备增长趋势
export function trend() {
  return request({
    url: '/system/screen/trend',
    method: 'get'
  });
}
// 设备城市分布
export function city_total() {
  return request({
    url: '/system/screen/city_total',
    method: 'get'
  });
}


// 获取上云企业数、私有化企业数、私有化用户数
export function getServiceCompanyInfo() {
  return request({
    url: '/system/dept/getServiceCompanyInfo',
    method: 'get'
  });
}

// 上云用户数 人员管理里的数量
export function getCloudUserNum() {
  return request({
    url: '/system/staff/list',
    method: 'get'
  });
}
// 私有设备总数、网关接入设备和接入点位数量
export function getLocalEquipAndPointData(query) {
  return request({
    url: '/sensor/terminal/getLocalEquipAndPointData',
    method: 'get',
    params: query
  })
}

// 获取上月新增设备/年度新增设备 --- 私有化设备 设备台账
export function getEquipTotalByLastMonthAndYear(query) {
  return request({
    url: '/equipment/equipment/getEquipTotalByLastMonthAndYear',
    method: 'get',
    params: query
  })
}

  let ak = 'XlhteYuKu0i3CnCRzCheI7rLh5nshkIj'
/**
 * 异步加载百度地图
 * @returns {Promise}
 * @constructor
 */
function loadBaiDuMap() {
    return new Promise(function (resolve, reject) {
        try {
            console.log("BMap is defined:", BMapGL === undefined || BMapGL);
            resolve(BMapGL);
        } catch (err) {
            window.init = function () {
                resolve(BMapGL);
            };
            let script = document.createElement("script");
            script.type = "text/javascript";
            // script.src = `https://api.map.baidu.com/api?v=2.0&type=webgl&ak=${ak}&callback=init`;
            script.onerror = reject;
            document.body.appendChild(script);
        }
    });
}
//通过地址转换为经纬度，注意这里必须传入city，也就是市
export function getPoint(city) {
    let result = loadBaiDuMap().then((BMapGL) => {
        return new Promise(function (resolve, reject) {
            
            var myGeo = new BMapGL.Geocoder();
            // 将地址解析结果显示在地图上，并调整地图视野
            myGeo.getPoint(
              city,
                function (point) {
                    if (point) {
                        resolve(point);
                    } else {
                        reject(res);
                    }
                },
                city
            );
        });
    });
    return result;
}
