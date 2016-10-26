/**
 * Created by admin on 2016/8/30.
 */
$(function () {
    $.ADDLOAD();
    var id = $.getUrlParam('id');
    var ids={}
    if(id){
        if(id.indexOf('|')>0) {
            ids.CartIds = id.split('|')
        }else{
            ids.CartIds=id
        }
    }
    ajax(ids)
    function ajax(ids) {
        $.ajax({
            url:"/Api/v1/Mall/OrderCalculation",
            data:ids,
            type:'post'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data);
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

        for (i in rs.Goods.List){
            //提取属性
            rs.Goods.List[i].shuxi=[]
            for (j in rs.Goods.List[i].GoodsAttribute.split(',')){
                rs.Goods.List[i].shuxi[j]=rs.Goods.List[i].GoodsAttribute.split(',')[j]
            }
            //转换价格
            if(rs.Goods.List[i].Price.toString().indexOf('.')>-1){
                if(rs.Goods.List[i].Price.toString().split('.')[1].length == 1){
                    rs.Goods.List[i].prices2=rs.Goods.List[i].Price.toString().split('.')[1]+'0'
                }else{
                    rs.Goods.List[i].prices2=rs.Goods.List[i].Price.toString().split('.')[1];
                }
                rs.Goods.List[i].prices1=rs.Goods.List[i].Price.toString().split('.')[0];

            }else{
                rs.Goods.List[i].prices1=rs.Goods.List[i].Price;
                rs.Goods.List[i].prices2='00';
            }
        }

        new Vue({
            el:'#detailed',
            data:rs,
            ready:function () {
                $.RMLOAD();
            }
        })
    }
})