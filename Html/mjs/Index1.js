/**
 * Created by admin on 2016/9/11.
 */
$(function () {
    $.ADDLOAD();
    $.RMLOAD();
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
                Swipers();
                link();
            }
        })
    }

    //获取商品标签
    tagajax();
    function tagajax() {
        $.ajax({
            url: '/Api/v1/Goods/Tags/BntWeb-Mall',
            type: 'get'
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                tagview(rs);
            } else {
                oppo(rs.msg, 1)
            }
        })
    }

    function tagview(rs) {
        new Vue({
            el: '#search_box',
            data: rs,
            ready: function () {
                //$.RMLOAD();
                searchjs();
                searchlink();
                searchdelete();
            }
        })
    }

    //获取首页内容
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
            // if(!rs.Categories[i].MainImage){
            //     rs.Categories[i].myimg=''
            // }else{
            //     rs.Categories[i].myimg=rs.Categories[i].MainImage.MediumThumbnail
            // }


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
            // if(!rs.RecommendGoods[i].MainImage){
            //     rs.RecommendGoods[i].myimg=''
            // }else{
            //     rs.RecommendGoods[i].myimg=rs.RecommendGoods[i].MainImage.MediumThumbnail
            // }
        }

        $(rs.Adverts).each(function (index,item) {
            console.log(item)
            if(item.ShotUrl){
                item.goods=item.ShotUrl.split('|')[1]
            }

        })
        new Vue({
            el: "#home_info",
            data: rs,
            ready: function () {
                $.RMLOAD();
            }
        })
    }

    //搜索js
    function searchjs() {
        $('.search-tit .text').on('click', function () {
            //$('.search-tit .text').focusout()
            $('.search-box').show(100, function () {


                //alert(2)
                setTimeout(function () {
                    $('#search_alert').trigger('focus')
                },2000)

                //document.getElementById("search_alert").focus();
                //$('#search_box .text')[0].focus()
            });


        })
        $('.search-box .close').on('click', function () {
            $('.search-box').hide();
        })
    }

    function searchlink() {
        $('.search-box .btn').on('click', function () {
            var val = $('.search-box .text').val()
            if (val == '') {
                oppo('请输入关键字', 1)
            } else {
                window.location.href = "/Html/Products/SearchList.html?key=" + encodeURIComponent(encodeURIComponent(val))
                //console.log("/Html/Products/SearchList.html?key="+encodeURI(val))

            }
        })
        $('.search-box .con li').on('click', function () {
            var val = $(this).attr('data-tag')
            window.location.href = "/Html/Products/SearchList.html?key=" + encodeURIComponent(encodeURIComponent(val))
        })
    }

    function searchdelete() {
        $('.search-box .text').on('keyup', function () {
            if ($(this).val() == '') {
                $('.search-box .delete').hide();
            } else {
                $('.search-box .delete').show();
            }
        })
        $('.search-box .delete').on('click', function () {
            $('.search-box .text').val('');
            $(this).hide();
        })
    }

    //轮播
    function Swipers() {
        var mySwiper = new Swiper('.swiper-container3', {
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