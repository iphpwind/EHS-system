
var _tmSender = new Array();
var _tmAttr = new Array();
var _tmTimerId = new Array();

function parseBoolean( s )
{
  return ( s.localeCompare( "true" ) == 0 );
};
function GetPropertyValue( Sender, ParamName )
{
  var ret = 0;
  var s = Sender.getAttribute( "onget" + ParamName );
  if( s == null )
  {
    if( ParamName == "angle" )
      return GetAngle( Sender );
    else if( ParamName == "text" )
      return GetText( Sender );
    else if( ParamName == "visible" )
      return GetVisible( Sender );
    else if( ParamName == "picture" )
      return GetPicture( Sender );
    else
     s = Sender.getAttribute( ParamName );
  }else
    eval( s );
  return ret;
};
function SetPropertyValue( Sender, ParamName, Value )
{
  var s = Sender.getAttribute( "onset" + ParamName );
  if( s == null )
  {
    if( ParamName == "angle" )
      SetAngle( Sender, Value );
    else if( ParamName == "text" )
      SetText( Sender, Value );
    else if( ParamName == "visible" )
      SetVisible( Sender, Value );
    else if( ParamName == "picture" )
      SetPicture( Sender, Value );
    else
      Sender.setAttribute( ParamName, Value );
  }else
    eval( s );
};
function GetUnitCount( Sender )
{
  var ret = 0;
  for( var i = 0; i < Sender.childNodes.length; i++ )
  {
    if( Sender.childNodes[i].nodeType == 1 )
      ret++;
  };
  return ret;
};
function GetUnits( Sender, ndx )
{
  var m = 0;
  for( var i = 0; i < Sender.childNodes.length; i++ )
  {
    if( Sender.childNodes[i].nodeType == 1 )
    {
      if( m == ndx )
      {
        m = i;
        break;
      };
      m++;
     };
  };
  return Sender.childNodes[m];
};
function GetUnitByName( Sender, AName )
{
  for( var i = 0; i < Sender.childNodes.length; i++ )
  {
    var d = Sender.childNodes[i];
    if( d.nodeType == 1 )
    {
      if( d.id == AName )
        return d;
     };
  };
  return 0;
};
function gettransform( Sender, pname )
{
  var s = Sender.getAttribute( "transform" );
  var ndx1 = s.indexOf( pname );
  if( ndx1 != -1 )
  {
    ndx1 += pname.length;
    if( s.charAt( ndx1 ) == "(" )
    {
      var ndx2 = s.indexOf( ")", ndx1 );
      if( ndx2 != -1 )
        return s.substr( ndx1 + 1, ndx2 - ndx1 - 1 );
    };
  };
  return "0";
};
function settransform( Sender, pname, avalue )
{
  var s = Sender.getAttribute( "transform" );
  var ndx1 = s.indexOf( pname );
  if( ndx1 != -1 )
  {
    ndx1 += pname.length;
    if( s.charAt( ndx1 ) == "(" )
    {
      var ndx2 = s.indexOf( ")", ndx1 );
      if( ndx2 != -1 )
      {
        Sender.setAttribute( "transform", s.substr( 0, ndx1 + 1 ) + avalue + s.substr( ndx2 ) );
        return;
      };
    };
  };
  s = s + "," + pname + "(" + avalue + ")";
  Sender.setAttribute( "transform", s );
};
function GetXOrigin( Sender )
{
  var s = gettransform( Sender, "translate" );
  var ar = s.split(" ");
  if( ar.length == 2 )
    return parseFloat( ar[0] );
  return 0;
};
function GetYOrigin( Sender )
{
  var s = gettransform( Sender, "translate" );
  var ar = s.split(" ");
  if( ar.length == 2 )
    return parseFloat( ar[1] );
  return 0;
};
function MoveBy( Sender, dx, dy )
{
  var s = gettransform( Sender, "translate" );
  var ar = s.split( " " );
  if( ar.length == 2 )
  {
    var x = parseFloat( ar[0] ) + dx;
    var y = parseFloat( ar[1] ) + dy;
    settransform( Sender, "translate", x.toString() + "," + y.toString() );
  };
};
function MoveTo( Sender, x, y )
{
  settransform( Sender, "translate", x + "," + y );
};
function CopyUnit( Sender, child )
{
  return Sender.appendChild( child.cloneNode( true ) );
};
function DeleteUnit( Sender, child )
{
  Sender.removeChild( child );
};
function BringToFront( Sender, child )
{
  Sender.appendChild( child );
};
function SendToBack( Sender, child )
{
  Sender.insertBefore( child, Sender.childNodes[0] );
};
function GetAngle( Sender )
{
  var s = gettransform( Sender, "rotate" );
  var d = parseFloat( s );
  return d;
};
function SetAngle( Sender, ag )
{
  settransform( Sender, "rotate", ag.toFixed() );
};
function GetText( Sender )
{
  return Sender.textContent;
};
function SetText( Sender, AText )
{
  Sender.textContent = AText;
};
function GetPicture( Sender )
{
  return Sender.getAttribute( "xlink:href" );
};
function SetPicture( Sender, afile )
{
  Sender.setAttribute( "xlink:href", afile );
};
function GetVisible( Sender, vis )
{
  var s = Sender.getAttribute( "visibility" );
  if( s == "visible" )
    return true;
  else
    return false;
};
function SetVisible( Sender, vis )
{
  if( vis == true )
    Sender.setAttribute( "visibility", "visible" );
  else
    Sender.setAttribute( "visibility", "hidden" );
};
function GetTimerSender( ndx )
{
  return _tmSender[ndx];
};
function SetTimer( Sender, Attr, Interval, ontimer )
{
  var i = 0;
  for( i = 0; i < _tmSender.length; i++ )
  {
    if( _tmSender[i] == Sender && _tmAttr[i] == Attr )
    {
      clearInterval( _tmTimerId[i] );
      _tmTimerId[i] = 0;
      break;
    };
  };
  if( i == _tmSender.length )
  {
    _tmSender.push( Sender );
    _tmAttr.push( Attr );
    _tmTimerId.push( 0 );
  };
  if( Interval > 0 )
  {
    var s = ontimer;
    if( ontimer == null )
      s = Sender.getAttribute( "timer" );
    s = "Sender = GetTimerSender( " + i + " );" + s;
    _tmTimerId[i] = setInterval( s, Interval );
  };
};

function ClearTimer()
{
  var i = 0;
  var n = _tmSender.length;
  for( i = 0; i < n; i++ )
  {
    if( _tmTimerId[i] != 0 )
    {
      clearInterval( _tmTimerId[i] );
      break;
    };
  };
  _tmSender.splice( 0, n );
  _tmAttr.splice( 0, n );
  _tmTimerId.splice( 0, n );
};

function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

/*
var svg = document.getElementById("main");
var scale = 1;
//绑定鼠标滑轮事件
if(document.addEventListener){
  document.addEventListener('DOMMouseScroll',scrollZoom,false);
}
window.onmousewheel=document.onmousewheel=scrollZoom;


//滑轮滚动处理事件，向上滚放大
//{Object} e 事件对象
function scrollZoom(e){
  e=e || window.event;
  //e.detail用来兼容 FireFox
  e.wheelDelta>0 || e.detail >0?zoom(1.1):zoom(0.9);
}
//svg放缩
//{Float} num 放缩的倍数
function zoom(num){
  let svgPanel=document.getElementById("main");
  if(num){
    scale *= num;
  }
  else{
    scale = 1;
  }
  svgPanel.setAttribute("transform","scale("+scale+")");
}
window.onmousedown=document.onmousedown=selectElement;
var selectedElement = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = 0;

function selectElement(evt) {
  selectedElement = evt.target;
  currentX = evt.clientX;
  currentY = evt.clientY;
  currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7,-1).split(' ');

    for(var i=0; i<currentMatrix.length; i++) {
      currentMatrix[i] = parseFloat(currentMatrix[i]);
    }

  selectedElement.setAttributeNS(null, "onmousemove", "moveElement(evt)");
}
function moveElement(evt){
  dx = evt.clientX - currentX;
  dy = evt.clientY - currentY;
  currentMatrix[4] += dx;
  currentMatrix[5] += dy;
  newMatrix = "matrix(" + currentMatrix.join(' ') + ")";

  selectedElement.setAttributeNS(null, "transform", newMatrix);
  currentX = evt.clientX;
  currentY = evt.clientY;
}
function deselectElement(evt){
  if(selectedElement != 0){
    selectedElement.removeAttributeNS(null, "onmousemove");
    selectedElement.removeAttributeNS(null, "onmouseout");
    selectedElement.removeAttributeNS(null, "onmouseup");
    selectedElement = 0;
  }
}*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//上面是Visual Graph图形导出svg后常用的通用函数部分
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
