/**
 * Created by admin on 2016/9/13.
 */
$(function () {
    $.ADDLOAD();
    var key = $.getUrlParam('key');
    ajax();
    function ajax() {
        $.ajax({
            url:"/Api/v1/Page/"+key,
            type:"get",
            data:{
                key:key
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
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
            el:'#singlepage',
            data:rs,
            ready:function () {
                $.RMLOAD();
            }
        })
    }
})