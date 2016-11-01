/**
 * Created by admin on 2016/9/12.
 */
$(function () {
    $.ADDLOAD();
    var code = localStorage['qy_InvitationCode'];
    $('.mask .num').html(code);
    //复制链接
    var clipboard = new Clipboard('.copy');
    $('#bar').val(location.origin+'/Html/Share/PartnerPlan.html?code='+code)
    clipboard.on('success', function(e) {
        // console.info('Action:', e.action);
        // console.info('Text:', e.text);
        // console.info('Trigger:', e.trigger);
 
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        // console.error('Action:', e.action);
        // console.error('Trigger:', e.trigger);
    });
    ajaxincome();
    function ajaxincome() {
        $.ajax({
            url:"/Api/v1/Member/CenterInfo",
            type:"get"
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                if(rs.data.Money){
                    $('.wallet .num span').html(rs.data.Money);
                }
                $('.per-cen .left .sz').html(rs.data.TodayIncome);
                $('.per-cen .right .sz').html(rs.data.TotalIncome)
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
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
    //佣金记录
    ajaxmoney();
    var dataMoney={
        pageNo:1,
        limit:5
    }
    function ajaxmoney(callback,beforecallback) {
        $.ajax({
            url:'/Api/v1/Member/Commission',
            type:'get',
            data:dataMoney,
            beforeSend:function () {
                if(typeof beforecallback=='function'){beforecallback()}
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewmoney(rs.data)
                $('.loadingm').hide();
                window.mpage=Math.ceil(rs.data.TotalCount/dataMoney.limit)
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
    var listmoney
    function viewmoney(rs) {

        for (var i=0;i<rs.WalletBills.length;i++){
            //时间
            rs.WalletBills[i].time=rs.WalletBills[i].CreateTime.toString().split('T')[0]
            //金额
            if(rs.WalletBills[i].Money.toString().indexOf('.')>-1){
                if(rs.WalletBills[i].Money.toString().split('.')[1].length == 1){
                    rs.WalletBills[i].prices2=rs.WalletBills[i].Money.toString().split('.')[1]+'0'
                }else{
                    rs.WalletBills[i].prices2=rs.WalletBills[i].Money.toString().split('.')[1];
                }
                rs.WalletBills[i].prices1=rs.WalletBills[i].Money.toString().split('.')[0];

            }else{
                rs.WalletBills[i].prices1=rs.WalletBills[i].Money;
                rs.WalletBills[i].prices2='00';
            }
        }


        if(listmoney){
            listmoney.WalletBills=listmoney.WalletBills.concat(rs.WalletBills)
        }else{
            listmoney = new Vue({
                el:'#record_con',
                data:rs,
                ready:function () {
                    $.RMLOAD();
                }
            })
        }
    }
    ajaxteam();
    var dataTeam={
        pageNo:1,
        limit:5
    }
    function ajaxteam(callback,beforecallback) {
        $.ajax({
            url:'/Api/v1/Member/Partner',
            type:'get',
            data:dataTeam,
            beforeSend:function () {
                if(typeof beforecallback=='function'){beforecallback()}
            }
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewteam(rs.data)
                $('.loadingt').hide();
                window.tpage=Math.ceil(rs.data.TotalCount/dataTeam.limit)
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
    var listteam
    function viewteam(rs) {
        $('.btns .team span').html(rs.Partners.length)
        for (var i=0;i<rs.Partners.length;i++){
            //金额
            if(rs.Partners[i].Money.toString().indexOf('.')>-1){
                if(rs.Partners[i].Money.toString().split('.')[1].length == 1){
                    rs.Partners[i].prices2=rs.Partners[i].Money.toString().split('.')[1]+'0'
                }else{
                    rs.Partners[i].prices2=rs.Partners[i].Money.toString().split('.')[1];
                }
                rs.Partners[i].prices1=rs.Partners[i].Money.toString().split('.')[0];

            }else{
                rs.Partners[i].prices1=rs.Partners[i].Money;
                rs.Partners[i].prices2='00';
            }
            //头像
            if(!rs.Partners[i].Avatar){
                console.log(1)
                rs.Partners[i].himg = '/Html/img/img08.jpg'
            }else{
                rs.Partners[i].himg= rs.Partners[i].Avatar.SmallThumbnail
            }
        }

        if(listteam){
            listteam.Partners=listteam.Partners.concat(rs.Partners)
        }else{
            listteam = new Vue({
                el:'#team_con',
                data:rs,
                ready:function () {
                    js();
                    create();
                }
            })
        }
    }
    var flag1 = true;
    var flag2 =true;
    $(window).scroll(function () {
        var H = $('body,html').height();
        var h = $(window).height();
        var t = $('body').scrollTop();
        if($('.record-con').hasClass('db')){
            if (t >= H - h * 1.1 && flag1 == true) {
                flag1 = false;
                dataMoney.pageNo++;
                if (dataMoney.pageNo > mpage) {
                    $('.loadingm').hide();
                } else {
                    ajaxmoney(function () {
                        setTimeout(function () {
                            flag1 = true;
                        }, 500)
                    }, function () {
                        $('.loadingm').show();
                    })
                }
            }
        }else {
            if (t >= H - h * 1.1 && flag2 == true) {
                flag2 = false;
                dataTeam.pageNo++;
                if (dataTeam.pageNo > tpage) {
                    $('.loadingt').hide();
                } else {
                    ajaxteam(function () {
                        setTimeout(function () {
                            flag2 = true;
                        }, 500)
                    }, function () {
                        $('.loadingt').show();
                    })
                }
            }
        }

    })
    function create() {
        $('.wallet .intro').on('click',function () {
            window.location.href="/Html/Share/PartnerPlan.html?code="+code
        })
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width : 200,//设置宽高
            height : 200
        });
        qrcode.makeCode(location.origin+"/Html/Share/PartnerPlan.html?code="+code)
        $('.submit').on('click',function () {
            if(localStorage['qy_MemberType']==1){
                $('.mask').fadeIn()
            }else{
                $('.success').fadeIn()
            }
        })
    }

    function js() {
        $('.success .wait').on('click',function () {
            $('.success').hide();
        })
        $('.mask').on('click',function () {
            $('.mask').fadeOut()
        })
        $('.btns .record').on('click',function () {
            $(this).addClass('cur');
            $('.btns .team').removeClass('cur');
            $('.record-con').addClass('db');
            $('.team-con').removeClass('db');
        })
        $('.btns .team').on('click',function () {
            $(this).addClass('cur');
            $('.btns .record').removeClass('cur');
            $('.record-con').removeClass('db');
            $('.team-con').addClass('db');
        })
    }
})
