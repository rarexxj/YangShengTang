/**
 * Created by admin on 2016/8/25.
 */
$(function () {
    var num =sessionStorage['qy_Sex'];
    if(num ==1){
        $('.sexman').addClass('cur')
    }
    if(num ==2){
        $('.sexwoman').addClass('cur')
    }
    $('.sex').off('click').on('click',function () {
        $(this).addClass('cur').siblings().removeClass('cur');
        if($('.sexman').hasClass('cur')){
            num=1;
        }
        if($('.sexwoman').hasClass('cur')){
            num=2;
        }
    })
    $('.submit').on('click',function () {
        var data={
            NickName:'',
            Birthday:'',
            Sex:num
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
            url:'/Api/v1/Member/'+ sessionStorage['qy_Identity'],
            type:'put',
            data:data
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                oppo('修改成功',1,function () {
                    window.location.href="/Html/Member/My.html";
                    sessionStorage['qy_Sex'] = rs.data.Sex;
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