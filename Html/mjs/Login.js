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
        if ($('#pw').val() == "") {
            //toolTips(0, "请输入密码", 1);
            oppo('请输入密码', 1)
            return false;
        }
        var data = {
            PhoneNumber: $('#ph').val(),
            Password: $('#pw').val(),
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
            url: '/Api/v1/Login',
            type: 'post',
            data: data
        }).done(function(rs) {

            if (rs.returnCode == '200') {
                sessionStorage.setItem('qy_loginToken', data.PhoneNumber + ':' + rs.data.DynamicToken);
                sessionStorage['qy_Identity'] = rs.data.Id;
                sessionStorage['qy_UserName'] = rs.data.UserName;
                //sessionStorage['qy_CreateTime']=rs.data.CreateTime;
                sessionStorage['qy_NickName'] = encodeURIComponent(encodeURIComponent(rs.data.NickName));
                sessionStorage['qy_Sex'] = rs.data.Sex;
                sessionStorage['qy_Birthday'] = rs.data.Birthday;
                //sessionStorage['qy_Avatar']=rs.data.Avatar;
                sessionStorage['qy_PhoneNumber'] = rs.data.PhoneNumber;
                sessionStorage['qy_Province'] = rs.data.Province;
                sessionStorage['qy_City'] = rs.data.City;
                sessionStorage['qy_InvitationCode'] = rs.data.InvitationCode;
                if (rs.data.Avatar != null) {
                    sessionStorage['qy_head'] = rs.data.Id + '|' + rs.data.Avatar.SmallThumbnail;
                }

                // sessionStorage['qy_UserName']=rs.data.UserName;
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

})
