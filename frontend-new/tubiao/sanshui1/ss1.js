function ajax({ url, method, headers, data, success, error }) {
    headers = headers || 'application/x-www-form-urlencoded; charset=UTF-8'
    var request;
    if(window.XMLHttpRequest) {
      request = new XMLHttpRequest()
  } else {
    request = new ActiveXObject('Microsoft.XMLHTTP')
  }
    if(method.toUpperCase() === 'POST') {
    request.open(method, url, true)
      request.setRequestHeader('Content-type', headers)
      request.send(data)
  } 
    if(method.toUpperCase() === 'GET') {
    request.open(method, url+"?"+data, true)
    request.send(null)
  }
    request.onload = function(progressEvent) {
        let response = progressEvent.currentTarget
        let {status, statusText, responseText, responseUrl} = response
        if(status > 199 && status < 400) {
            if(success) success(responseText)
        } else {
            if(error) error(statusText)
        }
    }
    request.onerror = function(error) {
        console.error(error)
    }
  }
//自定义请求
window.onload=function(){
    getData();
    setInterval(function(){
      getData();
    },5000);
  }
  function getData(){
    ajax({url:'/jxt/sanshui1',method:'post',data:{},success:function(data){
      data=JSON.parse(data);
      //console.info(data);
      if(data&&data.length>0){
        for(var i=0;i<data.length;i++){
          var d1=document.getElementById(data[i].id);
          //console.info(d1);
          if(d1){
            SetText(d1,data[i].memo+" : "+data[i].value);
          }
        }
      }
    }});
  }