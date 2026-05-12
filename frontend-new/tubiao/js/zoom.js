(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.$solway = global.$solway || {})));
}(window, ((exports) => {


    const zoom = ({ scale = 1, minScale = 0.1, maxScale = 14, ele, rate = 0.1, translate = [0, 0] }) => {

        const obj = $(ele).css({
            'transition': 'all 0.1s', '-moz-transition': 'all 0.1s', '-webkit-transition': 'all 0.1s', '-o-transition': 'all 0.1s', position: 'absolute', cursor: 'pointer', left: 0, top: 0
        }).on("mousewheel DOMMouseScroll", mouseWheelHandel);

        scaleFunc(0, true);

        function mouseWheelHandel(e) {
            const delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
            if (delta > 0) return scaleFunc(rate);
            else if (delta < 0) return scaleFunc(-rate);
        }

        function scaleFunc(val, origin) {
            scale += (val * scale);
            scale = scale <= minScale ? minScale : scale;
            scale = scale >= maxScale ? maxScale : scale;
            if (scale <= minScale || scale >= maxScale) return false;
            obj.css({
                'transform': 'matrix(' + scale + ',0,0,' + scale + ', ' + translate[0] + ',' + translate[1] + ')',
                '-ms-transform': 'matrix(' + scale + ',0,0,' + scale + ', ' + translate[0] + ',' + translate[1] + ')',
                '-moz-transform': 'matrix(' + scale + ',0,0,' + scale + ', ' + translate[0] + ',' + translate[1] + ')',
                '-webkit-transform': 'matrix(' + scale + ',0,0,' + scale + ', ' + translate[0] + ',' + translate[1] + ')',
                '-o-transform': 'matrix(' + scale + ',0,0,' + scale + ', ' + translate[0] + ',' + translate[1] + ')',
            });
            return false;
        }

        return {
            scale(n) {
                scaleFunc(n - scale);
            },
            destroy() {
                obj.off("mousewheel DOMMouseScroll", mouseWheelHandel);
            }
        };
    };

    exports.zoom = zoom;
})));