import * as Cesium from 'cesium';
import h337 from './heatmap.js'



export class Heatmap {
    constructor(viewer, opt) {
        this.labelList = [];
        this.viewer = viewer;
        this.opt = opt || {};
        this.list = this.opt.list || [];
        let parse = JSON.parse(this.opt.config.polygon);
        if (!parse || parse.length < 2) {
            console.log("热力图点位不得少于3个！");
            return;
        }
        this.dom = undefined;
        this.id = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
        this.canvasw = 200;
        this.createDom();
        let yellow = typeof this.opt.config.yellowMin !== 'undefined' ? this.opt.config.yellowMin / this.opt.config.redMin : 0.3 + ""
        let orange = typeof this.opt.config.orangeMin !== 'undefined' ? this.opt.config.orangeMin / this.opt.config.redMin : 0.7 + ""
        let red = 1 + ""
        let gradient = {}
        gradient[yellow] = "yellow";
        gradient[orange] = "orange";
        gradient[red] = "red";
        let config = {
            container: document.getElementById(`bjt3d-heatmap-${this.id}`),
            radius: this.opt.config.radius || 20,
            gradient: gradient,
        };
        this.heatmapInstance = h337.create(config);
        this.init();
    }

    destory() {
        let dom = document.getElementById(`bjt3d-heatmap-${this.id}`);
        if (dom) dom.remove();
        if (this.heatPrimitive) {
            this.viewer.scene.primitives.remove(this.heatPrimitive);
            this.heatPrimitive = undefined;
        }
    }

    init() {
        this.hierarchy = []
        for (let ind = 0; ind < this.list.length; ind++) {
            let position = Cesium.Cartesian3.fromDegrees(this.list[ind].lng, this.list[ind].lat);
            this.hierarchy.push(position);
            this.labelList.push(this.viewer.entities.add({
                position: position,
                label: {
                    text: "聚集人数" + this.list[ind].value + "人",
                    backgroundColor: Cesium.Color.PALEVIOLETRED,    //背景颜色
                    showBackground: true,                //是否显示背景颜色
                    style: Cesium.LabelStyle.FILL,        //label样式
                    outlineWidth: 2, font: '13px sans-serif', fillColor: Cesium.Color.WHITE,        //字体颜色
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,//水平位置
                    pixelOffset: new Cesium.Cartesian2(0, -50),            //偏移
                    eyeOffset: new Cesium.Cartesian3(0, 0, -50)
                }
            }))
        }
        const bound = this.getBound(this.hierarchy);
        if (!bound) return;
        let points = [];
        let x_axios = Cesium.Cartesian3.subtract(bound.rightTop, bound.leftTop, new Cesium.Cartesian3());
        x_axios = Cesium.Cartesian3.normalize(x_axios, new Cesium.Cartesian3());
        let y_axios = Cesium.Cartesian3.subtract(bound.leftBottom, bound.leftTop, new Cesium.Cartesian3());
        y_axios = Cesium.Cartesian3.normalize(y_axios, new Cesium.Cartesian3());
        const girthX = Cesium.Cartesian3.distance(bound.rightTop, bound.leftTop);
        const girthY = Cesium.Cartesian3.distance(bound.leftBottom, bound.leftTop);
        for (let i = 0; i < this.hierarchy.length; i++) {
            const p1 = this.hierarchy[i];
            const p_origin = Cesium.Cartesian3.subtract(p1, bound.leftTop, new Cesium.Cartesian3());
            const diffX = Cesium.Cartesian3.dot(p_origin, x_axios);
            const diffY = Cesium.Cartesian3.dot(p_origin, y_axios);
            points.push({
                x: Number(diffX / girthX * this.canvasw).toFixed(0),
                y: Number(diffY / girthY * this.canvasw).toFixed(0),
                value: this.list[i].value
            })
        }

        this.heatPrimitive = undefined;
        let data = {
            max: this.opt.config.redMin, min: 0, data: points
        }
        this.heatmapInstance.setData(data);
        this.createPolygon([bound.leftTop, bound.leftBottom, bound.rightBottom, bound.rightTop]);
    }

    // 以面的形式添加
    createPolygon(positions) {
        let image = new Image();
        image.src = this.heatmapInstance._renderer.canvas.toDataURL("image/jpg");
        this.heatPrimitive = this.viewer.scene.primitives.add(new Cesium.GroundPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.RectangleGeometry({
                    rectangle: Cesium.Rectangle.fromCartesianArray(positions),
                    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                }),
            }), appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: false, material: new Cesium.Material({
                    fabric: {
                        type: "Image", uniforms: {
                            image: image.src,
                        },
                    },
                }),
            }),
        }));
    }

    updatePolygon() {
        this.hierarchy = []
        this.labelList.forEach((item, index) => {
            this.viewer.entities.remove(item)
        })
        this.labelList = []
        for (let ind = 0; ind < this.list.length; ind++) {
            let position = Cesium.Cartesian3.fromDegrees(this.list[ind].lng, this.list[ind].lat);
            this.hierarchy.push(position);
            this.labelList.push(this.viewer.entities.add({
                position: position,
                label: {
                    text: "聚集人数" + this.list[ind].value + "人",
                    backgroundColor: Cesium.Color.PALEVIOLETRED,    //背景颜色
                    showBackground: true,                //是否显示背景颜色
                    style: Cesium.LabelStyle.FILL,        //label样式
                    outlineWidth: 2, font: '13px sans-serif', fillColor: Cesium.Color.WHITE,        //字体颜色
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,//水平位置
                    pixelOffset: new Cesium.Cartesian2(0, -50),            //偏移
                    eyeOffset: new Cesium.Cartesian3(0, 0, -50)
                }
            }))
        }
        const bound = this.getBound(this.hierarchy);
        if (!bound) return;
        let points = [];
        let x_axios = Cesium.Cartesian3.subtract(bound.rightTop, bound.leftTop, new Cesium.Cartesian3());
        x_axios = Cesium.Cartesian3.normalize(x_axios, new Cesium.Cartesian3());
        let y_axios = Cesium.Cartesian3.subtract(bound.leftBottom, bound.leftTop, new Cesium.Cartesian3());
        y_axios = Cesium.Cartesian3.normalize(y_axios, new Cesium.Cartesian3());
        const girthX = Cesium.Cartesian3.distance(bound.rightTop, bound.leftTop);
        const girthY = Cesium.Cartesian3.distance(bound.leftBottom, bound.leftTop);
        for (let i = 0; i < this.hierarchy.length; i++) {
            const p1 = this.hierarchy[i];
            const p_origin = Cesium.Cartesian3.subtract(p1, bound.leftTop, new Cesium.Cartesian3());
            const diffX = Cesium.Cartesian3.dot(p_origin, x_axios);
            const diffY = Cesium.Cartesian3.dot(p_origin, y_axios);
            points.push({
                x: Number(diffX / girthX * this.canvasw).toFixed(0),
                y: Number(diffY / girthY * this.canvasw).toFixed(0),
                value: this.list[i].value
            })
        }
        let data = {
            max: this.opt.config.redMin, min: 0, data: points
        }
        this.heatmapInstance.setData(data);
        let image = new Image();
        image.src = this.heatmapInstance._renderer.canvas.toDataURL("image/jpg");
        this.heatPrimitive.appearance.material.uniforms.image = image.src;
    }


    createDom() {
        this.dom = window.document.createElement("div");
        this.dom.id = `bjt3d-heatmap-${this.id}`;
        this.dom.className = `bjt3d-heatmap`;
        this.dom.style.width = this.canvasw + "px";
        this.dom.style.height = this.canvasw + "px";
        this.dom.style.position = "absolute";
        this.dom.style.display = "none";
        let mapDom = window.document.getElementById(this.viewer.container.id);
        mapDom.appendChild(this.dom);
    }


    // 扩展边界 防止出现热力图被分割
    getBound(positions) {
        let parse = JSON.parse(this.opt.config.polygon);
        console.log(parse)

        let positions2 = []
        for (let i = 1; i <= parse.length; i++) {
            if (i % 3 === 0) {
                let position = Cesium.Cartesian3.fromDegrees(parse[i - 3], parse[i - 2]);
                positions2.push(position)
            }
        }
        let rect = this.toRectangle(positions2); // 转为正方形
        let lnglats = [];
        for (let i = 0; i < rect.length; i++) {
            let array = [];
            var cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(rect[i]);
            array.push(Cesium.Math.toDegrees(cartographic.longitude))
            array.push(Cesium.Math.toDegrees(cartographic.latitude))
            lnglats.push(array)
        }
        let minLat = Number.MAX_VALUE, maxLat = Number.MIN_VALUE, minLng = Number.MAX_VALUE, maxLng = Number.MIN_VALUE;
        const length = rect.length;
        for (let i = 0; i < length; i++) {
            let lnglat = lnglats[i];
            if (lnglat[0] < minLng) {
                minLng = lnglat[0];
            }
            if (lnglat[0] > maxLng) {
                maxLng = lnglat[0];
            }

            if (lnglat[1] < minLat) {
                minLat = lnglat[1];
            }
            if (lnglat[1] > maxLat) {
                maxLat = lnglat[1];
            }
        }

        const diff_lat = maxLat - minLat;
        const diff_lng = maxLng - minLng;

        minLat = minLat - diff_lat / length;
        maxLat = maxLat + diff_lat / length;
        minLng = minLng - diff_lng / length;
        maxLng = maxLng + diff_lng / length;

        return {
            leftTop: Cesium.Cartesian3.fromDegrees(minLng, maxLat),
            leftBottom: Cesium.Cartesian3.fromDegrees(minLng, minLat),
            rightTop: Cesium.Cartesian3.fromDegrees(maxLng, maxLat),
            rightBottom: Cesium.Cartesian3.fromDegrees(maxLng, minLat),
        }
    }

    // 任何图形均转化为正方形
    toRectangle(hierarchy) {
        if (!hierarchy) return;
        let boundingSphere = Cesium.BoundingSphere.fromPoints(hierarchy, new Cesium.BoundingSphere());
        let center = boundingSphere.center;
        const radius = boundingSphere.radius;

        let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center.clone());
        let modelMatrix_inverse = Cesium.Matrix4.inverse(modelMatrix.clone(), new Cesium.Matrix4());
        let roate_y = new Cesium.Cartesian3(0, 1, 0);

        let arr = [];
        for (let i = 45; i <= 360; i += 90) {
            let roateZ_mtx = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(i), new Cesium.Matrix3());
            let yaix_roate = Cesium.Matrix3.multiplyByVector(roateZ_mtx, roate_y, new Cesium.Cartesian3());
            yaix_roate = Cesium.Cartesian3.normalize(yaix_roate, new Cesium.Cartesian3());
            let third = Cesium.Cartesian3.multiplyByScalar(yaix_roate, radius, new Cesium.Cartesian3());
            let poi = Cesium.Matrix4.multiplyByPoint(modelMatrix, third.clone(), new Cesium.Cartesian3());


            arr.push(poi);
        }

        return arr;
    }


}