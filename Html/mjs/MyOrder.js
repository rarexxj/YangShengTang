/**
 * Created by admin on 2016/8/27.
 */
$(function () {
    $.ADDLOAD();
    var ordert = $.getUrlParam('orderType');
    // var keywords = $.getUrlParam('keywords');
    var data = {
        pageNo:'1',
        orderType:ordert,
        limit:'5'
        // keywords:encodeURIComponent(keywords)
    }
    
    ajax();
    function ajax(callback,beforecallback) {
        $.ajax({
            url:'/Api/v1/Mall/Order',
            type:'get',
            data:data,
            beforeSend:function () {
                if(typeof beforecallback=='function'){beforecallback()}
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data)
                $('.loading').hide();
                window.colpage=Math.ceil(rs.data.TotalCount/data.limit)
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        }).always(function () {
            if(typeof callback=='function'){callback()}
        })
    }
    var list
    function view(rs) {
        if(rs.Orders.length == 0){
            $('.search-box').show();
            $('.nothing').show();
        }
        for (var i=0;i<rs.Orders.length;i++){
            //转换总价格
            if(rs.Orders[i].PayFee.toString().indexOf('.')>-1){
                if(rs.Orders[i].PayFee.toString().split('.')[1].length == 1){
                    rs.Orders[i].prices2=rs.Orders[i].PayFee.toString().split('.')[1]+'0'
                }else{
                    rs.Orders[i].prices2=rs.Orders[i].PayFee.toString().split('.')[1];
                }
                rs.Orders[i].prices1=rs.Orders[i].PayFee.toString().split('.')[0];

            }else{
                rs.Orders[i].prices1=rs.Orders[i].PayFee;
                rs.Orders[i].prices2='00';
            }
            //转换物流
            if(rs.Orders[i].ShippingFee.toString().indexOf('.')>-1){
                if(rs.Orders[i].ShippingFee.toString().split('.')[1].length == 1){
                    rs.Orders[i].prices6=rs.data[i].ShippingFee.toString().split('.')[1]+'0'
                }else{
                    rs.Orders[i].prices6=rs.Orders[i].ShippingFee.toString().split('.')[1];
                }
                rs.Orders[i].prices5=rs.Orders[i].ShippingFee.toString().split('.')[0];

            }else{
                rs.Orders[i].prices5=rs.Orders[i].ShippingFee;
                rs.Orders[i].prices6='00';
            }
            //转换单价
            for(var j=0;j<rs.Orders[i].OrderGoods.length;j++){
                if(rs.Orders[i].OrderGoods[j].Price.toString().indexOf('.')>-1){
                    if(rs.Orders[i].OrderGoods[j].Price.toString().split('.')[1].length == 1){
                        rs.Orders[i].OrderGoods[j].prices4=rs.Orders[i].OrderGoods[j].Price.toString().split('.')[1]+'0'
                    }else{
                        rs.Orders[i].OrderGoods[j].prices4=rs.Orders[i].OrderGoods[j].Price.toString().split('.')[1];
                    }
                    rs.Orders[i].OrderGoods[j].prices3=rs.Orders[i].OrderGoods[j].Price.toString().split('.')[0];

                }else{
                    rs.Orders[i].OrderGoods[j].prices3=rs.Orders[i].OrderGoods[j].Price;
                    rs.Orders[i].OrderGoods[j].prices4='00';
                }
                //提取规格
                rs.Orders[i].OrderGoods[j].shuxi=[]
                for (k in rs.Orders[i].OrderGoods[j].GoodsAttribute.split(',')){
                    rs.Orders[i].OrderGoods[j].shuxi[k]=rs.Orders[i].OrderGoods[j].GoodsAttribute.split(',')[k]
                }
            }

            //转换时间
            var time =rs.Orders[i].CreateTime.split('T')
            rs.Orders[i].newtime=time[0]

        }
        rs.URL=location.origin
        if (list){
            if (rs.page==1){
                list.Orders = rs.Orders;
            }else{
                list.Orders=list.Orders.concat(rs.Orders)
            }
        }else{
            list = new Vue({
                el:'#my-order',
                data:rs,
                ready:function () {
                    $.RMLOAD();
                    qrsh();
                    deleteorder();
                    js();
                    link();
                }
            })
        }
    } 
    var flag = true;
    $(window).scroll(function () {
        var H = $('body,html').height();
        var h = $(window).height();
        var t = $('body').scrollTop();
        if (t >= H - h * 1.1 && flag == true) {
            flag = false;
            data.pageNo++;
            if(data.pageNo>colpage){
                $('.loading').hide();
            }else{
                ajax(function () {
                    setTimeout(function () {
                        flag = true;
                    }, 500)
                },function () {
                    $('.loading').show();
                })
            }
        }
    })
    //效果
    function js() {
        $('.ordernav .btn').on('click',function () {
            $('.search-box').show();
        })
        $('.search-box .close').on('click',function () {
            $('.search-box').hide();
        })
        $('.pop .no').on('click',function () {
            $('.pop').hide();
        })
    }
    //加焦点
    if(ordert==0){
        $('.ordernav a').eq(0).addClass('cur')
    }else if(ordert==1){
        $('.ordernav a').eq(1).addClass('cur')
    }else if(ordert==2){
        $('.ordernav a').eq(2).addClass('cur')
    }else if(ordert==3){
        $('.ordernav a').eq(3).addClass('cur')
    }
    //确认收货
    function qrsh() {
        $('.confirm-btns').on('click',function () {
            var confirmid = $(this).parents('.box').attr('data-id');
            $('.pop-com').show().find('.box').attr('data-id',confirmid)
            
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
            $('.pop-com').hide();
            if (rs.returnCode == '200'){

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
    //删除订单
    function deleteorder() {
        $('body').on('click','.delete-btns',function () {
            var confirmid = $(this).parents('.box').attr('data-id');
            $('.pop-del').show().find('.box').attr('data-id',confirmid)

        })
        $('body').on('click','.delete-btn',function () {
            var id = $(this).parents('.box').attr('data-id');
            ajaxdelete(id);
        })
    }
    function ajaxdelete(id) {
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
    }
    function link() {
        $('.my-order').on('click','.normal>a',function () {
            var id = $(this).parent().attr('data-id');
            window.location.href="/Html/Order/Info.html?id="+id
        })
        $('.my-order').on('click','.normal .back',function () {
            event.stopPropagation();
            var id = $(this).parents('.box').attr('data-id');
            var gid = $(this).parents('.pro-style').attr('data-id');
            window.location.href="/Html/AfterSales/Info.html?oid="+id+"&gid="+gid
        })
        
    }
})