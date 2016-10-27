/**
 * Created by admin on 2016/8/25.
 */
/**
 * Created by admin on 2016/8/25.
 */
$(function () {
    if(sessionStorage['qy_Birthday']){
        $('.date').val(sessionStorage['qy_Birthday'].toString().split('T')[0])
    }
    $('.submit').on('click',function () {
        var data={
            NickName:'',
            Birthday:$('.date').val(),
            Sex:''
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
                    window.location.href="/Html/Member/PersonalCenter.html";
                    sessionStorage['qy_Birthday'] = rs.data.Birthday;
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