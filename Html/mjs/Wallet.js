/**
 * Created by admin on 2016/9/9.
 */
$(function () {
    $.ADDLOAD();
    //提现金额渲染
    cash();
    function cash() {
        $.ajax({
            url:"/Api/v1/Wallet/Cash",
            type:"get"
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view(rs.data)
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
        //可提现金额
        if(rs.Available.toString().indexOf('.')>-1){
            if(rs.Available.toString().split('.')[1].length == 1){
                rs.prices2=rs.Available.toString().split('.')[1]+'0'
            }else{
                rs.prices2=rs.Available.toString().split('.')[1];
            }
            rs.prices1=rs.Available.toString().split('.')[0];

        }else{
            rs.prices1=rs.Available;
            rs.prices2='00';
        }
        new Vue({
            el:"#moneyinfo",
            data:rs
        })
    }
    //资金变动记录渲染

    var datas={
        walletType:1,
        pageNo:1,
        limit:6
    }
    bill();
    function bill(callback,beforecallback) {
        $.ajax({
            url:'/Api/v1/WalletBill',
            type:'get',
            data:datas,
            beforeSend:function () {
                if(typeof beforecallback=='function'){beforecallback()}
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                view2(rs.data)
                window.allpage=Math.ceil(rs.data.TotalCount/datas.limit);
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
    function view2(rs) {
        //交易时间
        for (i in rs.Bills){
            rs.Bills[i].time1=rs.Bills[i].CreateTime.split('T')[0];
            rs.Bills[i].time2=rs.Bills[i].CreateTime.split('T')[1];
        }
        if(list){
            list.Bills=list.Bills.concat(rs.Bills)
        }else{
             list=new Vue({
                el:'#money_list',
                data:rs,
                 ready:function () {
                     $.RMLOAD();
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
            datas.pageNo++;
            if(datas.pageNo>allpage){
                $('.loading').hide();
            }else{
                bill(function () {
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