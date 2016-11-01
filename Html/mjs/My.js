/**
 * Created by admin on 2016/8/24.
 */
$(function () {
    $('.myname p').html(decodeURIComponent(decodeURIComponent(localStorage['qy_NickName'])));
    var sex;
    if (localStorage['qy_Sex'] == 0){
        sex = '保密'
    }else if(localStorage['qy_Sex'] == 1){
        sex ='男'
    }else if(localStorage['qy_Sex'] == 2){
        sex = '女'
    }
    var day = localStorage['qy_Birthday'].split('T')
    $('.mysex p').html(sex);
    $('.mybir p').html(day[0]);
    $('.myph p').html(localStorage['qy_PhoneNumber']);
    ///Html/Member/BindPhone.html
    $('.myph a').on('click',function () {
        if(localStorage['qy_PhoneNumber']==''){
            window.location.href="/Html/Member/BindPhone.html"
        }else{
            window.location.href="/Html/Member/BindNewPhone.html"
        }
    })
    if(localStorage['qy_head']){
        if(localStorage['qy_Identity']==localStorage['qy_head'].toString().split('|')[0]){
            $('.head .img img').attr('src',localStorage['qy_head'].toString().split('|')[1]);
        }
    }

    Portrait();
    //退出登录
    $('.submit').on('click',function () {
        if ($(this).hasClass('gray')){
            return false
        }else{
            $(this).addClass('gray');
            ajax();
        }
    })
    function ajax() {
        $.ajax({
            url:'/Api/v1/Logout',
            type:'post'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                localStorage.removeItem('qy_Birthday');
                localStorage.removeItem('qy_City');
                localStorage.removeItem('qy_Identity');
                localStorage.removeItem('qy_NickName');
                localStorage.removeItem('qy_PhoneNumber');
                localStorage.removeItem('qy_Province');
                localStorage.removeItem('qy_Sex');
                localStorage.removeItem('qy_UserName');
                localStorage.removeItem('qy_loginToken');
                localStorage.removeItem('qy_head');
                localStorage.removeItem('qy_InvitationCode');
                localStorage.removeItem('qy_MemberType');
                window.location.href="/Html/Member/Login.html"
            }
            else{
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
    //上传头像
    function Portrait() {
        $('.head .file').on('change', function () {
            $.ADDLOAD();
            var imgData = {};
            var file = $(this)[0].files[0];
            //判断类型是不是图片
            if (!/image\/\w+/.test(file.type)) {
                //toolTips(0, "请确保文件为图像类型", 1);
                oppo('请确保文件为图像类型',1)
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                imgData['fileName'] = file.name;
                imgData['data'] = this.result; //就是base64
                //console.log(imgData);
                $.ajax({
                    //contentType: false,    //不可缺
                    //processData: false,    //不可缺
                    url: '/Api/v1/Member/'+localStorage['qy_Identity']+'/Avatar',
                    data: imgData,
                    type: 'Patch'
                }).done(function (json) {
                    if (json.returnCode == 200) {
                        var data = json.data;
                        localStorage['qy_head']=localStorage['qy_Identity']+"|"+data.SmallThumbnail
                        $('.head').attr('data-id', data.Id);
                        $('.head img').attr('src', data.SmallThumbnail);
                        //toolTips(1, "修改成功！", 1);
                        oppo('修改成功！',1)
                        $.RMLOAD();
                    } else {
                        oppo(json.msg, 1);
                        $.RMLOAD();
                    }
                })
            }
        })
    }
})