/**
 * Created by admin on 2016/8/25.
 */
$(function () {
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
        new Vue({
            el:'#address',
            data:rs,
            ready:function () {
                $.RMLOAD()
            }
        })
    }
})