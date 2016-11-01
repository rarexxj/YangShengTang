/**
 * Created by admin on 2016/8/25.
 */
$(function () {
    $.RMLOAD();
    $('.get').on('click',function () {
        if($(this).hasClass('on')){
            return false
        }else{
            if ($('#oph').val()=="") {
                oppo("请输入旧手机号", 1);
                return false;
            }else{
                $(this).addClass('on');
                var data = {
                    PhoneNumber:$('#oph').val(),
                    RequestType:'2'
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

        }).always(function () {
            $('.get').removeClass('on')
        })
    }
    $('.get2').on('click',function () {
        if($(this).hasClass('on')){
            return false
        }else{
            if ($('#nph').val()=="") {
                oppo("请输入新手机号", 1);
                return false;
            }else{
                $(this).addClass('on');
                var data = {
                    PhoneNumber:$('#nph').val(),
                    RequestType:'2'
                }
                ajax3(data)
            }
        }
    })
    function ajax3(data) {
        $.ajax({
            url:'/Api/v1/Member/SendCode',
            type:'post',
            data:data
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                oppo('验证码已发送',1)
                CountDown($('.get2'));
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }

        }).always(function () {
            $('.get2').removeClass('on')
        })
    }

    $('.submit').on('click',function (){
        if ($(this).hasClass('cur')){
            return false
        }else{
            $(this).addClass('gray');
            if ($('#oph').val()=="") {
                oppo("请输入旧手机号", 1);
                return false;
            }else if($('#oyzm').val()==""){
                oppo("请输入验证码", 1);
                return false;
            }else if($('#yzm').val()==""){
                oppo("请输入验证码", 1);
                return false;
            }else if($('#nph').val()==""){
                oppo("请输入新手机号", 1);
                return false;
            }else{
                var data = {
                    PhoneNumber:$('#oph').val(),
                    SmsVerifyCode:$('#oyzm').val(),
                    NewPhoneNumber:$('#nph').val(),
                    NewSmsVerifyCode:$('#yzm').val()
                }
                ajax1(data)
            }
        }
    })
    function ajax1(data) {
        $.ajax({
            url:'/Api/v1/Member/'+localStorage['qy_Identity']+'/PhoneNumber',
            type:'patch',
            data:data
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                oppo('修改成功',1)
                window.location.href="/Html/Member/Login.html";
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