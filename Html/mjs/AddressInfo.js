/**
 * Created by admin on 2016/8/26.
 */
$(function () {
    var id = $.getUrlParam('id');
    ajax(id);
    function ajax(id) {
        $.ajax({
            url:'/Api/v1/Member/Address/'+id,
            type:'get'
        }).done(function (rs) {
            if(rs.returnCode == '200'){
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
        new Vue({
            el:'#addaddress',
            data:rs
        })
    }

    //设为默认地址
    $('.submit').on('click',function () {
        //alert(1)
        if ($(this).hasClass('gray')){
            return false
        }else{
            $(this).addClass('gray');
            ajax2(id);
        }
    })
    function ajax2(id) {
        $.ajax({
            url:'/Api/v1/Member/Address/'+id+'/Default',
            type:'patch',
            data:{
                addressId:id
            } 
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                oppo('成功设为默认地址',1,function () {
                    window.location.replace("/Html/Member/PersonalCenter.html")
                })
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        }).always(function () {
            $('.submit').removeClass('gray')
        })
    }
    //删除收货地址
    $('.delete').on('click',function () {
        //alert(1)
        if ($(this).hasClass('on')){
            return false
        }else{
            $(this).addClass('on');
            ajax3(id);
        }
    })
    function ajax3(id) {
        $.ajax({
            url:'/Api/v1/Member/Address/'+id,
            type:'delete',
            data:{
                addressId:id
            }
        }).done(function (rs) {
            if(rs.returnCode == '200'){
                oppo('成功删除地址',1,function () {
                    window.location.replace("/Html/Member/PersonalCenter.html")
                })
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        }).always(function () {
            $('.delete').removeClass('on')
        })
    }
})