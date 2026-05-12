/**
 * 发起websocket请求函数
 * @param {object} wsObj  - ws对象
 *  @param {string} type  - 操作websocket：销毁close、创建create
 *  @param {number} timeout  - 心跳间隔时长，默认5000ms
 * @param sendHeartBeat  - 以心跳，内容体区分string、object
 * @param {function} msgCallback  - 接收到ws数据，对数据进行处理的回调函数
 * @param {function} reCallback  - ws每次重连时，暴露对外的回调函数
 */
export function websocketCommand(wsObj, type, timeout = 5000, sendHeartBeat, msgCallback, reCallback) {
    let wsDestroy = 'close';  //  销毁标志
    let timeoutObj = null;  // 心跳倒计时
    let serverTimeoutObj = null;  // 服务器心跳倒计时
    let timeoutnum = null;  // 断开 重连倒计时

    // 若type传入close，则意图销毁websocket
    if (type === 'close') {
        clearTimeout(timeoutObj);
        clearTimeout(serverTimeoutObj);
        onClose();
    }
    // 若type传入create，则意图新建websocket，需初始化ws并发送心跳
    if (type === 'create') {
        initWebsocket();
        websocketSend();
    }

    function initWebsocket() {
        if (wsDestroy == 'close') {
            return
        }
        if (typeof (WebSocket) === 'undefined') {
            ('您的浏览器不支持WebSocket，无法获取数据');
            return false;
        }
        wsObj.onmessage = function (e) {
            onMessage(e)
        };
        wsObj.onopen = function () {
            onOpen()
        };
        wsObj.onerror = function () {
            onError()
        };
        wsObj.onclose = function () {
            onClose()
        };
    }

    function websocketSend() {
        // 加延迟是为了尽量让ws连接状态变为OPEN
        setTimeout(() => {
            // 添加状态判断，当为OPEN时，发送消息
            if (wsObj.readyState === wsObj.OPEN) { // wsObj.OPEN = 1
                if (typeof sendHeartBeat == 'string') {
                    // 若发送基本类型数据作为心跳，如字符串，直接将参数发送给服务端
                    wsObj.send(sendHeartBeat)
                } else {
                    // 若发送复杂类型数据作为心跳，如对象，则以回调方式暴露出去（得以支持动态数据）
                    sendHeartBeat();
                }
            }
        }, 500)
    }

    function onMessage(evt) {
        var received_msg = evt && JSON.parse(evt.data);
        msgCallback(received_msg);

        // 收到服务器信息, 重置服务器心跳
        start();
    }

    function onError() {
        // 断网重连机制
        if (wsDestroy !== 'close') {
            reconnect();
        }
    }

    function onOpen() {
        console.log("ws_open");
        // 连接成功向服务器发送信息，并开启心跳
        websocketSend();
        start();
    }

    function reconnect() {
        // 没连接上会一直重连，设置延迟避免请求过多
        timeoutnum && clearTimeout(timeoutnum);
        timeoutnum = setTimeout(function () {
            console.log(wsDestroy)
            if (wsDestroy !== 'close') {
                // 重连
                wsObj?.close?.();
                let url = wsObj.url
                wsObj = new WebSocket(url)
                initWebsocket();
            }
        }, 1000);
    }

    function start() {
        // 清计时器
        timeoutObj && clearTimeout(timeoutObj);
        serverTimeoutObj && clearTimeout(serverTimeoutObj);
        // 开启心跳
        timeoutObj = setTimeout(function () {
            // if (wsObj.readyState == 1) {
            //     // 如果连接正常，发送心跳（服务端收到后会返回一条消息）
            //     websocketSend();
            // } else {
            //     // 否则重连
            //     if (wsDestroy !== 'close') {
            //         reconnect();
            //     }
            // }
            // 超时关闭
            serverTimeoutObj = setTimeout(function () {
                wsObj.close();
            }, timeout);
        }, timeout);
    }

    function onClose() {
        if (wsDestroy !== 'close' && wsDestroy != null) {
            console.log('这是重连')
            // 重连机制
            reconnect();
        } else {
            // 如果ws连接正常，则清计时器、断开连接
            clearTimeout(timeoutObj);
            clearTimeout(serverTimeoutObj);
            if (wsObj?.close) { // 检查wsObj是否存在close方法
                wsObj.close();
            }
        }
    }

}
