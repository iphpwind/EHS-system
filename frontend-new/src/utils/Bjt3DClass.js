/**
 * @author bjt
 * @date 2021年11月30日09:38:56
 * @desc 加载3dTiled地图
 * @version 1.0.0
 */

import * as Cesium from 'cesium';
import SuperGif from "libgif";
import {Heatmap} from "./HeatMapClass";

export default class Bjt3DClass {
    constructor() {
        this.viewer = null
        this.tileset = null
        this.childrenTileset = new Map()
        this.height = 1
        this.checkedId = null
        this.typePoints = new Map()
        this.typeLayers = new Map()
        this.positionPoints = []
    }

    //初始化3DTiled
    init(id, threeDTiledSrc, config, callback) {
        var token = '32513e57e92887b15662090a21c34cf8';
        this.viewer = new Cesium.Viewer(id, {
            baseLayerPicker: false,
            automaticallyTrackDataSourceClocks: false,
            geocoder: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            homeButton: false,
            fullscreenButton: false,
            infoBox: false,
            selectionIndicator: false,
            shadows: false,
            shouldAnimate: true,
            imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                url: "https://t6.tianditu.gov.cn/img_w/wmts?tk=" + token,
                layer: "img",
                style: "default",
                tileMatrixSetID: "w",
                format: "tiles",
                maximumLevel: 18
            })
        });

        this.tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({url: threeDTiledSrc}))
        let that = this
        this.tileset.readyPromise.then(function () {
            let boundingSphere = that.tileset.boundingSphere;
            let center = boundingSphere.center;
            let cartographic = Cesium.Cartographic.fromCartesian(center);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            that.viewer.camera.flyTo({
                destination: that.parseCartesian3({
                    longitude: longitude,
                    latitude: latitude,
                    height: config.maxViewingHeight
                }),
                duration: 0,
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0.0
                },
                maximumHeight: 500
            });
        })

        this.height = config.floorHeight;
        //配置模型基础设置
        this.viewer.scene.globe.depthTestAgainstTerrain = false;
        this.viewer._cesiumWidget._creditContainer.style.display = 'none';
        this.viewer.scene.postProcessStages.fxaa.enabled = false;
        this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = config.maxViewingHeight;
        this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
        this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];

        this.viewer.animation.container.style.visibility = "hidden";
        this.viewer.timeline.container.style.visibility = "hidden";
        // this.viewer.timeline.container.style.visibility = 'visible';
        // this.viewer.animation.container.style.visibility = 'visible';
        if (typeof callback === 'function') {
            callback();
        }
    }

    getById(id) {
        return this.viewer.entities.getById(id)
    }

    offset(x, y, z) {
        var translation = Cesium.Cartesian3.fromArray([x, y, z]);
        var m = Cesium.Matrix4.fromTranslation(translation);
        this.tileset._modelMatrix = m
    }

    pointLoad(id, type, data, img) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        drawCustomizePoint(id, data, img);
        let typeArray = this.typePoints.get(type);
        if (typeArray === 'undefined' || typeArray == null) {
            this.typePoints.set(type, [id]);
        } else {
            typeArray.push(id);
            typeArray = [...new Set(typeArray)];
            this.typePoints.set(type, typeArray);
        }
    }

    layRemoveByType(type) {
        let layerArray = this.typeLayers.get(type);
        if (typeof layerArray === 'undefined') {
            return
        }
        layerArray.forEach(item => {
            this.remove(item, () => {
            })
        })
    }

    layerLoad1(id, label, type, data, color) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        this.drawPolygon1(id, label, color, data);
        let layerArray = this.typeLayers.get(type);
        if (layerArray === 'undefined' || layerArray == null) {
            this.typeLayers.set(type, [id]);
        } else {
            layerArray.push(id);
            layerArray = [...new Set(layerArray)];
            this.typeLayers.set(type, layerArray);
        }
    }

    layerLoad2(id, label, type, data, color) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        this.drawPolygon2(id, label, color, data);
        let layerArray = this.typeLayers.get(type);
        if (layerArray === 'undefined' || layerArray == null) {
            this.typeLayers.set(type, [id]);
        } else {
            layerArray.push(id);
            layerArray = [...new Set(layerArray)];
            this.typeLayers.set(type, layerArray);
        }
    }

    //相机视角修改
    cameraChange(angle, position) {
        position.height = 400
        let parsePosition = this.parseCartesian3(position)
        this.viewer.camera.setView({
            destination: parsePosition, orientation: {
                pitch: Cesium.Math.toRadians(angle), roll: 0.0
            }
        });
    }

    //根据点位绘制立方体
    layer(height, label, color, callback) {
        var tempPoints = [];
        var tempEntities = [];
        var pointArr = [];
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        let that = this
        handler.setInputAction(function (click) {
            let position = that.viewer.camera.pickEllipsoid(click.position, that.viewer.scene.globe.ellipsoid);
            var cartographic = that.viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
            pointArr.push({
                latitude: Cesium.Math.toDegrees(cartographic.latitude),
                longitude: Cesium.Math.toDegrees(cartographic.longitude)
            });

            tempPoints.push(position);
            let tempLength = tempPoints.length;
            let point = that.drawPoint(position);

            tempEntities.push(point);
            if (tempLength > 1) {
                let pointline = that.drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]]);
                tempEntities.push(pointline);
            }

            handler.setInputAction(function (click) {
                let pointline = that.drawPolyline([tempPoints[tempPoints.length - 1], tempPoints[0]]);
                tempEntities.push(pointline);
                that.clearHandler(handler);
                let id = new Date().getTime();
                let layer = that.createLayer(pointArr, height);

                let polygon = that.drawPolygon1(id, label, color, layer)
                for (let i = 0; i < tempEntities.length; i++) {
                    that.viewer.entities.remove(tempEntities[i]);
                }
                if (polygon) {
                    callback(layer, id);
                }
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //选中entity
    pickEntity(after, emptyAfter) {
        let that = this
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((movement) => {
            let pick = that.viewer.scene.pick(movement.position);
            if (pick && pick.id && pick.id._id) {
                //已选中的id
                if (typeof after != 'undefined') {
                    after(pick.id._id);
                }
            } else {
                if (typeof emptyAfter != 'undefined') {
                    emptyAfter();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //选中重叠entity
    pickMultipleEntity(after) {
        let that = this
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((movement) => {
            let pickedObject = that.viewer.scene.drillPick(movement.position);
            let arr = [];
            for (let i = 0; i < pickedObject.length; i++) {
                if (pickedObject[i].id) {
                    arr.push(pickedObject[i].id._id)
                }
            }
            this.checkedId = after(arr)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //移除默认事件
    removeDefaultHandler() {
        let that = this
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        //取消双击
        handler.setInputAction(function (movement) {
            that.viewer.trackedEntity = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    //标点
    point(type, img, callback) {
        let that = this
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((click) => {
            let position = that.viewer.scene.pickPosition(click.position);
            let id = new Date().getTime();
            that.drawCustomizePoint(id, position, img)
            let typeArray = that.typePoints.get(type);
            if (typeArray === 'undefined' || typeArray == null) {
                this.typePoints.set(type, [id]);
            } else {
                typeArray.push(id);
                typeArray = [...new Set(typeArray)];
                that.typePoints.set(type, typeArray);
            }
            if (position) {
                callback(position, id, type);
            }
            that.clearHandler(handler);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //点位移动
    pointMove(id, newPosition, speed) {
        let entity = this.viewer.entities.getById(id);
        let cartesian = this.parseCartesian3(newPosition);
        let oldPosition = entity._position.getValue();
        let array = this.splineArray(oldPosition, cartesian, speed);
        let i = -1;
        entity._position = new Cesium.CallbackProperty(function (time, result) {
            if (i < array.length - 1) {
                ++i;
            }
            return array[i];
        }, false);
    }

    parseCartesian3(obj) {
        let height = this.viewer.scene.sampleHeight(new Cesium.Cartographic(Cesium.Math.toRadians(obj.longitude),//转换成弧度
            Cesium.Math.toRadians(obj.latitude - 0),//弧度
        ));
        if (typeof obj.height === 'undefined') {
            obj.height = 3
        }
        return Cesium.Cartesian3.fromDegrees(obj.longitude - 0, obj.latitude - 0, obj.height);
    }

    //添加定位点
    pointPosition(id, label, img, position) {
        let cartesian3 = this.parseCartesian3(position);
        let property = new Cesium.CallbackProperty(function (time, result) {
            return cartesian3;
        }, false);
        this.viewer.entities.add({
            position: property, id: id, billboard: {
                image: img, width: 30, height: 30, scale: 1, // scaleByDistance: new Cesium.NearFarScalar(1, 1, 1, 1),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }, label: {
                text: label, backgroundColor: Cesium.Color.BLACK,    //背景颜色
                showBackground: true,                //是否显示背景颜色
                style: Cesium.LabelStyle.FILL,        //label样式
                outlineWidth: 2, font: '13px sans-serif', fillColor: Cesium.Color.WHITE,        //字体颜色
                verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,//水平位置
                pixelOffset: new Cesium.Cartesian2(0, 20),            //偏移
                eyeOffset: new Cesium.Cartesian3(0, 0, -50)
            }
        });
        this.removeDefaultHandler();
    }

    //人员轨迹
    trajectory(position) {
        let line = this.viewer.entities.add({
            polyline: {
                positions: position, width: 5.0, material: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.RED,
                }), depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.RED,
                }), clampToGround: true,
            }
        })
    }

    //删除entity
    remove(id, callback) {
        let entity = this.viewer.entities.getById(id);
        this.viewer.entities.remove(entity);
        if (typeof callback === 'function') {
            callback(id);
        }
    }

    removeAll() {
        this.viewer.entities.removeAll();
    }

    //双击事件
    pickEntityDoubleClick(callback) {
        let that = this
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((double_click) => {
            let pick = that.viewer.scene.pick(double_click.position);
            if (pick && pick.id) {
                callback(pick.id._id);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }

    //模型分层
    cutting(cutTiles) {
        let carr = []
        let cutLocations = JSON.parse(cutTiles.cutLocations)
        for (let i = 0; i < cutLocations.length - 1; i++) {
            carr.push(this.createPlane(cutLocations[i], cutLocations[i + 1], this.getInverseTransform(this.tileset)))
        }
        this.tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: carr,
        });
        let model = new Cesium.Cesium3DTileset({
            url: cutTiles.url,
        })
        this.viewer.scene.primitives.add(model)
        model.readyPromise.then(function (tileset) {
            let cartographic = Cesium.Cartographic.fromCartesian(model.boundingSphere.center)
            let lng = Cesium.Math.toDegrees(cartographic.longitude)
            let lat = Cesium.Math.toDegrees(cartographic.latitude)
            let surface = Cesium.Cartesian3.fromDegrees(lng, lat, 0.0)
            let offset = Cesium.Cartesian3.fromDegrees(lng, lat, cutTiles.height)
            let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        });
        if (this.childrenTileset.has(cutTiles.pointId)) {
            let arr = this.childrenTileset.get(cutTiles.pointId)
            arr.push({id: cutTiles.id, model: model, show: true})
            this.childrenTileset.set(cutTiles.pointId, arr)
        } else {
            this.childrenTileset.set(cutTiles.pointId, [{id: cutTiles.id, model: model, show: true}])
        }
    }

    unCutting(pointId) {
        let that = this
        this.tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: null,
        });
        let arr = this.childrenTileset.get(pointId)
        arr.forEach(item => {
            that.viewer.scene.primitives.remove(item.model)
        })
        this.childrenTileset.delete(pointId)
    }

    cuttingFilter(childrenMap) {
        if (this.childrenTileset.has(childrenMap.pointId)) {
            let arr = this.childrenTileset.get(childrenMap.pointId)
            arr.forEach(item => {
                if (childrenMap.id === item.id) {
                    item.model.show = true
                    item.show = true
                } else {
                    item.model.show = false
                    item.show = false
                }
            })
        }
    }

    cesiumHeatmap(data, opt) {
        if (typeof this.heatmapEntity == 'undefined') {
            this.heatmapEntity = new Heatmap(this.viewer, {
                list: data,
                config: opt
            })
        } else {
            this.heatmapEntity.list = data
            this.heatmapEntity.updatePolygon();
        }
    }

    removeHeatmap() {
        this.heatmapEntity.destory();
        this.heatmapEntity = undefined
    }

    drawPoint(position) {
        var pointGeometry = this.viewer.entities.add({
            position: position, point: {
                color: Cesium.Color.fLORALWHITE,
                pixelSize: 10,
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
        });
        return pointGeometry;
    }

    drawCustomizePoint(id, position, uri) {
        var pointGeometry = this.viewer.entities.add({
            position: new Cesium.CallbackProperty(function (time, result) {
                return position;
            }, false), id: id, billboard: {
                image: uri,
                width: 30,
                height: 30,
                scaleByDistance: new Cesium.NearFarScalar(0.8, 1.0, 1.0, 1.0),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        });
        return pointGeometry;
    }

    drawPolyline(positions, config) {
        if (positions.length < 1) return;
        var config = config ? config : {};
        var polylineGeometry = this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: config.width ? config.width : 5.0,
                material: new Cesium.PolylineGlowMaterialProperty({
                    color: config.color ? new Cesium.Color.fromCssColorString(config.color) : Cesium.Color.fLORALWHITE,
                }),
                depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                    color: config.color ? new Cesium.Color.fromCssColorString(config.color) : Cesium.Color.fLORALWHITE,
                }),
            }
        });
        return polylineGeometry;
    }

    drawPolygon1(id, label, color, layer) {
        if (typeof layer === 'undefined') {
            return;
        }
        var polygon = this.viewer.entities.add({
            id: id, polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(layer),
                extrudedHeight: 0,
                perPositionHeight: true,
                material: Cesium.Color.fromCssColorString(color).withAlpha(0.5),
                outline: false,
                label: {}
            },
        });

        let polyPositions = polygon.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
        let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
        polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
        polygon.position = polyCenter;
        polygon.label = {
            // position:
            text: label,
            color: Cesium.Color.fromCssColorString('#fff'),
            font: 'normal 32px MicroSoft YaHei',
            showBackground: true,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            backgroundColor: Cesium.Color.fromCssColorString('#031c50'),
            scale: 0.5,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT_CLICK,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 100000.0),
            disableDepthTestDistance: 10000.0
        }

        return polygon;
    }

    addAnimaPoint(data, gif) {
        let rub = new SuperGif({
            gif: gif
        });
        rub.load()
        this.viewer.entities.add({
            id: data.id,
            position: this.parseCartesian3(data),
            billboard: {
                image: new Cesium.CallbackProperty(() => {
                    return rub.get_canvas().toDataURL("image/png");
                }, false)
            },
        });
    }

    drawPolygon2(id, label, color, layer) {
        if (typeof layer === 'undefined') {
            return;
        }
        var polygon = this.viewer.entities.add({
            id: id, polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(layer),
                extrudedHeight: 0,
                perPositionHeight: true,
                material: Cesium.Color.fromCssColorString(color).withAlpha(0.5),
                outline: false,
                label: {}
            },
        });

        let polyPositions = polygon.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
        let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
        polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
        polygon.position = polyCenter;
        polygon.label = {
            // position:
            text: label,
            color: Cesium.Color.fromCssColorString('#fff'),
            font: 'normal 32px MicroSoft YaHei',
            showBackground: true,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            backgroundColor: Cesium.Color.fromCssColorString('#c30e0e'),
            scale: 0.5,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT_CLICK,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 100000.0),
            disableDepthTestDistance: 10000.0
        }

        return polygon;
    }

    splineArray(o, n, s) {
        let control = [o, n];
        let spline = new Cesium.LinearSpline({
            times: [0.0, 1], points: control
        });
        let pointForFrame = [];
        for (let i = 0; i < s; i++) {
            pointForFrame.push(spline.evaluate(i / s));
        }
        return pointForFrame;
    }

    createLayer(pointArr, height) {
        var arr = [];
        for (let i = 0; i < pointArr.length; i++) {
            arr.push(pointArr[i].longitude);
            arr.push(pointArr[i].latitude);
            arr.push(height);
        }
        return arr;
    }

    clearHandler(handler) {
        handler.destroy();
        handler = null;
    }

    createPlane(p1, p2, inverseTransform) {
        let p1C3 = this.getOriginCoordinateSystemPoint(p1, inverseTransform)
        let p2C3 = this.getOriginCoordinateSystemPoint(p2, inverseTransform)
        let up = new Cesium.Cartesian3(0, 0, 10)
        let left = Cesium.Cartesian3.subtract(p1C3, p2C3, new Cesium.Cartesian3())
        let normal = Cesium.Cartesian3.cross(left, up, new Cesium.Cartesian3())
        normal = Cesium.Cartesian3.normalize(normal, normal)
        let planeTmp = Cesium.Plane.fromPointNormal(p1C3, normal)
        return Cesium.ClippingPlane.fromPlane(planeTmp)
    }

    getOriginCoordinateSystemPoint(point, inverseTransform) {
        let val = Cesium.Cartesian3.fromDegrees(point.lng, point.lat)
        return Cesium.Matrix4.multiplyByPoint(inverseTransform, val, new Cesium.Cartesian3(0, 0, 0))
    }

    getInverseTransform(tileSet) {
        let transform
        let tmp = tileSet.root.transform
        if ((tmp && tmp.equals(Cesium.Matrix4.IDENTITY)) || !tmp) {
            transform = Cesium.Transforms.eastNorthUpToFixedFrame(tileSet.boundingSphere.center)
        } else {
            transform = Cesium.Matrix4.fromArray(tileSet.root.transform)
        }
        return Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4())
    }
}