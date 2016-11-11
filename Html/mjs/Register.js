/**
 * Created by admin on 2016/8/17.
 */
$(function () {
    var openid = $.getUrlParam('openId');
    if(localStorage['qy_invited']){
        $('.login #inv').val(localStorage['qy_invited'])
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
            }
            if(!reg.test($('#ph').val())){
                oppo("手机号格式有误", 1);
                return false;
            }
            if($('#yzm').val()==""){
                oppo("请输入验证码", 1);
                return false;
            }
            // if($('#pw').val()==""){
            //     oppo("请输入密码", 1);
            //     return false;
            // }
            $(this).addClass('gray');
            var data = {
                PhoneNumber:$('#ph').val(),
                //Password:$('#pw').val(),
                SmsVerifyCode:$('#yzm').val(),
                InvitationCode:$('#inv').val(),
                openId:openid
            }
            ajax1(data)

        }

    })

    function ajax1(data) {
        $.ajax({
            url:'/Api/v1/Member',
            type:'post',
            data:data
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                localStorage.setItem('qy_loginToken',data.PhoneNumber+':'+rs.data.DynamicToken);
                localStorage['qy_Identity']=rs.data.Id;
                localStorage['qy_UserName']=rs.data.UserName;
                //localStorage['qy_CreateTime']=rs.data.CreateTime;
                localStorage['qy_NickName']=rs.data.NickName;
                localStorage['qy_Sex']=rs.data.Sex;
                localStorage['qy_Birthday']=rs.data.Birthday;
                //localStorage['qy_Avatar']=rs.data.Avatar;
                localStorage['qy_PhoneNumber']=rs.data.PhoneNumber;
                localStorage['qy_InvitationCode']=rs.data.InvitationCode;
                
                if(rs.data.Avatar != null){
                    localStorage['qy_head']=rs.data.Id+'|'+rs.data.Avatar.SmallThumbnail;
                }
                // localStorage['qy_UserName']=rs.data.UserName;
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