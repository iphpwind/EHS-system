(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.$solway = global.$solway || {})));
}(window, ((exports) => {

    const drag = ({ele: dv}) => {
        dv.setAttribute('style', (dv.getAttribute('style') || '') + 'position: absolute;transition: all 0.1s ease 0s;-webkit-transition: all 0.1s ease 0s;-o-transition: all 0.1s ease 0s;-moz-transition: all 0.1s ease 0s;-moz-user-select: -moz-none; -moz-user-select: none; -o-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;');
        let x = 0;
        let y = 0;
        let l = 0;
        let t = 0;
        let isDown = false;
        dv.addEventListener('mousedown', eleMousedown);
        document.addEventListener('mousemove', eleMousemove);
        dv.addEventListener('mouseup', eleMouseup);
        
        
        //鼠标按下事件
        function eleMousedown (e) {
            //获取x坐标和y坐标
            x = e.clientX;
            y = e.clientY;

            //获取左部和顶部的偏移量
            l = dv.offsetLeft;
            t = dv.offsetTop;
            //开关打开
            isDown = true;
            //设置样式  
            dv.style.cursor = 'move';
            return false;
        }
        //鼠标移动
        function eleMousemove (e) {
            if (isDown == false) {
                return;
            }
            //获取x和y
            const nx = e.clientX;
            const ny = e.clientY;
            //计算移动后的左偏移量和顶部的偏移量
            const nl = nx - (x - l);
            const nt = ny - (y - t);

            dv.style.left = nl + 'px';
            dv.style.top = nt + 'px';
            return false;
        }
        //鼠标抬起事件
        function eleMouseup () {
            //开关关闭
            isDown = false;
            dv.style.cursor = 'default';
            return false;
        }
        return {
            destroy() {
                dv.removeEventListener('mousedown', eleMousedown);
                document.removeEventListener('mousemove', eleMousemove);
                dv.removeEventListener('mouseup', eleMouseup);                
                dv = null;
            }
        }
    };

    exports.drag = drag;
})));