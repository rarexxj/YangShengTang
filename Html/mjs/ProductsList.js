/**
 * Created by admin on 2016/8/26.
 */
$(function () {
    $.ADDLOAD();
    var data={
        CategoryId:$.getUrlParam('id'),
        SortType:'0',
        PageNo:'1',
        Limit:'5'
    }
    ajax();
    function ajax(callback,beforecallback) {

        //data.SortType=$('.cur').attr('data-id')
        $.ajax({
            url:'/Api/v1/Mall/Goods',
            type:'post',
            data:data,
            beforeSend:function () {
                if(typeof beforecallback=='function'){beforecallback()}
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                window.allpage=Math.ceil(rs.data.TotalCount/data.Limit)
                rs.data.page=data.PageNo;
                view(rs.data);
                $('.loading').hide();
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

    var list;
    function view(rs) {
        for (var i=0;i<rs.Goods.length;i++){
            //console.log(rs.Goods[i].ShopPrice)
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
            if (rs.page==1){
                list.Goods = rs.Goods;
            }else{
                list.Goods=list.Goods.concat(rs.Goods)
            }
            $.RMLOAD();
        }else{
            list = new Vue({
                el:'#pro-list',
                data:rs,
                ready:function () {
                    $.RMLOAD();
                    //$('.loading').hide();
                    js();

                }
            })
        }
    }
    //下滑加载
        var flag = true;
        $(window).scroll(function () {
            var H = $('body,html').height();
            var h = $(window).height();
            var t = $('body').scrollTop();
            if (t >= H - h * 1.1 && flag == true) {
                flag = false;
                data.PageNo++;
                var nSortType = $('.typecur').attr('data-nSortType')
                if(data.PageNo>allpage){
                    $('.loading').hide();

                }else{
                    data['SortType']=nSortType
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

    //效果js
    function js() {
        //排序
        $('.sort').on('click',function () {
            $('.sort-mask').show();
            $('.screen-mask').hide();
        })
        $('.sort-mask li').on('click',function () {
            $.ADDLOAD();
            flag = true;
            $(this).addClass('typecur').siblings().removeClass('typecur');
            var nSortType=$(this).attr('data-nSortType');
            data['SortType']=nSortType;
            data['PageNo']=1;
            ajax();
            $('.products-nav .num').removeClass('typecur')
            $('.sort').addClass('cur').siblings().removeClass('cur');
            $('.sort-mask').hide();
        })
        $('.sort-mask').on('click',function () {
            $(this).hide();
        })
        //销量优先
        $('.products-nav .num').on('click',function () {
            $.ADDLOAD();
            flag = true;
            $(this).addClass('typecur').siblings().removeClass('cur');
            $('.sort-box li').removeClass('typecur');
            var nSortType=$(this).attr('data-nSortType');
            data['SortType']=nSortType;
            data['PageNo']=1;
            ajax();
            $('.sort-mask').hide();
            $('.screen-mask').hide();
        })
        //筛选
        $('.screen').on('click',function () {
            flag = true;
            //$(this).addClass('cur').siblings().removeClass('cur');
            //$('.sort-mask .num').removeClass('typecur');
            $('.sort-mask').hide();
            $('.screen-mask').show();
        })
        $('.screen-box .box li').on('click',function () {
            if ($(this).hasClass('cur')){
                $(this).removeClass('cur');
            }else{
                $(this).addClass('cur');
            }
        })
        $('.screen-box .box .osa').on('click',function () {
            if ($(this).hasClass('cur')){
                $(this).removeClass('cur');
            }else{
                $(this).addClass('cur');
            }
        })
    }
    //筛选条件
    ajax2();
    function ajax2() {
        $.ajax({
            url:'/Api/v1/Mall/Goods/FilterCriterias',
            type:'get',
            data:{
                categoryId:$.getUrlParam('id')
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view2(rs.data);
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    function view2(rs) {
        
        for (var i=0;i<rs.Others.length;i++){
            var otherlist=[]
            for(var j=0;j<rs.Others[i].Value.toString().split(',').length;j++){
                otherlist.push(rs.Others[i].Value.toString().split(',')[j])
            }
            rs.Others[i].otherlist=otherlist;
        }
        
        new Vue({
            el:'#screen-mask',
            data:rs
        })
    }

    //筛选
    $('.screen-btn').on('click',function () {
        flag = true;
        if($('.screen-mask .min').val() !='' && $('.screen-mask .max').val() !=''){
            if($('.screen-mask .min').val() > $('.screen-mask .max').val()){
                oppo('输入的价格区间有误',1);
                return false
            }
        }
        data.Brands=[]
        $('.brand li').each(function () {
            if($(this).hasClass('cur')){
                data.Brands.push($(this).attr('data-id'))
            }
        })
        data.Others=[];

        $('.os').each(function () {
            var aaa={},val=''

            $(this).find('.cur').each(function (index) {
                if(index==0){
                    val+=$(this).text()
                }else{
                    val+=','+$(this).text()
                }

            })

            if(val){
                aaa['AttributeId']=$(this).attr('data-id');
                aaa['AttributeValues']=val;
                data.Others.push(aaa)
            }
        })


        // $('.others li').each(function () {
        //     if($(this).hasClass('cur')){
        //         data.Others.push($(this).attr('data-id'))
        //     }
        // })
        data.MinPrice=$('.screen-mask .min').val();
        data.MaxPrice=$('.screen-mask .max').val();
        data.SortType=$('.typecur').attr('data-nSortType');
        data.PageNo='1';
        ajax();
        $.ADDLOAD();
        $('.screen').removeClass('cur');
        $('.screen-mask').hide();
    })

    //获取商品标签
    tagajax();
    function tagajax() {
        $.ajax({
            url:'/Api/v1/Goods/Tags/BntWeb-Mall',
            type:'get'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                tagview(rs);
            }else{
                oppo(rs.msg ,1)
            }
        })
    }
    function tagview(rs) {
        new Vue({
            el:'#search_box',
            data:rs,
            ready:function () {
                //$.RMLOAD();
                searchjs();
                searchdelete();
                link();
            }
        })
    }
    function searchjs() {
        //搜索
        $('.products-nav .btn').on('click',function () {
            flag = true;
            $('.search-box').show();
            $('.sort-mask').hide();
            $('.screen-mask').hide();
        })
        $('.search-box .close').on('click',function () {
            $('.search-box').hide();
        })

    }
    function searchdelete() {
        $('.search-box .text').on('keyup',function () {
            if($(this).val()==''){
                $('.search-box .delete').hide();
            }else{
                $('.search-box .delete').show();
            }
        })
        $('.search-box .delete').on('click',function () {
            $('.search-box .text').val('');
            $(this).hide();
        })
    }
    //跳转搜索页
    function link() {
        $('.search-box .btn').on('click',function () {
            var val = $('.search-box .text').val();
            if(val == ''){
                oppo('请输入关键字',1)
            }else{
                window.location.href="/Html/Products/SearchList.html?key="+encodeURIComponent(encodeURIComponent(val))
            }
        })
        $('.search-box .con li').on('click',function () {
            var val = $(this).attr('data-tag')
            window.location.href="/Html/Products/SearchList.html?key="+encodeURIComponent(encodeURIComponent(val))
        })
    }
}) 