/**
 * Created by admin on 2016/9/9.
 */
$(function () {
    //点击输入金额
    $('.list li').on('click',function () {
        $(this).addClass('cur').siblings().removeClass('cur');
        var num = $(this).attr('data-money');
        $('.money').val(num);
    })
    //自定义金额
    $('.money').on('keyup',function () {
        $('.list li').removeClass('cur');
    })
    //提交
    $('.submit').on('click',function () {
        if($('.money').val()<5){
            oppo('抱歉，提现金额不能低于5元',1);
            return false;
        }
        if(!$('.tname').val()){
            oppo('请输入支付宝姓名',1);
            return false;
        }
        window.location.replace("/Html/Wallet/WithdrawalsAlipay.html?money="+parseFloat($('.text').val()).toFixed(2)+"&name="+encodeURIComponent(encodeURIComponent($('.tname').val())))
    })
})