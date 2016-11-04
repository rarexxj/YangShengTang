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


    // window.TOKEN = localStorage.getItem('qy_loginToken')
    //
    //
    //
    // if (window.TOKEN && location.pathname.indexOf('/Html/Member/Login') <= -1) {
    //     $.ajaxSetup({
    //         headers: {
    //             Authorization: 'Basic ' + base64encode(window.TOKEN)
    //         }
    //     })
    // } else if ((window.TOKEN && location.pathname.indexOf('/index1.html') > -1) || (window.TOKEN && location.pathname.indexOf('/Html/Member/Login') > -1) || (!window.TOKEN && location.pathname.indexOf('/Html/Products') > -1) || (!window.TOKEN && location.pathname.indexOf('/Index.html') > -1) || (!window.TOKEN && location.pathname.indexOf('/Html/Member/Register.html') > -1) || (!window.TOKEN && location.pathname.indexOf('/Html/Member/Forget.html') > -1) || (!window.TOKEN && location.pathname.indexOf('/Html/Member/Login.html') > -1) || (!window.TOKEN && location.pathname.indexOf('/Html/Share') > -1) || (!window.TOKEN && location.pathname.indexOf('/Html/Member/WeChatBind.html') > -1)) {
    //     //console.log('不用跳转登录页')
    // } else {
    //     if (is_weixin()) {
    //         window.location.replace('/WeiXin/Login');
    //     } else {
    //         window.location.replace('/Html/Member/Login.html');
    //     }
    // }


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
//判断是否为微信
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
//登录错误跳回登录页
function Backlog(backUrl) {
    if (is_weixin()) {
        var backUrls = backUrl ? backUrl : (location.pathname + location.search)
        alert(backUrls)
        window.location.replace("/WeiXin/Login" + (backUrls ? ('?backUrl=' + backUrls) : ''))
    } else {
        window.location.href = "/Html/Member/Login.html"
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

function oppo(msg, time, callback) {
    var html = '<div class="oppo">' + msg + '</div>';
    $('body').append(html);
    setTimeout(function () {
        $('.oppo').remove()
        if (typeof(callback) == 'function') {
            callback()
        } else {

        }
    }, time * 1000)
}

function CountDown(obj) {
    var t = 60;
    var timer = setInterval(function () {
        if (t == 0) {
            obj.html('获取验证码');
            obj.removeClass('on')
            clearInterval(timer);
        } else {
            obj.html(t + '秒后重发');
            t--;
        }

    }, 1000)
}
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function base64_decodes(str) {
    var words = CryptoJS.enc.Base64.parse(str);
    words = words.toString(CryptoJS.enc.Utf8);
    return words
}

function base64encode(str) {
    //var encryptedHexStr = CryptoJS.enc.Base64.parse(str);
    var encryptedHexStr = CryptoJS.enc.Utf8.parse(str)
    console.log(str)
    var words = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    console.log(words)
    return words
}


var userinfo = $.cookie('userInfo');

if (userinfo) {

    //userinfo=decodeURIComponent(userinfo);
    userinfo = base64_decodes(userinfo);

    // alert(userinfo)
    userinfo = JSON.parse(userinfo);

    localStorage.setItem('qy_loginToken', userinfo.PhoneNumber + ':' + userinfo.DynamicToken);
    localStorage['qy_Identity'] = userinfo.Id;
    localStorage['qy_UserName'] = userinfo.UserName;
    //localStorage['qy_CreateTime']=rs.data.CreateTime;
    localStorage['qy_NickName'] = encodeURIComponent(encodeURIComponent(userinfo.NickName));
    localStorage['qy_Sex'] = userinfo.Sex;
    localStorage['qy_Birthday'] = userinfo.Birthday;
    localStorage['qy_PhoneNumber'] = userinfo.PhoneNumber;
    localStorage['qy_Province'] = userinfo.Province;
    localStorage['qy_City'] = userinfo.City;
    localStorage['qy_InvitationCode'] = userinfo.InvitationCode;
    if (userinfo.Avatar != null) {
        localStorage['qy_head'] = userinfo.Id + '|' + userinfo.Avatar.SmallThumbnail;
    }
    $.removeCookie('userInfo', {path: '/'})
}

window.TOKEN = localStorage.getItem('qy_loginToken')
if (!window.TOKEN) {

    if (/index/i.test(location.pathname) || /\/Html\/hotsell\/shangpfl/i.test(location.pathname) || /\/Html\/Member\/Login/i.test(location.pathname) || (!window.TOKEN && /\/Html\/Products/i.test(location.pathname)) || (!window.TOKEN && /\/Html\/Member\/Register.html/i.test(location.pathname)) || (!window.TOKEN && location.pathname.match(/\/Html\/Member\/Forget/i)) || (!window.TOKEN && /\/Html\/Member\/Login\.html/i.test(location.pathname)) || (!window.TOKEN && /\/Htm\/Share/i.test(location.pathname)) || (!window.TOKEN && /\/Html\/Member\/WeChatBind/i.test(location.pathname))) {

    } else {

        if (is_weixin()) {

            window.location.replace('/WeiXin/Login?backUrl=' + location.pathname + location.search);
        } else {
            window.location.replace('/Html/Member/Login.html');
        }
    }
} else {

    

    $.ajaxSetup({
        cache :false,
        headers: {
            Authorization: 'Basic ' + base64encode(window.TOKEN)
        }
    })
}
