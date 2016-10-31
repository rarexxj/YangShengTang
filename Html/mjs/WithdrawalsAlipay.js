/**
 * Created by admin on 2016/9/9.
 */
$(function () {
    var money = parseFloat($.getUrlParam('money'));
    //验证码
    $('.get').on('click',function () {
        if($('.get').hasClass('on')){
            return false
        }else{
            $('.get').addClass('on');
            ajax2()
        }

    })
    function ajax2() {
        $.ajax({
            url:'/Api/v1/Wallet/SendCode',
            type:'post'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                oppo('验证码已经发送',1)
                CountDown($('.get'));
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    //提交
    $('.submit').on('click',function () {
        if ($(this).hasClass('gray')){
            return false
        }else{
            if ($('.yzm').val()==''){
                oppo('请输入验证码',1)
            }else if($('.zh').val()==''){
                oppo('请输入支付宝账号',1)
            }else{
                $('.submit').addClass('gray');
                ajax();
            }
        }
    })
    function ajax() {
        $.ajax({
            url:"/Api/v1/Wallet",
            type:'post',
            data:{
                Account:$('.zh').val(),
                Money:money,
                SmsVerifyCode:$('.yzm').val()
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                oppo('申请成功',1,function () {
                    window.location.href="/Html/Member/PersonalCenter.html"
                })
                CountDown($('.get'));
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        }).always(function () {
            $('.submit').removeClass('gray');
        })
    }
})