/**
 * Created by admin on 2016/8/17.
 */
$(function() {
    var openid = $.getUrlParam('openId');
    $('.submit').on('click', function() {
        if ($('#ph').val() == "") {
            //toolTips(0, "请输入手机号", 1);
            oppo('请输入手机号', 1)
            return false;
        }
        if ($('#yzm').val() == "") {
            //toolTips(0, "请输入密码", 1);
            oppo('请输入验证码', 1)
            return false;
        }
        var data = {
            PhoneNumber: $('#ph').val(),
            SmsVerifyCode: $('#yzm').val(),
            MobileDevice: '',
            OpenId: openid
        }
        if ($(this).hasClass('gray')) {
            return false;
        } else {
            $(this).addClass('gray')
            ajax(data);
        }
    })

    function ajax(data) {
        $.ajax({
            url: '/Api/v1/LoginWithSms',
            type: 'post',
            data: data
        }).done(function(rs) {

            if (rs.returnCode == '200') {
                localStorage.setItem('qy_loginToken', data.PhoneNumber + ':' + rs.data.DynamicToken);
                localStorage['qy_Identity'] = rs.data.Id;
                localStorage['qy_UserName'] = rs.data.UserName;
                //localStorage['qy_CreateTime']=rs.data.CreateTime;
                localStorage['qy_NickName'] = encodeURIComponent(encodeURIComponent(rs.data.NickName));
                localStorage['qy_Sex'] = rs.data.Sex;
                localStorage['qy_Birthday'] = rs.data.Birthday;
                //localStorage['qy_Avatar']=rs.data.Avatar;
                localStorage['qy_PhoneNumber'] = rs.data.PhoneNumber;
                localStorage['qy_Province'] = rs.data.Province;
                localStorage['qy_City'] = rs.data.City;
                localStorage['qy_InvitationCode'] = rs.data.InvitationCode;
                if (rs.data.Avatar != null) {
                    localStorage['qy_head'] = rs.data.Id + '|' + rs.data.Avatar.SmallThumbnail;
                }

                // localStorage['qy_UserName']=rs.data.UserName;
                oppo('登录成功', 1, function() {
                    window.location.href = "/Html/Member/PersonalCenter.html"
                })
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }
        }).always(function() {
            $('.submit').removeClass('gray')
        })

    }
    //验证码
    $('.get').on('click',function () {
        if ($('#ph').val()=="") {
            oppo("请输入手机号", 1);
        }else{
            if($('.get').hasClass('on')){
                return false
            }else{
                $('.get').addClass('on');
                var data = {
                    PhoneNumber:$('#ph').val(),
                    RequestType:'3'
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

})
