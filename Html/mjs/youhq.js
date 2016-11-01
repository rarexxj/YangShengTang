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

    var datas = {
        pageNo: 1,
        limit: 10
    }

    ajaxyouhq();

    function ajaxyouhq() {
        $.ajax({
            url: '/Api/v1/Voucher',
            data: datas,
            type: 'get'

        }).done(function (rs) {
            if (rs.returnCode == 200) {
                window.allpage = Math.ceil(rs.data.TotalCount / datas.limit);
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
        for(var i in rs.VoucherList){
            rs.VoucherList[i].endtime =rs.VoucherList[i].EndTime.split('T')[0];
            rs.VoucherList[i].starttime =rs.VoucherList[i].StartTime.split('T')[0];
        }
        if (vue) {
            vue.yhq = vue.yhq.concat(rs.VoucherList)
            vue.$nextTick(function () {
                $.RMLOAD()
            })
        }

    }


    //分页
    var flag = true;
    $(window).scroll(function () {
        var H = $('body,html').height();
        var h = $(window).height();
        var t = $('body').scrollTop();
        if (t >= H - h * 1.1 && flag == true) {
            flag = false;
            datas.pageNo++;
            if (datas.pageNo > allpage) {
                //$('.loading').hide();

            } else {
                setTimeout(function () {
                    flag = true;
                }, 500)
                ajaxyouhq();
            }
        }
    })


    //领取优惠券
    $(".youhq-box").on("click", '.lingqu', function (event) {
        var price=$(this).parents('.youhq').attr('data-price');
        var maxprice=$(this).parents('.youhq').attr('data-maxprice');
        var maxprice2=$(this).parents('.youhq').attr('data-maxprice');
        var fromtime=$(this).parents('.youhq').attr('data-fromtime');
        var lasttime=$(this).parents('.youhq').attr('data-lasttime');
        var leixing=$(this).parents('.youhq').find('.leix').html();
        $('#price').html(price);
        $('#maxprice').html(maxprice);
        $('#maxprice2').html(maxprice);
        $('#fromtime').html(fromtime);
        $('#lasttime').html(lasttime);
        $('#leixing').html(leixing);


        var id = $(this).attr('dataId');
        $.ajax({
            type: 'post',
            url: '/Api/v1/AddVoucher/' + id,
            data: {voucherId: id}

        }).done(function (rs) {
            if (rs.returnCode == 200) {
                $(".popup-box").show();
            }
            else {
                $(".popup-box-two p").html(rs.msg)
                $(".popup-box-two").show();
            }
        })



    })

    // xx关闭弹出框
    $(".popup-chac").click(function () {
        $(".popup-box").hide();
        $(".popup-box-two").hide();

    })

    // if(){}else{}


})