/**
 * Created by admin on 2016/8/27.
 */
$(function () {
    $.ADDLOAD();

    var data = {
        pageNo:'1',
        limit:'5'
    }
    ajax();
    //console.log(data)
    function ajax(callback,beforecallback) {
        $.ajax({
            url:'/Api/v1/Mall/Collect',
            type:'get',
            data:data,
            beforeSend:function () {
                if(typeof beforecallback=='function'){beforecallback()}
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data);
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
        //console.log(data)
    }
    var list;
    function view(rs) {
        if(rs.Goods.length == 0){
            $('.search-box').show();
            $('.nothing').show();
        }
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
            list.Goods=list.Goods.concat(rs.Goods)
        }else{
            list = new Vue({
                el:'#collection',
                data:rs,
                ready:function () {
                    $.RMLOAD();
                    deletecol();
                    alj();
                }
            })
        }
    }
    function alj() {
        $('.box').each(function () {
            var id = $(this).attr('data-id');
            $(this).find('.a').on('click',function () {
                window.location.href="/Html/Products/Info.html?id="+id;
            })
        })
    }
    //删除收藏
    function deletecol() {
        $('.box .delete').on('click',function(event){
            event.stopPropagation();
            var id = $(this).parents('.box').attr('data-id');
            //console.log(id)
            ajaxcancel(id);
        })
    }

    function ajaxcancel(id) {
        $.ajax({
            url:'/Api/v1/Mall/Collect/'+id,
            type:'DELETE'
        }).done(function (rs) {
            if (rs.returnCode = '200'){
                oppo('您已取消收藏',1,function () {
                    window.location.href="/Html/Collection/Collection.html"
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
    //下滑加载
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
})