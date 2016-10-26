/**
 * Created by admin on 2016/8/29.
 */
$(function () {
    $.ADDLOAD();
    var id  = $.getUrlParam('id');
    console.log(id)
    ajax();
    function ajax() {
        $.ajax({
            url:'/Api/v1/Order/'+id+'/Evaluate',
            type:'get',
            data:{
                orderId:id
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs)
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
        for (var i=0;i<rs.data.length;i++){
            //转换总价格
            if(rs.data[i].Price.toString().indexOf('.')>-1){
                if(rs.data[i].Price.toString().split('.')[1].length == 1){
                    rs.data[i].prices2=rs.data[i].Price.toString().split('.')[1]+'0'
                }else{
                    rs.data[i].prices2=rs.data[i].Price.toString().split('.')[1];
                }
                rs.data[i].prices1=rs.data[i].Price.toString().split('.')[0];

            }else{
                rs.data[i].prices1=rs.data[i].Price;
                rs.data[i].prices2='00';
            }
            //提取规格
            rs.data[i].shuxi=[]
            for (j in rs.data[i].GoodsAttribute.split(',')){
                rs.data[i].shuxi[j]=rs.data[i].GoodsAttribute.split(',')[j]
            }
            //转换时间
            var time =rs.data[i].EvaluateTime.split('T')
            rs.data[i].newtime=time[0]
            //转换回复时间
            if(rs.data[i].ReplyTime){
                for (j in rs.data[i].ReplyTime){
                    rs.data[i].newrtime = rs.data[i].ReplyTime.split('T')[0]
                }
            }
        }
        new Vue({
            el:'#che_com',
            data:rs,
            ready:function () {
                $.RMLOAD();
            }
        })
    }
})