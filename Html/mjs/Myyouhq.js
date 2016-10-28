/**
 * Created by Administrator on 2016/10/27.
 */
$(function () {
    $.ADDLOAD()
    var ID = $.getUrlParam("vocherTpe");

    ajaxmyyouhq();

    function ajaxmyyouhq() {
        $.ajax({
            url: '/Api/v1/MyVoucher?vocherTpe=' + ID,
            type: 'get',
        }).done(function (rs) {
            if (rs.returnCode == 200) {
                viewyouhq(rs)
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }
        })
    }

    function viewyouhq(rs) {
        for (var i in rs.data) {
            rs.data[i].endtime = rs.data[i].EndTime.split('T')[0];

        }
        new Vue({
            el: '#myyouhq',
            data: rs,
            ready: function () {
                //判断类型

                $('.ordernav1 a').eq(ID - 1).addClass('active');
                $('.youhq').click(function () {
                    $('.youhq').removeClass('active')
                    $(this).addClass('active')
                })
                $.RMLOAD()
            }
        })
    }


})