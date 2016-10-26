/**
 * Created by admin on 2016/8/17.
 */
$(function () {
    var openid = $.getUrlParam('openId');
    if(sessionStorage['qy_invited']){
        $('.login #inv').val(sessionStorage['qy_invited'])
    }
    //微信手机绑定
    $('.gowxb').on('click',function () {
        window.location.href="/Html/Member/WeChatBind.html?openId="+openid
    })
    var reg =/^1[3|4|5|7|8]\d{9}$/
    //注册
    $('.reg-btn').on('click',function (){


        if ($(this).hasClass('cur')){
            return false
        }else{
            if ($('#ph').val()=="") {
                oppo("请输入手机号", 1);
                return false;
            }else if(!reg.test($('#ph').val())){
                oppo("手机号格式有误", 1);
                return false;
            }else if($('#yzm').val()==""){
                oppo("请输入验证码", 1);
                return false;
            }else if($('#pw').val()==""){
                oppo("请输入密码", 1);
                return false;
            }else{
                $(this).addClass('gray');
                var data = {
                    PhoneNumber:$('#ph').val(),
                    Password:$('#pw').val(),
                    SmsVerifyCode:$('#yzm').val(),
                    InvitationCode:$('#inv').val(),
                    openId:openid
                }
                ajax1(data)
            }
        }

    })

    function ajax1(data) {
        $.ajax({
            url:'/Api/v1/Member',
            type:'post',
            data:data
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                sessionStorage.setItem('qy_loginToken',data.PhoneNumber+':'+rs.data.DynamicToken);
                sessionStorage['qy_Identity']=rs.data.Id;
                sessionStorage['qy_UserName']=rs.data.UserName;
                //sessionStorage['qy_CreateTime']=rs.data.CreateTime;
                sessionStorage['qy_NickName']=rs.data.NickName;
                sessionStorage['qy_Sex']=rs.data.Sex;
                sessionStorage['qy_Birthday']=rs.data.Birthday;
                //sessionStorage['qy_Avatar']=rs.data.Avatar;
                sessionStorage['qy_PhoneNumber']=rs.data.PhoneNumber;
                sessionStorage['qy_InvitationCode']=rs.data.InvitationCode;
                
                if(rs.data.Avatar != null){
                    sessionStorage['qy_head']=rs.data.Id+'|'+rs.data.Avatar.SmallThumbnail;
                }
                // sessionStorage['qy_UserName']=rs.data.UserName;
                oppo('注册成功',1,function () {
                    window.location.href="/Html/Member/PersonalCenter.html";
                })

            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        }).always(function () {
            $('.reg-btn').removeClass('gray')
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
                    RequestType:'0'
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