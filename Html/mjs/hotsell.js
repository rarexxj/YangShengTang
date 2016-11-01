$(function () {

    var key = $.getUrlParam('abc')
    ajaxbanner();
    ajaxAD()

    // ajaxhome();
    function ajaxbanner() {
        $.ajax({
            url: '/Api/v1/Carousel/' + key,
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
            loop: true
        })
    }


    function ajaxAD() {
        $.ajax({
            url: '/Api/v1/Advert/' + key,
            type: "get"
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                viewAD(rs)
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }


        })
    }


    function viewAD(rs) {
        new Vue({
            el: '#ad',
            data: rs,
            ready: function () {
                $.RMLOAD()
            }
        })
    }





    var datas = {
        type: key,
        pageNo: 1,
        limit: 3
    }
    var a;
    var allpage='';
    ajaxProduct()

    function ajaxProduct() {
        $.ajax({
            url: '/Api/v1/Mall/Goods/Recommend',
            data: datas,
            type: 'get'
        }).done(function (rs) {
            if (rs.returnCode == '200') {
              allpage = Math.ceil(rs.data.TotalCount / datas.limit);
                viewProduct(rs)
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }
        })

    }


    function viewProduct(rs) {
        if (a) {
            a.data.Goods = a.data.Goods.concat(rs.data.Goods)
            console.log(a.data.Goods)
        } else {
            a = new Vue({
                el: '#hotsell_healfoodbox',
                data: rs
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
            datas.pageNo++;
            if (datas.pageNo > allpage) {
                //$('.loading').hide();

            } else {
                setTimeout(function () {
                    flag = true;
                }, 500)
                ajaxProduct();
            }
        }
    })

})