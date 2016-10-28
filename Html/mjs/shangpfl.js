$(function () {
    ajaxAD();

    function ajaxAD() {
        $.ajax({
            url: '/Api/v1/Mall/GoodFristCategorys',
            type: 'get'
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                viewAD(rs)

            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }
        })
    }

    function viewAD(rs) {
        new Vue({
            el: '#shangpfl_main',
            data: rs,
            ready: function () {

            }
        })
    }


})