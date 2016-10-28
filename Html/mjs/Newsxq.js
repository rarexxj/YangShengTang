/**
 * Created by Administrator on 2016/10/27.
 */
$(function () {


    var ID = $.getUrlParam('messageId')
    ajaxNewsxq();
    function ajaxNewsxq() {
        $.ajax({
            url: '/Api/v1/Message?messageId='+ID,
            type: 'get'
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                viewNews(rs)
                $('.new-loading').remove()
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }
        })
    }



    function viewNews(rs) {
        new Vue({
            el:'#News',
            data:rs
        })
    }
})