/**
 * Created by admin on 2016/8/29.
 */
$(function () {
    $.ADDLOAD();
    var id =$.getUrlParam('id')
    ajax();
    function ajax() {
        $.ajax({
            url:'/Api/v1/Mall/Order/'+id,
            type:'get',
            data:{
                id:id
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data)
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
        //切割时间
        rs.CreateTime1=rs.CreateTime.split('T')[0];
        rs.CreateTime2=rs.CreateTime.split('T')[1];
        //计算剩余付款时间
        if(rs.OrderStatus == 0){
            var str =rs.CreateTime.split('T');
            str = str.toString().replace(/-/g,"/");
            var date = new Date(str);
            var deadline = date.getTime()+30*60*1000;
            var mytime = new Date()
            var nowtime = mytime.getTime();
            var last = (deadline -nowtime)/1000;
            rs.paymin = parseInt(last/60);
            rs.paysec = parseInt(last%60);
            if(rs.paymin<10){
                rs.paymin='0'+rs.paymin
            }
            if(rs.paysec<10){
                rs.paysec='0'+rs.paysec
            }
        }
        //计算剩余确认收货时间
        if(rs.OrderStatus ==2){
            var str =rs.ShippingTime.split('T');
            str = str.toString().replace(/-/g,"/");
            var date = new Date(str);
            var deadline = date.getTime()+14*24*60*60*1000;
            var mytime = new Date()
            var nowtime = mytime.getTime();
            var last = (deadline -nowtime)/1000;
            rs.conday=parseInt(last/60/60/24)
            rs.conhour=parseInt((last-rs.conday*24*60*60)/60/60)
        }

        //属性
        for(i in rs.OrderGoods){
            rs.OrderGoods[i].shuxin=[]
            for (j in rs.OrderGoods[i].GoodsAttribute.split(',')){
                rs.OrderGoods[i].shuxin[j]=rs.OrderGoods[i].GoodsAttribute.split(',')[j]
            }
        }
        //

        for(i in rs.OrderGoods){
            var pricebox= changeprice(rs.OrderGoods[i].Price)

            rs.OrderGoods[i].price1=pricebox.price1;
            rs.OrderGoods[i].price2=pricebox.price2;
        }
        var pricebox1 = changeprice(rs.GoodsAmount)
        rs.price3 = pricebox1.price1;
        rs.price4 = pricebox1.price2;
        var pricebox2 = changeprice(rs.ShippingFee)
        rs.price5 = pricebox2.price1;
        rs.price6 = pricebox2.price2;
        var pricebox3 = changeprice(rs.IntegralMoney)
        rs.price7 = pricebox3.price1;
        rs.price8 = pricebox3.price2;
        var pricebox4 = changeprice(rs.IntegralMoney)
        rs.price7 = pricebox4.price1;
        rs.price8 = pricebox4.price2;
        var pricebox5 = changeprice(rs.PayFee)
        rs.price9 = pricebox5.price1;
        rs.price10 = pricebox5.price2;
        rs.URL=location.origin
        new Vue({
            el:'#order_info',
            data:rs,
            ready:function () {
                $.RMLOAD();
                deleteorder();
                canorder();
                qrsh();
                remind();
                lasttime(rs);
                js();
            }
        })
    }
    function js() {
        $('.pop .no').on('click',function () {
            $('.pop').hide();
        })
    }
    //删除订单
    function deleteorder() {
        $('.del-btns').on('click',function () {
            $('.pop-del').show();
        })
        $('.delete-btn').on('click',function () {
            $.ajax({
                url:'/Api/v1/Order/'+id,
                type:'delete'
            }).done(function (rs) {
                if (rs.returnCode == '200'){
                    $('.pop-del').hide();
                    oppo('成功删除订单',1,function () {
                        window.location.replace("/Html/Order/MyOrder.html?orderType=0")
                    })
                }else{
                    if(rs.returnCode == '401'){
                        Backlog();
                    }else{
                        oppo(rs.msg ,1)
                    }
                }
            })
        })
    }
    //取消订单
    function canorder() {
        $('.can-btns').on('click',function () {
            $('.pop-can').show();
        })
        $('.can-btn').on('click',function () {
            $.ajax({
                url:'/Api/v1/Order/'+id+'/Cancel',
                type:'patch'
            }).done(function (rs) {
                if (rs.returnCode == '200'){
                    $('.pop-can').hide();
                    oppo('订单取消成功',1,function () {
                        window.location.replace("/Html/Order/MyOrder.html?orderType=0")
                    })
                }else{
                    if(rs.returnCode == '401'){
                        Backlog();
                    }else{
                        oppo(rs.msg ,1)
                    }
                }
            })
        })
    }
    //确认收货
    function qrsh() {
        $('.confirm-btns').on('click',function () {
            $('.pop-com').show().find('.box').attr('data-id',id)

        })
        $('.confirm-btn').on('click',function () {
            var id = $(this).parents('.box').attr('data-id');
            ajaxconfirm(id);
        })
    }
    function ajaxconfirm(id) {
        $.ajax({
            url:'/Api/v1/Order/'+id+'/Complete',
            type:'patch'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                $('.pop-com').hide();
                oppo('成功确认收货',1,function () {
                    window.location.replace("/Html/Order/MyOrder.html?orderType=0")
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
    //提醒发货
    function remind() {
        $('.remind-btn').on('click',function () {
            $.ajax({
                url:'/Api/v1/Order/'+ id+'/Remind',
                type:'post'
            }).done(function (rs) {
                if (rs.returnCode == '200'){
                    oppo('提醒成功',1)
                }else{
                    if(rs.returnCode == '401'){
                        Backlog();
                    }else{
                        oppo(rs.msg ,1)
                    }
                }
            })
        })

    }
    //
    function changeprice(price) {
        var price_box={}
            if (price.toString().indexOf('.') > -1) {
                if (price.toString().split('.')[1].length == 1) {
                    price_box.price2=price.toString().split('.')[1] + '0'
                } else {
                    price_box.price2 = price.toString().split('.')[1];
                }
                price_box.price1 = price.toString().split('.')[0];
            } else {
                price_box.price1 = price;
                price_box.price2 = '00';
            }
        return price_box
    }
    function lasttime(rs) {
        if(rs.OrderStatus == 0){
            var min = $('.paytime .mins').attr('data-min');
            var sec = $('.paytime .sec').attr('data-sec');
            var time = setInterval(function () {
                if(sec==0){
                    if(min==0){
                        min=00;
                        sec=00;
                        window.location.reload();
                        $('.paytime .mins').html(min);
                        $('.paytime .sec').html(sec)
                        clearInterval(time)
                    }else{
                        sec = 59;
                        min--
                        if(min<10){
                            min='0'+min
                        }
                    }
                }else{
                    sec--
                    if(sec<10){
                        sec='0'+sec
                    }
                }
                $('.paytime .mins').html(min);
                $('.paytime .sec').html(sec)
            },1000)
        }
    }
})