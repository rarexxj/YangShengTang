/**
 * Created by admin on 2016/8/26.
 */
$(function () {
    $.ADDLOAD();
    var id = $.getUrlParam('id');
    ajaxs();
    function ajaxs() {
        $.ajax({
            url:"/Api/v1/Mall/Goods/Attribute",
            type:'get',
            data:{
                goodId:id
            }
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                if(rs.data.MainImage){
                    rs.data.imgs=rs.data.MainImage.MediumThumbnail
                }
                view(rs.data);
                attr_change(rs.data)
                //商品详情渲染
                prinfo(rs.data);
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
        if(rs.Price.toString().indexOf('.')>-1){
            if(rs.Price.toString().split('.')[1].length == 1){
                rs.prices2=rs.Price.toString().split('.')[1]+'0'
            }else{
                rs.prices2=rs.Price.toString().split('.')[1];
            }
            rs.prices1=rs.Price.toString().split('.')[0];
        }else{
            rs.prices1=rs.Price;
            rs.prices2='00';
        }
        window.proimg=rs.MainImage.MediumThumbnail;
        //
        if(rs.AttributeValues[1]){
            var datas=rs.AttributeValues[1]
            datas.lei=datas.AttributeValues.toString().split(',')
            var html='';
            for (var i=0;i<datas.lei.length;i++){
                html+='<li class="choose ';
                if(datas.lei.length==1){
                    html+='choose-cur'
                }
                html+='" data-px="'+ i +'" data-id="'+ datas.AttributeId +'">';
                html+=datas.lei[i];
                html+='</li>'
            }
        }
        $('.tc.other ul').html(html)
        // console.log(proimg)
        new Vue({
            el:'#pro-info',
            data:rs,
            ready:function () {
                $.RMLOAD();
                mySwiper();
                Calculation();
                choose();
                tab();
                coll();
            }
        })
    }
    var guige
    function attr_change(rs) {

        for(var i in rs.AttributeValues){
            if(!rs.AttributeValues[i]['list']){
                rs.AttributeValues[i]['list']=[]
            }
            rs.AttributeValues[i]['list']=rs.AttributeValues[i].AttributeValues.split(',')
        }
        if(rs.MainImage){
            rs.imgs=rs.MainImage[0].MediumThumbnail
        }
        for(var i=0;i< rs.SingleGoogsList.length;i++){
            var datas1=rs.SingleGoogsList[i]
            if(!datas1['zuhe']){
                datas1['zuhe']={}
            }
            for(var j=0; j< datas1.Attributes.length;j++){

                if(!datas1['zuhe']['id']){
                    datas1['zuhe']['id']=[]
                }
                if(!datas1['zuhe']['name']){
                    datas1['zuhe']['name']=[]
                }
                datas1['zuhe']['id'].push(datas1.Attributes[j].AttributeId)
                datas1['zuhe']['name'].push(datas1.Attributes[j].AttributeValue)
            }
        }
        //规格属性
        var czuhe=[];
        var lei={};

        for (var i=0;i<rs.AttributeValues[0].AttributeValues.toString().split(',').length;i++){
            var zn=rs.AttributeValues[0].AttributeValues.toString().split(',')[i];
            var ci=[]
            for (var j=0;j<rs.SingleGoogsList.length;j++){
                if(zn.toString()==rs.SingleGoogsList[j].Attributes[0].AttributeValue.toString()){
                    if(rs.SingleGoogsList[j].Attributes[1]){
                        ci.push(rs.SingleGoogsList[j].Attributes[1].AttributeValue.toString())
                    }
                }
            }
            lei={
                zhu:zn,
                ci:ci
            }
            czuhe.push(lei)
        }
        rs.czuhe=czuhe;
         //console.log(czuhe)
        //(JSON.stringify(rs.SingleGoogsList))
        guige=new Vue({
            el:'#size-mask',
            data:rs,
            motheds:{

            },
            // ready:function () {
            //     chooses()
            //
            // }
        })
        guige.$nextTick(function () {
            chooses()
        })
    }
    function chooses() {
        var _this=this
        $('.choose-box>li').on('click',function () {
            $('.getnum .amount').val(1)
            $(this).addClass('choose-cur').siblings().removeClass('choose-cur')
            choose_zuhe()
        })
        $('.first .choose-box>li').on('click',function () {
            choose_gg()
        })
        choose_zuhe()
    }
    function choose_zuhe() {
        var zuhe=[]
        $('.choose-cur').each(function (index) {
            var px=$(this).attr('data-px'),
                id=$(this).attr('data-id'),
                vals=$(this).text()
            zuhe.push(vals)
        })
        for(var i in guige.SingleGoogsList){
            var datas=guige.SingleGoogsList[i]

                if(datas.zuhe.name.sort().toString()==zuhe.sort().toString()){
                    // console.log(zuhe.sort())
                guige.Price=datas.Price
                guige.Stock=datas.Stock
                if(datas.Image){
                    guige.imgs = datas.Image.MediumThumbnail;
                 }else{
                    guige.imgs=proimg
                 }
                $('.get-btn').attr('data-id',datas.SingleGoodsId)
            }
        }
    }
    function choose_gg() {
        var gg=[];
        $('.first .choose-cur').each(function (index) {
            var px=$(this).attr('data-px'),
                id=$(this).attr('data-id'),
                vals=$(this).text()
            gg.push(vals)
        })
        for (var i in guige.czuhe){
            var datas=guige.czuhe[i]
            if(datas.zhu.toString()==gg.toString()){
                //datas.ci.join(',');
                //console.log(datas.ci.join(','))
                var html='';
                for (var i=0;i<datas.ci.length;i++){
                    html+='<li class="choose" data-px="'+i+'">';
                    html+=datas.ci[i];
                    html+='</li>'
                }
            $('.tc.other ul').html(html)
                chooses()
            }
        }
    }
    //效果js
    function mySwiper() {
        var mySwiper = new Swiper ('.swiper-container1', {
            direction: 'horizontal',
            loop: true,
            // 如果需要分页器
            pagination: '.swiper-pagination'
        })
    }
    //商品详情
    function prinfo(rs) {
        $('.infoajax').html(rs.Description)
    }
    function Calculation() {
        //加
        $('.getnum .jia').on('click',function () {
            var max = parseInt($('.kc').html());
            var num = $(this).parents('.numbox').find('.amount').val();
            if (num >=max){
                num = max;
            }else{
                num++;
            }
            $(this).parents('.numbox').find('.amount').val(num)
        })
        //减
        $('.getnum .jian').on('click',function () {
            var num = $(this).parents('.numbox').find('.amount').val();
            if (num <= 1){
                num = 1;
            }else{
                num--;
            }
            $(this).parents('.numbox').find('.amount').val(num)
        })
    }
    function choose() {
        //选择
        $('.size').on('click',function () {
            $('.size-mask').show();
        })
        $('.size-mask .tc li').on('click',function () {
            $(this).addClass('cur').siblings().removeClass('cur');
        })
        //关闭
        $('.size-mask .close').on('click',function () {
            $('.size-mask').hide();
        })

    }
    //切换
    function tab() {
        $('.information .btn').eq(0).on('click',function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            $('.infoajax').show();
            $('.evaluateajax').hide();
        })
        $('.information .btn').eq(1).on('click',function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            $('.infoajax').hide();
            $('.evaluateajax').show();
        })
    }
    //收藏
    function coll() {
        $('.goshop .coll').on('click',function () {
            if(!TOKEN){
                oppo('您还未登陆',1)
            }else{
                if ($('.goshop .coll').hasClass('on')){
                    return false
                }else{
                    $('.goshop .coll').addClass('on')
                    if($(this).hasClass('cur')){
                        ajaxcancel()
                    }else{
                        ajaxadd();
                    }
                }

            }
        })
    }
    //取消收藏
    function ajaxcancel() {
        $.ajax({
            url:'/Api/v1/Mall/Collect/'+id,
            type:'DELETE'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                oppo('您已取消收藏',1)
                $('.goshop .coll').removeClass('cur');
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        }).always(function () {
            $('.goshop .coll').removeClass('on');
        })
    }
    //添加收藏
    function ajaxadd() {
        $.ajax({
            url:"/Api/v1/Mall/Collect/"+id,
            type:'post'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                oppo('您已添加收藏',1)
                $('.goshop .coll').addClass('cur');
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        }).always(function () {
            $('.goshop .coll').removeClass('on');
        })
    }
    //用户评价 
    var eval; 
    var evadata={
        goodsId:id,
        pageNo:'1',
        limit:'5'

    }
    ajaxeva();
    function ajaxeva(callback,beforecallback) {
        $.ajax({
            url:'/Api/v1/Mall/GoodsEvaluates',
            type:'get',
            data:evadata,
            beforeSend:function () {
                if(typeof beforecallback=='function'){beforecallback()}
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                vieweva(rs.data);
                window.colpage=Math.ceil(rs.data.TotalCount/evadata.limit)
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
    function vieweva(rs) {
        //转换时间
        for(i in rs.Evaluates){
            rs.Evaluates[i].newtime = rs.Evaluates[i].EvaluateTime.split('T')[0]
        }

        for(var i in rs.Evaluates){
            if(rs.Evaluates[i].ReplyTime){
                rs.Evaluates[i].newrtime = rs.Evaluates[i].ReplyTime.split('T')[0]
            }
        }
        if(eval){
            eval.Evaluates=eval.Evaluates.concat(rs.Evaluates)
        }else{
           eval = new Vue({
                el:'#che_com',
                data:rs
            })
        }

    }
    var flag = true;

    $(window).scroll(function () {
        if($('.eva-btn').hasClass('cur')){
            var H = $('body,html').height();
            var h = $(window).height();
            var t = $('body').scrollTop();
            if (t >= H - h * 1.1 && flag == true) {
                flag = false;
                evadata.pageNo++;
                if(evadata.pageNo>colpage){
                    $('.loading').hide();
                }else{
                    ajaxeva(function () {
                        setTimeout(function () {
                            flag = true;
                        }, 500)
                    },function () {
                        $('.loading').show();
                    })
                }
            }
        }

    })
    //评价前9名头像
    ajaxhead();
    function ajaxhead() {
        $.ajax({
            url:'/Api/v1/Mall/GoodsEvaluates/top',
            type:'get',
            data:{
                goodsId:id
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){

                viewhead(rs)
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    function viewhead(rs) {
        for(var  i in rs.data){
            var datas=rs.data[i]
            if(!datas.Avatar){
                datas.Avatar['SmallThumbnail']='/Html/img/img08.jpg'
            }
        }
        new Vue({
            el:'#head',
            data:rs
        })
    }
    //添加商品浏览记录
    browse();
    function browse() {
        $.ajax({
            url:'/Api/v1/Mall/Browse/'+id,
            type:'post'
        })
    }
    //加入购物车
    $('.addshopc,.pro-in-gocart').on('click',function () {
        if(!TOKEN){
            oppo('您还未登录',1,function () {
                if(is_weixin()){
                    window.location.href='/WeiXin/Login';
                }else{
                    window.location.href='/Html/Member/Login.html';
                }
            })
        }else{
            if($(this).hasClass('on')){
                return false
            }else{
                if(!$('.get-btn').attr('data-id')){
                    oppo('请选择规格',1)
                    $('.size-mask').show();
                }else{
                    $(this).addClass('on')
                    var listdata={
                        GoodsId:id,
                        SingleGoodsId:$('.get-btn').attr('data-id'),
                        Quantity:$('.getnum .amount').val()
                    }

                    addshopcar(listdata);
                }
            }
        }


        function addshopcar(listdata) {
            $.ajax({
                url:'/Api/v1/Mall/Cart',
                type:'post',
                data:listdata
            }).done(function (rs) {
                if (rs.returnCode == '200'){
                    $('.size-mask').hide();
                    oppo('成功加入购物车',1)
                }else{
                    if(rs.returnCode == '401'){
                        Backlog();
                    }else{
                        oppo(rs.msg ,1)
                    }
                }
            }).always(function () {
                $('.addshopc').removeClass('on')
            })
        }
    })
     
    //立即购买
    $('.gobuy,.pro-in-gobuy').on('click',function () {
        if(!$('.get-btn').attr('data-id')){

                oppo('请选择规格',1)


            $('.size-mask').show();
        }else{
            window.location.href="/Html/ShopCar/Confirm.html?gid="+$('.get-btn').attr('data-id')+"|"+$('.getnum .amount').val()
        }

    })
    
})