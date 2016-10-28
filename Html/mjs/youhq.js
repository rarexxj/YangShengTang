/**
 * Created by Administrator on 2016/10/27.
 */
$(function () {

    var vue = new Vue({
        el: '#youhq',
        data: {
            yhq: [],
            success: {}
        },
        ready: function () {


        }
    })

    var data = {
        pageNo: 1,
        limit: 10
    }

    ajaxyouhq();

    function ajaxyouhq() {
        $.ajax({
            url: '/Api/v1/Voucher',
            data: data,
            type: 'get'

        }).done(function (rs) {
            if (rs.returnCode == 200) {
                viewyouhq(rs.data);

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
        if (vue) {
            vue.yhq = vue.yhq.concat(rs.VoucherList)
            vue.$nextTick(function () {
                $.RMLOAD()
            })
        }

    }

    //领取优惠券
    $(".youhq-box").on("click", '.lingqu', function (event) {
        var id = $(this).attr('dataId');

        $.ajax({
            type: 'post',
            url: '/Api/v1/AddVoucher/',
            data: {voucherId: id}

        }).function(function () {
            $(".popup-box").show();
        })


    })


    // xx关闭弹出框
    $(".popup-chac").click(function () {
        $(".popup-box").hide();
        $(".popup-box-two").hide();

    })


})