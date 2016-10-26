/**
 * Created by admin on 2016/9/10.
 */
$(function () {
    var oid = $.getUrlParam('oid');
    var gid = $.getUrlParam('gid');
    var mp = $.getUrlParam('mp');
    var RefundType = $.getUrlParam('RefundType');
    $('.back').on('click',function () {
        window.location.href="/Html/AfterSales/Apply.html?oid="+oid+"&gid="+gid+"&mp="+mp+"&RefundType=0"
    })
    $('.backand').on('click',function () {
        window.location.href="/Html/AfterSales/Apply.html?oid="+oid+"&gid="+gid+"&mp="+mp+"&RefundType=1"
    })
})