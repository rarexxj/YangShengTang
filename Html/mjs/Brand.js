/**
 * Created by admin on 2016/9/11.
 */
$(function () {
    $.ADDLOAD();
    var types = $.getUrlParam('type');
    ajaxbanner();
    ajaxad();

    function ajaxbanner() {
        $.ajax({
            url:'/Api/v1/Carousel/'+types,
            type:"get"
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewbanner(rs)
            }else {
                if (rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }

        })
    }
    function viewbanner(rs) {
        //短地址处理
        for(var i in rs.data){
            if(rs.data[i].ShotUrl){
                rs.data[i].urllink=rs.data[i].ShotUrl.split('|')[0];
                rs.data[i].idlink=rs.data[i].ShotUrl.split('|')[1];
            }else{
                rs.data[i].urllink=0;
                rs.data[i].idlink=0;
            }
        }
        new Vue({
            el:"#banner",
            data:rs,
            ready:function () {
                Swipers();
                linkbanner();
            }
        })
    }
    //广告
    function ajaxad() {
        $.ajax({
            url:'/Api/v1/Advert/'+types,
            type:'get'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewad(rs);
            }else{
                oppo(rs.msg ,1)
            }
        })
    }
    function viewad(rs) {
        //短地址处理
        for(var i in rs.data){
            if(rs.data[i].ShotUrl){
                rs.data[i].urllink=rs.data[i].ShotUrl.split('|')[0];
                rs.data[i].idlink=rs.data[i].ShotUrl.split('|')[1];
            }else{
                rs.data[i].urllink=0;
                rs.data[i].idlink=0;
            }
        }
        new Vue({
            el:"#hot",
            data:rs,
            ready:function () {
                linkhot()
            }
        })
    }
    //获取推荐类型的商品
    var datas = {
        type:types,
        pageNo:1,
        limit:8
    }
    ajaxrec();
    function ajaxrec(callback,beforecallback) {
        $.ajax({
            url:"/Api/v1/Mall/Goods/Recommend",
            type:'get',
            data:datas,
            beforeSend:function () {
                if(typeof beforecallback=='function'){beforecallback()}
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewrec(rs.data);
                $('.loading').hide();
                window.colpage=Math.ceil(rs.data.TotalCount/datas.limit);
            }else{
                oppo(rs.msg ,1)
            }
        }).always(function () {
            if(typeof callback=='function'){callback()}
        })
    }
    var list
    function viewrec(rs) {
        for(var i in rs.Goods){
            if(rs.Goods[i].ShopPrice.toString().indexOf('.')>-1){
                if(rs.Goods[i].ShopPrice.toString().split('.')[1].length == 1){
                    rs.Goods[i].prices2=rs.Goods[i].ShopPrice.toString().split('.')[1]+'0'
                }else{
                    rs.Goods[i].prices2=rs.Goods[i].ShopPrice.toString().split('.')[1];
                }
                rs.Goods[i].prices1=rs.Goods[i].ShopPrice.toString().split('.')[0];

            }else{
                rs.Goods[i].prices1=rs.Goods[i].ShopPrice;
                rs.Goods[i].prices2='00';
            }
        }
        if(list){
            list.Goods=list.Goods.concat(rs.Goods)
        }else{
            list = new Vue({
                el:"#rec",
                data:rs,
                ready:function () {
                    $.RMLOAD();
                }
            })
        }
    }
    //下拉加载
    var flag = true;
    $(window).scroll(function () {
        var H = $('body,html').height();
        var h = $(window).height();
        var t = $('body').scrollTop();
        if (t >= H - h * 1.1 && flag == true) {
            flag = false;
            datas.pageNo++;
            if(datas.pageNo>colpage){
                $('.loading').hide();
            }else{
                ajaxrec(function () {
                    setTimeout(function () {
                        flag = true;
                    }, 500)
                },function () {
                    $('.loading').show();
                })
            }
        }
    })
    function Swipers() {
        var mySwiper = new Swiper ('.swiper-container3', {
            direction: 'horizontal',
            loop: true,
            autoplay:4000,
            // 如果需要分页器
            pagination: '.swiper-pagination'
        })
    }
    function linkbanner() {
        $('#banner .infourl').on('click',function () {
            window.location.href="/Html/Products/Info.html?id="+$(this).attr('data-id');
        })
        $('#banner .listurl').on('click',function () {
            window.location.href="/Html/Products/List.html?id="+$(this).attr('data-id');
        })
    }
    function linkhot() {
        $('#hot .infourl').on('click',function () {
            window.location.href="/Html/Products/Info.html?id="+$(this).attr('data-id');
        })
        $('#hot .listurl').on('click',function () {
            window.location.href="/Html/Products/List.html?id="+$(this).attr('data-id');
        })
    }
})