/**
 * Created by admin on 2016/9/11.
 */
$(function () {
    $.ADDLOAD();

   ajaxbanner();
   // ajaxhome();
    function ajaxbanner() {
        $.ajax({
            url: '/Api/v1/Carousel/01',
            type: "get"
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                viewbanner(rs)
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }


        })
    }

    function viewbanner(rs) {
        //短地址处理
        for (var i in rs.data) {
            if (rs.data[i].ShotUrl) {
                rs.data[i].urllink = rs.data[i].ShotUrl.split('|')[0];
                rs.data[i].idlink = rs.data[i].ShotUrl.split('|')[1];
            } else {
                rs.data[i].urllink = 0;
                rs.data[i].idlink = 0;
            }
        }
        new Vue({
            el: "#banner",
            data: rs,
            ready: function () {
                    // console.log(rs.data.length)
                link();
                if(rs.data.length>1){
                    Swipers();
                }
            }
        })
    }

    ajaxbanner1();
    // ajaxhome();
    function ajaxbanner1() {
        $.ajax({
            url: '/Api/v1/Carousel/04',
            type: "get"
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                viewbanner1(rs)
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }


        })
    }

    function viewbanner1(rs) {
        //短地址处理
        for (var i in rs.data) {
            if (rs.data[i].ShotUrl) {
                rs.data[i].urllink = rs.data[i].ShotUrl.split('|')[0];
                rs.data[i].idlink = rs.data[i].ShotUrl.split('|')[1];
            } else {
                rs.data[i].urllink = 0;
                rs.data[i].idlink = 0;
            }
        }

        new Vue({
            el: "#banner1",
            data: rs,
            ready: function () {

                link();
                if(rs.data.length>1){
                    Swipers1();
                }
            }
        })
    }

    ajaxbanner2();
    // ajaxhome();
    function ajaxbanner2() {
        $.ajax({
            url: '/Api/v1/Carousel/05',
            type: "get"
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                viewbanner2(rs)
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }


        })
    }

    function viewbanner2(rs) {
        //短地址处理
        for (var i in rs.data) {
            if (rs.data[i].ShotUrl) {
                rs.data[i].urllink = rs.data[i].ShotUrl.split('|')[0];
                rs.data[i].idlink = rs.data[i].ShotUrl.split('|')[1];
            } else {
                rs.data[i].urllink = 0;
                rs.data[i].idlink = 0;
            }
        }
        new Vue({
            el: "#banner2",
            data: rs,
            ready: function () {
                if(rs.data.length>1){
                    Swipers2();
                }

                link();
            }
        })
    }


    //获取首页内容
    ajaxhome()
    function ajaxhome() {
        $.ajax({
            url: "/Api/v1/Mall/Home",
            type: 'get'
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                viewhome(rs.data);
            } else {
                oppo(rs.msg, 1)
            }
        })
    }

    var floor=''
    function viewhome(rs) {
        //金额转换
        for (var i in rs.Categories) {
            for (var j in rs.Categories[i].Goods) {
                if (rs.Categories[i].Goods[j].ShopPrice.toString().indexOf('.') > -1) {
                    if (rs.Categories[i].Goods[j].ShopPrice.toString().split('.')[1].length == 1) {
                        rs.Categories[i].Goods[j].prices2 = rs.Categories[i].Goods[j].ShopPrice.toString().split('.')[1] + '0'
                    } else {
                        rs.Categories[i].Goods[j].prices2 = rs.Categories[i].Goods[j].ShopPrice.toString().split('.')[1];
                    }
                    rs.Categories[i].Goods[j].prices1 = rs.Categories[i].Goods[j].ShopPrice.toString().split('.')[0];

                } else {
                    rs.Categories[i].Goods[j].prices1 = rs.Categories[i].Goods[j].ShopPrice;
                    rs.Categories[i].Goods[j].prices2 = '00';
                }
            }



        }
        for (var i in rs.RecommendGoods) {
            if (rs.RecommendGoods[i].ShopPrice.toString().indexOf('.') > -1) {
                if (rs.RecommendGoods[i].ShopPrice.toString().split('.')[1].length == 1) {
                    rs.RecommendGoods[i].prices2 = rs.RecommendGoods[i].ShopPrice.toString().split('.')[1] + '0'
                } else {
                    rs.RecommendGoods[i].prices2 = rs.RecommendGoods[i].ShopPrice.toString().split('.')[1];
                }
                rs.RecommendGoods[i].prices1 = rs.RecommendGoods[i].ShopPrice.toString().split('.')[0];

            } else {
                rs.RecommendGoods[i].prices1 = rs.RecommendGoods[i].ShopPrice;
                rs.RecommendGoods[i].prices2 = '00';
            }

        }

        $(rs.Adverts).each(function (index,item) {
            console.log(item)
            if(item.ShotUrl){
                item.goods=item.ShotUrl.split('|')[1]
            }

        })

        rs.floor_tag=rs.Categories
        floor=new Vue({
            el: "#home_info",
            data: rs,
            ready: function () {
                var ww=0
                $('.index-tab>li').each(function () {
                    ww+=$(this).outerWidth()

                })

                $('.index-tab').width(ww)
                $.RMLOAD();
                searchlink()
                clicks(rs)
            }
        })
    }
    
    function clicks(rs) {
        var rss=rs.Categories

        $('.index-tab>li').on('click',function () {
            var id=$(this).attr('dataId')
            $(this).addClass('active').siblings().removeClass('active')

            console.log(id)
            for(var i=0;i<rss.length;i++){
                 var datas=rss[i]
                if(id==0){
                    floor.floor_tag=rss;
                }else{
                    if(id==datas.Id){
                        var list=[]
                        list.push(datas)
                        floor.floor_tag=list
                    }

                }

            }

        })
    }
    telephoneajax();
    function telephoneajax() {
            $.ajax({
                url:'/Api/v1/CustomerPhone',
                type:'get'

            }).done(function (rs) {
                if (rs.returnCode == '200') {
                    viewTele(rs.data)
                } else {
                    if (rs.returnCode == '401') {
                        Backlog();
                    } else {
                        oppo(rs.msg, 1)
                    }
                }
            })
    }

    function viewTele(rs){
        new Vue({
            el:'#telephone',
            data:rs

        })
    }

    function searchlink() {
        $('.index-searchlogo').on('click', function () {
            var val = $('#search').val()
            if (val == '') {
                oppo('请输入关键字', 1)
            } else {
                window.location.href = "/Html/Products/SearchList.html?key=" + encodeURIComponent(encodeURIComponent(val))
                //console.log("/Html/Products/SearchList.html?key="+encodeURI(val))

            }
        })

    }



    //轮播
    function Swipers() {
        var mySwiper = new Swiper('#banner', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 20,
            slidesPerView: 'auto',
            centeredSlides: true,
            grabCursor: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false,
            loop:true
        })
    }
    //轮播
    function Swipers1() {
        var mySwiper = new Swiper('#banner1', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 20,
            slidesPerView: 'auto',
            centeredSlides: true,
            grabCursor: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false,
            loop:true
        })
    }
    //轮播
    function Swipers2() {
        var mySwiper = new Swiper('#banner2', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 20,
            slidesPerView: 'auto',
            centeredSlides: true,
            grabCursor: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false,
            loop:true
        })
    }

    //链接
    function link() {
        $('.infourl').on('click', function () {
            window.location.href = "/Html/Products/Info.html?id=" + $(this).attr('data-id');
        })
        $('.listurl').on('click', function () {
            window.location.href = "/Html/Products/List.html?id=" + $(this).attr('data-id');
        })
    }


})