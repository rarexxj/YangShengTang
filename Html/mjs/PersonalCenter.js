/**
 * Created by admin on 2016/8/24.
 */
$(function () {
    $.ADDLOAD();
    var userinfo = $.getUrlParam('userInfo');
    if(userinfo){
        //userinfo=decodeURIComponent(userinfo);
        userinfo=base64_decode(userinfo);
        // alert(userinfo)
        userinfo=eval("("+userinfo+")");
        sessionStorage.setItem('qy_loginToken',userinfo.PhoneNumber+':'+userinfo.DynamicToken);
        sessionStorage['qy_Identity']=userinfo.Id;
        sessionStorage['qy_UserName']=userinfo.UserName;
        //sessionStorage['qy_CreateTime']=rs.data.CreateTime;
        sessionStorage['qy_NickName']=encodeURIComponent(encodeURIComponent(userinfo.NickName));
        sessionStorage['qy_Sex']=userinfo.Sex;
        sessionStorage['qy_Birthday']=userinfo.Birthday;
        sessionStorage['qy_PhoneNumber']=userinfo.PhoneNumber;
        sessionStorage['qy_Province']=userinfo.Province;
        sessionStorage['qy_City']=userinfo.City;
        sessionStorage['qy_InvitationCode']=userinfo.InvitationCode;
        if(userinfo.Avatar != null){
            sessionStorage['qy_head']=userinfo.Id+'|'+userinfo.Avatar.SmallThumbnail;
        }
    }

    window.TOKEN=sessionStorage.getItem('qy_loginToken')
    if(window.TOKEN&&location.pathname.indexOf('/Html/Member/Login')<=-1){
        $.ajaxSetup({
            headers:{
                Authorization:'Basic '+base64encode(window.TOKEN)
            } 
        })
    }else if((window.TOKEN&&location.pathname.indexOf('/Html/Member/Login')>-1) || (!window.TOKEN&&location.pathname.indexOf('/Html/Products')>-1) || (!window.TOKEN&&location.pathname.indexOf('/Index.html')>-1) || (!window.TOKEN&&location.pathname.indexOf('/Html/Member/Register.html')>-1) || (!window.TOKEN&&location.pathname.indexOf('/Html/Member/Forget.html')>-1) || (!window.TOKEN&&location.pathname.indexOf('/Html/Member/Login.html')>-1) || (!window.TOKEN&&location.pathname.indexOf('/Html/Share')>-1)){
        //console.log('不用跳转登录页')
    }else{
        if(is_weixin()){
            window.location.replace('/WeiXin/Login');
        }else{
            window.location.replace('/Html/Member/Login.html');
        }
    }
    function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    $('.head .name').html(decodeURIComponent(decodeURIComponent(sessionStorage['qy_NickName'])));
    $('.head .ph').html(sessionStorage['qy_PhoneNumber']);
    if(sessionStorage['qy_head']){
        if(sessionStorage['qy_Identity']==sessionStorage['qy_head'].toString().split('|')[0]){
            $('.head .img img').attr('src',sessionStorage['qy_head'].toString().split('|')[1]);
        }
    }
 
    ajax();
    function ajax() {
        $.ajax({
            url:'/Api/v1/Member/CenterInfo',
            type:'get'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data);
            }else {
                if (rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    function view(rs) {
        if (!rs.Money||rs.Money=='null'){
            rs.Money = 0
        }
        if (!rs.Integral||rs.Integral=='null'){
            rs.Integral = 0
        }
        sessionStorage['qy_MemberType']=rs.MemberType;
        new Vue({
            el:'#per-cen',
            data:rs,
            ready:function () {
                $.RMLOAD();
                js();
            }
        })
    }
    function js() {
        $('.weixin .att').on('click',function () {
            $('.mask').stop().fadeIn();
        })
        $('.mask').on('click',function () {
            $(this).stop().fadeOut();
        })
    }

    // function base64_encode(){
    //     var str=CryptoJS.enc.Utf8.parse($("#source").val());
    //     var base64=CryptoJS.enc.Base64.stringify(str);
    //     $("#result").val(base64);
    // }
    function base64_decode(str){
        var words  = CryptoJS.enc.Base64.parse(str);
        words = words.toString(CryptoJS.enc.Utf8);
        return words
    }

})