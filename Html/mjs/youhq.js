/**
 * Created by Administrator on 2016/10/27.
 */
$(function () {

    var data = {
        pageNo: 1,
        limit: 10
    }

    ajaxyouhq();
    var a = 0;

    function ajaxyouhq() {
        $.ajax({
            url: '/Api/v1/Voucher',
            data: data,
            type: 'get'

        }).done(function (rs) {
            if (rs.returnCode == 200) {
                viewyouhq(rs);
                a = rs.data.VoucherList;
                // console.log(a)
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
        new Vue({
            el: '#youhq',
            data: rs,
            ready: function () {
                $.RMLOAD()
                //判断类型
                if ($('.leix').html() == 1) {
                    $('.leix').html("通用")
                } else {
                    $('.leix').html("类型")

                }
            }
        })
    }

    //领取优惠券


    $(".youhq-box").on("click", '.lingqu', function (event) {
        var id=$(this).attr('dataId');

        $.ajax({
            type: 'post',
            url: '/Api/v1/AddVoucher/',
            data: {
                voucherId: id
            }
        })
        $(".popup-box").show();


    })


})