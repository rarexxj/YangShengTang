/**
 * Created by admin on 2016/9/8.
 */
$(function () {
    var aid = $.getUrlParam('aid');
    $('.submit').on('click',function () {
        if($(this).hasClass('gray')){
            return false
        }else{
            if($('.cn').val()==''){
                oppo('请填写物流公司',1)
            }else if($('.num').val()==''){
                oppo('请填写物流单号',1)
            }else if($('.textarea').val()==''){
                oppo('请填写退货说明',1)
            }else{
                $('.submit').addClass('gray');
                ajax();
            }
        }
    })
    function ajax() {
        $.ajax({
            url:'/Api/v1/Order/RefundLogistics',
            type:'post',
            data:{
                Id:aid,
                ShippingName:$('.cn').val(),
                ShippingNo:$('.num').val(),
                ShippingMemo:$('.textarea').val()
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                oppo('提交成功',1,function () {
                    window.location.href="/Html/Order/MyOrder.html?orderType=0"
                })
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }

        })
    }
    $('.textarea').on('keyup',function () {
        $('.line .cal span').html($(this).val().length)
    })
})