/**
 * Created by admin on 2016/8/30.
 */
$(function () {
    //console.log(window.location.pathname)
    var id = $.getUrlParam('id');
    var gid = $.getUrlParam('gid');
    var addid =$.getUrlParam('addid');
    var ids={}

    if(id){
        if(id.indexOf('|')>0) {
            ids.CartIds = id.split('|')
        }else{
            ids.CartIds=id
        }
    }
    if(gid){
        ids.SingleGoods=[];
        var a={}
        a.SingleGoodsId = gid.split('|')[0];
        a.Quantity = gid.split('|')[1];
        ids.SingleGoods.push(a)
    }
    if(addid){
        ids.AddressId=addid
    }
    $.ADDLOAD();
    ajax(ids);

    function ajax(ids) {
        $.ajax({
            url:"/Api/v1/Mall/OrderCalculation",
            data:ids,
            type:'post'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data);
                prosubmit(rs.data);
                link();
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    function view(rs) {
        //得到返回的id
        rs.backid= id
        //转化第一个武器的金额

        if(rs.Goods.List[0].Price.toString().indexOf('.')>-1){
            if(rs.Goods.List[0].Price.toString().split('.')[1].length == 1){
                rs.Goods.List[0].prices2=rs.Goods.List[0].Price.toString().split('.')[1]+'0'
            }else{
                rs.Goods.List[0].prices2=rs.Goods.List[0].Price.toString().split('.')[1];
            }
            rs.Goods.List[0].prices1=rs.Goods.List[0].Price.toString().split('.')[0];

        }else{
            rs.Goods.List[0].prices1=rs.Goods.List[0].Price;
            rs.Goods.List[0].prices2='00';
        }
         rs.Goods.List[0].shuxi=[]
        for (i in rs.Goods.List[0].GoodsAttribute.split(',')){
            rs.Goods.List[0].shuxi[i]=rs.Goods.List[0].GoodsAttribute.split(',')[i]
        }
        //转化商品金额
        if(rs.GoodsAmount.toString().indexOf('.')>-1){
            if(rs.GoodsAmount.toString().split('.')[1].length == 1){
                rs.prices2=rs.GoodsAmount.toString().split('.')[1]+'0'
            }else{
                rs.prices2=rs.GoodsAmount.toString().split('.')[1];
            }
            rs.prices1=rs.GoodsAmount.toString().split('.')[0];

        }else{
            rs.prices1=rs.GoodsAmount;
            rs.prices2='00';
        }
        //转化邮费
        if(rs.ShippingFee.toString().indexOf('.')>-1){
            if(rs.ShippingFee.toString().split('.')[1].length == 1){
                rs.prices4=rs.ShippingFee.toString().split('.')[1]+'0'
            }else{
                rs.prices4=rs.ShippingFee.toString().split('.')[1];
            }
            rs.prices3=rs.ShippingFee.toString().split('.')[0];

        }else{
            rs.prices3=rs.ShippingFee;
            rs.prices4='00';
        }
        $('.postage').attr('data-postage',rs.ShippingFee)
        //计算总价
        rs.allprice = parseFloat(rs.GoodsAmount+rs.ShippingFee)
        //转化总价
        if(rs.allprice.toString().indexOf('.')>-1){
            if(rs.allprice.toString().split('.')[1].length == 1){
                rs.prices6=rs.allprice.toString().split('.')[1]+'0'
            }else{
                rs.prices6=rs.allprice.toString().split('.')[1];
            }
            rs.prices5=rs.allprice.toString().split('.')[0];

        }else{
            rs.prices5=rs.allprice;
            rs.prices6='00';
        }

        new Vue({
            el:'#confirm_order',
            data:rs,
            ready:function () {
                $.RMLOAD();
                getCoupon()
                //js();
            }
        })
    }
    //提交订单
    function prosubmit(rs) {
        $('.balance').on('click',function () {
            if($('.addadd').length){
                oppo('请选择收货地址',1)
            }else{
                var prodata=[]
                for (var i=0 ;i< rs.Goods.List.length;i++){
                    var pro={}
                    pro.Id=rs.Goods.List[i].SingleGoodsId;
                    pro.Quantity=rs.Goods.List[i].Quantity;
                    prodata.push(pro)
                }
                var num=0
                if($('.weui_switch').is(':checked')){
                    num=$('.weui_switch').attr('data-int')
                }else{
                    num=0
                }
                var datas={
                    Consignee:rs.Addresses.Contacts,
                    Province:rs.Addresses.Province,
                    City:rs.Addresses.City,
                    District:rs.Addresses.District,
                    Street:rs.Addresses.Street,
                    RegionName:rs.Addresses.RegionName,
                    Address:rs.Addresses.Address,
                    Tel:rs.Addresses.Phone,
                    Memo:$('.bz').val(),
                    Goods:prodata,
                    Integral:num,
                    VoucherId:$('.youhq-box .youhq.active').attr('data-Id'),
                    VoucherAmount:$('.youhq-box .youhq.active').attr('data-price')
                }
                //console.log(datas)
                $.ajax({
                    url:'/Api/v1/Mall/Order',
                    data:datas,
                    type:'post'
                }).done(function (rs) {
                    if (rs.returnCode == '200'){

                         window.location.replace("/Html/ShopCar/Pay.html?id="+rs.data.Id+'&OrderNo='+rs.data.OrderNo+'&money='+rs.data.PayFee+'&time='+rs.data.CreateTime)
                    }else{
                        if(rs.returnCode == '401'){
                            Backlog();
                        }else{
                            oppo(rs.msg ,1)
                        }
                    }
                })
            }

        })
    }

    function link() {
        //进入商品明细
        $('.godeta').on('click',function () {
            window.location.href="/Html/ShopCar/ProductsDetailed.html?id="+id
        })
        //选择地址
        if(id){
            $('.choadd .a').on('click',function () {
                window.location.href="/Html/ShopCar/ChooseAddress.html?id="+id
            })
            $('.addadd .a').on('click',function () {
                window.location.href="/Html/ShopCar/ChooseAddAddress.html?id="+id
            })
        }else{
            $('.choadd .a').on('click',function () {
                window.location.href="/Html/ShopCar/ChooseAddress.html?gid="+gid
            })
            $('.addadd .a').on('click',function () {
                window.location.href="/Html/ShopCar/ChooseAddAddress.html?gid="+gid
            })
        }
    }

})
function getCoupon() {
    $('#yhq').on('click',function () {
        $('.confirm-order').hide();
        $('.youhq-box').show();
    })
    $('.yhq-btn').on('click',function () {
        $('.confirm-order').show();
        $('.youhq-box').hide();
    })
    $('.youhq-box .yhq-btn').on('click',function () {  //确认选择优惠券
        $('.confirm-order').show();
        $('.xjj-yhq-box').hide();
        if($('.youhq-box .youhq.active').length == 0){
            $('#yhq').attr('data-price',0)
        }else{
            var price = $('.youhq-box .youhq.active').attr('data-price');
            console.log(price)
            $('#yhq').attr('data-price',price)
        }
        getLastPrice()
    })
    $('.youhq-box .youhq').on('click',function () {
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        }else{
            $(this).addClass('active').siblings().removeClass('active');
        }
    })
}
//function js() {
//    var money=0;
//    if($('.weui_switch').is(':checked')){
//        money = parseFloat($('.car-list .amo').attr('data-price2')) - parseFloat($('.weui_switch').attr('data-price'))
//        if(money <0){
//            money =0
//        }
//        money=money + parseFloat($('.postage').attr('data-postage'))
//
//        money = parseFloat(money).toFixed(2)
//    }else{
//        money = parseFloat(Number($('.car-list .amo').attr('data-price2')) + Number($('.postage').attr('data-postage'))).toFixed(2)
//        console.log(money)
//    }
//    $('.car-list .amo').attr('data-price',money)
//    GetPrice($('.car-list').find('.amo'))
//}

function js() {
    var n=$('.weui_switch').attr('data-money')
    if($('.weui_switch').is(':checked')){
        $('.weui_switch').attr('data-price',n)
    }else{
        $('.weui_switch').attr('data-price',0)
    }
    getLastPrice();
}
function getLastPrice() {
    var money = parseFloat($('.car-list .amo').attr('data-price2') - $('.weui_switch').attr('data-price') - $('#yhq').attr('data-price'))
    money = parseFloat(Number(money) + Number($('.postage').attr('data-postage'))).toFixed(2);
    $('.car-list .amo').attr('data-price',money)
    GetPrice($('.car-list').find('.amo'))
}