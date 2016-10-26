/**
 * Created by admin on 2016/9/12.
 */
$(function () {
    $.ADDLOAD();
    var code =$.getUrlParam('code');
    if(sessionStorage['qy_loginToken']){
        $('.goindex').hide();
        $('.goreg').hide();
    }else{
        $('.wxshare').hide();
        sessionStorage['qy_invited']=code
    }
    $('.goindex').on('click',function () {
        window.location.href="/Index.html"
    })
    $('.goreg').on('click',function () {
        if(is_weixin()){
            window.location.href="/WeiXin/Login"
        }else{
            window.location.href="/Html/Member/Register.html"
        }

    })
    $('.wxshare').on("click",function () {
        if(is_weixin()){
            $('.mask').fadeIn();
        }
    })
    $('.mask').on('click',function () {
        $('.mask').fadeOut();
    })
    //判断是否为微信
    function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    ajax();
    function ajax() {
        $.ajax({
            url:"/Api/v1/Page/05",
            type:"get",
            data:{
                key:'05'
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data)
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    function view(rs) {
        new Vue({
            el:'#textarea',
            data:rs,
            ready:function () {
                $.RMLOAD();
            }
        })
    }
})