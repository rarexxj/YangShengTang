/**
 * Created by admin on 2016/8/24.
 */
$(function () {
    $.RMLOAD();
    $('.submit').on('click',function () {
        if ($('#opw').val()=="") {
            //toolTips(0, "请输入手机号", 1);
            oppo('请输入旧密码',1)
            return false;
        }
        if ($('#npw').val()=="") {
            //toolTips(0, "请输入手机号", 1);
            oppo('请输入新密码',1)
            return false;
        }
        if ($('#spw').val()=="") {
            //toolTips(0, "请输入手机号", 1);
            oppo('请输入确认密码',1)
            return false;
        }
        if ($('#npw').val() != $('#spw').val()){
            oppo('两次密码不一致',1)
            return false;
        }
        var data={
            Password:$('#opw').val(),
            NewPassword:$('#npw').val()
        }
        if ($(this).hasClass('gray')){
            return false;
        }else{
            $(this).addClass('gray')
            ajax(data);
        }

    })

    function ajax(data) {
        $.ajax({
            url:'/Api/v1/Member/'+ localStorage['qy_Identity'] +'/Password',
            type:'PATCH',
            data:data
        }).done(function (rs) {

            if(rs.returnCode == '200'){

                $('.success').fadeIn();
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