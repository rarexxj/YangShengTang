/**
 * Created by Administrator on 2016/10/27.
 */
$(function () {


    var data = {
        Category: 0,
        pageNo: 1,
        limit: 10
    }
    ajaxNews();
    function ajaxNews() {
        $.ajax({
            url: '/Api/v1/Message',
            data: data,
            type: 'get'
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                viewNews(rs)
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