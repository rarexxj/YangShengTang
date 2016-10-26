/**
 * Created by admin on 2016/9/11.
 */
/**
 * Created by admin on 2016/8/16.
 */
$(function () {


//rem
    function set_font() {
        // 计算、转换布局单位
        var html = document.getElementsByTagName('html')[0];

        var designFontSize = 100,
            designWidth = 640;
        function setFontSize() {
            var winWidth = document.documentElement.getBoundingClientRect().width;
            var fontSize = winWidth / designWidth * designFontSize;

            html.style.fontSize = fontSize + 'px';
        }
        setFontSize();
        window.addEventListener('resize', function () {
            setFontSize();
        });

        return this;
    }

    set_font()

    
// window.__URL = {
//     'jk': '/c_jinboli/index.php',
//     'img': '/c_jinboli/upload/',
//     'static': '/c_jinboli/static/',
//     'href': '/c_jinboli/index.php'
// }


//删除HTML里面标签
    $.DELHTML = function (str) {
        return str ? str.replace(/<[^>].*?>/g, "") : str;
    }

//获取URL上参数
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
    }

//移除LOADING
    $.RMLOAD = function () {

        (!$('.new-loading').length) || $('.new-loading').remove();
        (!$('.news-loading').length) || $('.news-loading').remove();
    }
//添加LOADING
    $.ADDLOAD = function () {
        var html = '<div class="new-loading"><ul class="small-loading"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></div>'
        if (!$('.new-loading').length) {
            $('body').append(html);
        }
    }



    

})

//提示框
function toolTips(status, msg, time, callback) {
    var title = "";
    var titleBg = "";
    if (status == 1) {
        title = '成功';
        titleBg = 'background-color:green; color:#fff;';
    } else {
        title = '失败';
        titleBg = 'background-color:red; color:#fff;';
    }
    layer.open({
        title: [
            title,
            titleBg
        ],
        content: msg,
        time: time, //2秒后自动关闭
        end: callback
    });
}
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
//登录错误跳回登录页
function Backlog() {
    if(is_weixin()){
        window.location.href="/WeiXin/Login"
    }else{
        window.location.href="/Html/Member/Login.html"
    }
}
//价格截取
function GetPrice(amo) {
    var price = amo.attr('data-price').split('.');
    var intn = price[0];
    var decn = price[1];
    amo.find('.int').html(intn);
    amo.find('.dec').html(decn);
}
function oppo(msg,time,callback) {
    var html='<div class="oppo">'+msg+'</div>';
    $('body').append(html);
    setTimeout(function () {
        $('.oppo').remove()
        if(typeof (callback) == 'function'){
            callback()
        }else{

        }
    },time*1000)
}
function CountDown(obj){
    var t = 60;
    var timer = setInterval(function () {
        if (t==0){
            obj.html('获取验证码');
            obj.removeClass('on')
            clearInterval(timer);
        }else{
            obj.html(t+'秒后重发');
            t--;
        }

    },1000)
}
var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64decodechars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64encodechars.charAt(c1 >> 2);
            out += base64encodechars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64encodechars.charAt(c1 >> 2);
            out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            out += base64encodechars.charAt((c2 & 0xf) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64encodechars.charAt(c1 >> 2);
        out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
        out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
        out += base64encodechars.charAt(c3 & 0x3f);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;

    i = 0;
    out = "";
    while (i < len) {

        do {
            c1 = base64decodechars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;

        do {
            c2 = base64decodechars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64decodechars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));

        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64decodechars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}