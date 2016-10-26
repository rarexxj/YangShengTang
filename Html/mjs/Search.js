/**
 * Created by admin on 2016/8/26.
 */
$(function () {
    $.ADDLOAD();
    ajax();
    function ajax() {
        $.ajax({
            url:'/Api/v1/Mall/GoodsCategory',
            type:'get'
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                view(rs.data)
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
        new Vue({
            el:'#search-content',
            data:rs,
            ready:function () {
                $.RMLOAD();
                js();
            }
        })
    }
    function  js() {
        $('.search-content li').on('click',function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            var index = $(this).index();
            $('.right .list').eq(index).show().siblings().hide();
        })
    }
})