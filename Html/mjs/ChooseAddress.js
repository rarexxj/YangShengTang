/**
 * Created by admin on 2016/8/31.
 */
$(function () {
    // var from = $.getUrlParam('from');
    var id=$.getUrlParam('id');
    var gid=$.getUrlParam('gid');
    $.ADDLOAD();
    ajax();
    function ajax() {
        $.ajax({
            url:'/Api/v1/Member/Address',
            type:'get'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data);
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    function view(rs) {
        //得到返回id
        rs.backid= id
        new Vue({
            el:'#address',
            data:rs,
            ready:function () {
                $.RMLOAD()
                link();
            }
        })
    }
    function link() {
        $('.addlist a').on('click',function () {
            var addid = $(this).parents('.addlist').attr('data-addid');
            if(id){
                window.location.href='/Html/ShopCar/Confirm.html?id='+id+'&addid='+addid
            }else{
                window.location.href='/Html/ShopCar/Confirm.html?gid='+gid+'&addid='+addid
            }
        })
        $('.submit').on('click',function () {
            if(id){
                window.location.href='/Html/ShopCar/ChooseAddAddress.html?id='+id
            }else{
                window.location.href='/Html/ShopCar/ChooseAddAddress.html?gid='+gid
            }
        })
    } 
})