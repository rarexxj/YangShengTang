/**
 * Created by admin on 2016/8/24.
 */
$(function () {
    $('.get').on('click',function () {
        if($(this).hasClass('on')){
            return false
        }else{
            if ($('#ph').val()=="") {
                oppo("请输入手机号", 1);
                return false;
            }else{
                $(this).addClass('on');
                var data = {
                    PhoneNumber:$('#ph').val(),
                    RequestType:'1'
                }
                ajax2(data)
            }
        }
    })
    function ajax2(data) {
        $.ajax({
            url:'/Api/v1/Member/SendCode',
            type:'post',
            data:data
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                oppo('验证码已发送',1)
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
    $('.submit').on('click',function (){
        if ($(this).hasClass('cur')){
            return false
        }else{
            if ($('#ph').val()=="") {
                oppo("请输入手机号", 1);
                return false;
            }else if($('#yzm').val()==""){
                oppo("请输入验证码", 1);
                return false;
            }else if($('#npw').val()==""){
                oppo("请输入新密码", 1);
                return false;
            }else{
                $(this).addClass('gray');
                var data = {
                    PhoneNumber:$('#ph').val(),
                    SmsVerifyCode:$('#yzm').val(),
                    Password:$('#npw').val(),
                }
                ajax1(data)
            }
        }
    })
    function ajax1(data) {
        $.ajax({
            url:'/Api/v1/Member/ResetPassword',
            type:'patch',
            data:data
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                oppo('重置成功',1,function () {
                    window.location.href="/Html/Member/Login.html";
                })

            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        }).always(function () {
            $('.submit').removeClass('gray')
        })

    }
})