/**
 * @author bjt
 * @date 2021年11月30日09:38:56
 * @desc 加载3dTiled地图
 * @version 1.0.0
 */

import * as Cesium from 'cesium';

const bjt3D = {
    viewer: null,
    tileset: null,
    childrenTileset: new Map(),
    height: 1,
    checkedId: null,
    typePoints: new Map(),
    typeLayers: new Map(),
    positionPoints: [],
    gatherAlarmList: [],
    //初始化3DTiled
    init: function (id, threeDTiledSrc, config, callback) {
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

        this.tileset = new Cesium.Cesium3DTileset({
            url: threeDTiledSrc,
        });

        this.tileset.readyPromise.then(function (tileset) {
            var translation = Cesium.Cartesian3.fromArray([config.mapOffsetX, config.mapOffsetY, config.mapOffsetZ]);
            var m = Cesium.Matrix4.fromTranslation(translation);
            tileset._modelMatrix = m
        });

        this.viewer.scene.primitives.add(this.tileset).readyPromise.then(e => {
            this.viewer.flyTo(e, {
                duration: 0,
                offset: new Cesium.HeadingPitchRange(config.mapViewingAngle, Cesium.Math.toRadians(config.mapInitAngle))
            });
        });

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
    },
    getById(id) {
        return bjt3D.viewer.entities.getById(id)
    },
    offset: function (x, y, z) {
        var translation = Cesium.Cartesian3.fromArray([x, y, z]);
        var m = Cesium.Matrix4.fromTranslation(translation);
        this.tileset._modelMatrix = m
    },
    pointLoad: function (id, type, data, img) {
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
    },
    layRemoveByType(type) {
        let layerArray = this.typeLayers.get(type);
        if (typeof layerArray === 'undefined') {
            return
        }
        layerArray.forEach(item => {
            bjt3D.remove(item, () => {})
        })
    },
    layerLoad1: function (id, label, type, data, color) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        drawPolygon1(id, label, color, data);
        let layerArray = this.typeLayers.get(type);
        if (layerArray === 'undefined' || layerArray == null) {
            this.typeLayers.set(type, [id]);
        } else {
            layerArray.push(id);
            layerArray = [...new Set(layerArray)];
            this.typeLayers.set(type, layerArray);
        }
    },
    layerLoad2: function (id, label, type, data, color) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        drawPolygon2(id, label, color, data);
        let layerArray = this.typeLayers.get(type);
        if (layerArray === 'undefined' || layerArray == null) {
            this.typeLayers.set(type, [id]);
        } else {
            layerArray.push(id);
            layerArray = [...new Set(layerArray)];
            this.typeLayers.set(type, layerArray);
        }
    },
    //相机视角修改
    cameraChange: function (angle, position) {
        position.height = 400
        let parsePosition = bjt3D.parseCartesian3(position)
        bjt3D.viewer.camera.setView({
            destination: parsePosition,
            orientation: {
                pitch: Cesium.Math.toRadians(angle),
                roll: 0.0
            }
        });
    },
    //根据点位绘制立方体
    layer: function (height, label, color, callback) {
        var tempPoints = [];
        var tempEntities = [];
        var pointArr = [];
        let handler = new Cesium.ScreenSpaceEventHandler(bjt3D.viewer.scene.canvas);
        handler.setInputAction(function (click) {
                let position = bjt3D.viewer.camera.pickEllipsoid(click.position, bjt3D.viewer.scene.globe.ellipsoid);
                var cartographic = bjt3D.viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
                pointArr.push({
                    latitude: Cesium.Math.toDegrees(cartographic.latitude),
                    longitude: Cesium.Math.toDegrees(cartographic.longitude)
                });

                tempPoints.push(position);
                let tempLength = tempPoints.length;
                let point = drawPoint(position);

                tempEntities.push(point);
                if (tempLength > 1) {
                    let pointline = drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]]);
                    tempEntities.push(pointline);
                }

                handler.setInputAction(function (click) {
                    let pointline = drawPolyline([tempPoints[tempPoints.length - 1], tempPoints[0]]);
                    tempEntities.push(pointline);
                    clearHandler(handler);
                    let id = new Date().getTime();
                    let layer = createLayer(pointArr, height);

                    let polygon = drawPolygon1(id, label, color, layer)
                    for (let i = 0; i < tempEntities.length; i++) {
                        bjt3D.viewer.entities.remove(tempEntities[i]);
                    }
                    if (polygon) {
                        callback(layer, id);
                    }
                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            },
            Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //选中entity
    pickEntity: function (after, emptyAfter) {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((movement) => {
            let pick = this.viewer.scene.pick(movement.position);
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
    },
    //选中重叠entity
    pickMultipleEntity: function (after) {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((movement) => {
            let pickedObject = this.viewer.scene.drillPick(movement.position);
            let arr = [];
            for (let i = 0; i < pickedObject.length; i++) {
                if (pickedObject[i].id) {
                    arr.push(pickedObject[i].id._id)
                }
            }
            this.checkedId = after(arr)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //移除默认事件
    removeDefaultHandler: function () {
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        //取消双击
        handler.setInputAction(function (movement) {
            bjt3D.viewer.trackedEntity = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },
    //标点
    point: function (type, img, callback) {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((click) => {
            let position = this.viewer.scene.pickPosition(click.position);
            let id = new Date().getTime();
            drawCustomizePoint(id, position, img)
            let typeArray = this.typePoints.get(type);
            if (typeArray === 'undefined' || typeArray == null) {
                this.typePoints.set(type, [id]);
            } else {
                typeArray.push(id);
                typeArray = [...new Set(typeArray)];
                this.typePoints.set(type, typeArray);
            }
            if (position) {
                callback(position, id, type);
            }
            clearHandler(handler);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //点位移动
    pointMove: function (id, newPosition, speed) {
        let entity = this.viewer.entities.getById(id);
        let cartesian = bjt3D.parseCartesian3(newPosition);
        let oldPosition = entity._position.getValue();
        let array = splineArray(oldPosition, cartesian, speed);
        let i = -1;
        entity._position = new Cesium.CallbackProperty(function (time, result) {
            if (i < array.length - 1) {
                ++i;
            }
            return array[i];
        }, false);
    },
    parseCartesian3: function (obj) {
        let height = bjt3D.viewer.scene.sampleHeight(
            new Cesium.Cartographic(
                Cesium.Math.toRadians(obj.longitude),//转换成弧度
                Cesium.Math.toRadians(obj.latitude - 0),//弧度
            )
        );
        if (typeof obj.height === 'undefined') {
            obj.height = 3
        }
        return Cesium.Cartesian3.fromDegrees(obj.longitude - 0, obj.latitude - 0, obj.height);
    },
    //添加定位点
    pointPosition: function (id, label, img, position) {
        let cartesian3 = bjt3D.parseCartesian3(position);
        let property = new Cesium.CallbackProperty(function (time, result) {
            return cartesian3;
        }, false);
        bjt3D.viewer.entities.add({
            position: property,
            id: id,
            billboard: {
                image: img,
                width: 30,
                height: 30,
                scale: 1,
                // scaleByDistance: new Cesium.NearFarScalar(1, 1, 1, 1),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: label,
                backgroundColor: Cesium.Color.BLACK,    //背景颜色
                showBackground: true,                //是否显示背景颜色
                style: Cesium.LabelStyle.FILL,        //label样式
                outlineWidth: 2,
                font: '13px sans-serif',
                fillColor: Cesium.Color.WHITE,        //字体颜色
                verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,//水平位置
                pixelOffset: new Cesium.Cartesian2(0, 20),            //偏移
                eyeOffset: new Cesium.Cartesian3(0, 0, -50)
            }
        });
        bjt3D.removeDefaultHandler();
    },
    //人员轨迹
    trajectory: function (position) {
        let line = bjt3D.viewer.entities.add({
            polyline: {
                positions: position,
                width: 5.0,
                material: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.RED,
                }),
                depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.RED,
                }),
                clampToGround: true,
            }
        })
    },
    //删除entity
    remove: function (id, callback) {
        let entity = bjt3D.viewer.entities.getById(id);
        bjt3D.viewer.entities.remove(entity);
        if (typeof callback === 'function') {
            callback(id);
        }
    },
    removeAll: function () {
        this.viewer.entities.removeAll();
    },
    //双击事件
    pickEntityDoubleClick: function (callback) {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((double_click) => {
            let pick = this.viewer.scene.pick(double_click.position);
            if (pick && pick.id) {
                callback(pick.id._id);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    },
    //模型分层
    cutting(cutTiles) {
        let carr = []
        let cutLocations = JSON.parse(cutTiles.cutLocations)
        for (let i = 0; i < cutLocations.length - 1; i++) {
            carr.push(createPlane(cutLocations[i], cutLocations[i + 1], getInverseTransform(this.tileset)))
        }
        this.tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: carr,
        });
        let model = new Cesium.Cesium3DTileset({
            url: cutTiles.url,
        })
        this.viewer.scene.primitives.add(model)
        model.readyPromise.then(function (tileset) {
            var cartographic = Cesium.Cartographic.fromCartesian(model.boundingSphere.center)
            var lng = Cesium.Math.toDegrees(cartographic.longitude)
            var lat = Cesium.Math.toDegrees(cartographic.latitude)
            var surface = Cesium.Cartesian3.fromDegrees(lng, lat, 0.0)
            var offset = Cesium.Cartesian3.fromDegrees(lng, lat, cutTiles.height)
            var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        });
        if (this.childrenTileset.has(cutTiles.pointId)) {
            let arr = this.childrenTileset.get(cutTiles.pointId)
            arr.push({id: cutTiles.id, model: model, show: true})
            this.childrenTileset.set(cutTiles.pointId, arr)
        } else {
            this.childrenTileset.set(cutTiles.pointId, [{id: cutTiles.id, model: model, show: true}])
        }
    },
    unCutting(pointId) {
        this.tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: null,
        });
        let arr = this.childrenTileset.get(pointId)
        arr.forEach(item => {
            this.viewer.scene.primitives.remove(item.model)
        })
        this.childrenTileset.delete(pointId)
    },
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
    },
    gatherAlarm(position) {
        let str = "gather:"
        let r1 = 10;
        let r2 = 10;

        if (bjt3D.viewer.entities.getById(str + position.tagId) != null) {
            return
        }


        let height = bjt3D.viewer.scene.sampleHeight(
            new Cesium.Cartographic(
                Cesium.Math.toRadians(position.longitude),//转换成弧度
                Cesium.Math.toRadians(position.latitude),//弧度
            )
        );

        let entity = bjt3D.viewer.entities.add({
            id: str + position.tagId,
            position: this.parseCartesian3(position),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(function () {
                    r1 = r1 + 0.1;
                    if (r1 >= 5) {
                        r1 = 0;
                    }
                    return r1;
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function () {
                    r2 = r2 + 0.1;
                    if (r2 >= 5) {
                        r2 = 0;
                    }
                    return r2;
                }, false),
                height: height + 0.5,
                material: new Cesium.ImageMaterialProperty({
                    image: 'data:image/png;base64,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',
                    repeat: new Cesium.Cartesian2(1.0, 1.0),
                    transparent: true,
                    color: Cesium.Color.WHITE.withAlpha(1),
                }),
            }
        })
        bjt3D.gatherAlarmList.push(entity);
    },
}

export function drawPoint(position) {
    var pointGeometry = bjt3D.viewer.entities.add({
        position: position,
        point: {
            color: Cesium.Color.fLORALWHITE,
            pixelSize: 10,
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
    });
    return pointGeometry;
}

export function drawCustomizePoint(id, position, uri) {
    var pointGeometry = bjt3D.viewer.entities.add({
        position: new Cesium.CallbackProperty(function (time, result) {
            return position;
        }, false),
        id: id,
        billboard: {
            image: uri,
            width: 30,
            height: 30,
            scaleByDistance: new Cesium.NearFarScalar(0.8, 1.0, 1.0, 1.0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
    });
    return pointGeometry;
}

export function drawPolyline(positions, config) {
    if (positions.length < 1) return;
    var config = config ? config : {};
    var polylineGeometry = bjt3D.viewer.entities.add({
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

export function drawPolygon1(id, label, color, layer) {
    if (typeof layer === 'undefined') {
        return;
    }
    var polygon = bjt3D.viewer.entities.add({
        id: id,
        polygon: {
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

export function drawPolygon2(id, label, color, layer) {
    if (typeof layer === 'undefined') {
        return;
    }
    var polygon = bjt3D.viewer.entities.add({
        id: id,
        polygon: {
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

export function splineArray(o, n, s) {
    let control = [o, n];
    let spline = new Cesium.LinearSpline({
        times: [0.0, 1],
        points: control
    });
    let pointForFrame = [];
    for (let i = 0; i < s; i++) {
        pointForFrame.push(spline.evaluate(i / s));
    }
    return pointForFrame;
}

export function createLayer(pointArr, height) {
    var arr = [];
    for (let i = 0; i < pointArr.length; i++) {
        arr.push(pointArr[i].longitude);
        arr.push(pointArr[i].latitude);
        arr.push(height);
    }
    return arr;
}


export function clearHandler(handler) {
    handler.destroy();
    handler = null;
}

function createPlane(p1, p2, inverseTransform) {
    let p1C3 = getOriginCoordinateSystemPoint(p1, inverseTransform)
    let p2C3 = getOriginCoordinateSystemPoint(p2, inverseTransform)
    let up = new Cesium.Cartesian3(0, 0, 10)
    let left = Cesium.Cartesian3.subtract(p1C3, p2C3, new Cesium.Cartesian3())
    let normal = Cesium.Cartesian3.cross(left, up, new Cesium.Cartesian3())
    normal = Cesium.Cartesian3.normalize(normal, normal)
    let planeTmp = Cesium.Plane.fromPointNormal(p1C3, normal)
    return Cesium.ClippingPlane.fromPlane(planeTmp)
}

function getOriginCoordinateSystemPoint(point, inverseTransform) {
    let val = Cesium.Cartesian3.fromDegrees(point.lng, point.lat)
    return Cesium.Matrix4.multiplyByPoint(
        inverseTransform, val, new Cesium.Cartesian3(0, 0, 0))
}

function getInverseTransform(tileSet) {
    let transform
    let tmp = tileSet.root.transform
    if ((tmp && tmp.equals(Cesium.Matrix4.IDENTITY)) || !tmp) {
        transform = Cesium.Transforms.eastNorthUpToFixedFrame(tileSet.boundingSphere.center)
    } else {
        transform = Cesium.Matrix4.fromArray(tileSet.root.transform)
    }
    return Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4())
}

export default bjt3D
