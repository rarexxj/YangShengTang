/**
 * Created by admin on 2016/8/25.
 */
$(function () {
    var reg =/^1[3|4|5|7|8]\d{9}$/;
    //获得省
    province();
    //city(110000);
    //xian(110100);
    //street(110101)
    function province() {
        $.ajax({
            url:'/Api/v1/Settings/District/0/Child',
            type:'get'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewprovince(rs);
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    function viewprovince(rs) {
        new Vue({
            el:'#province',
            data:rs,
            ready:function () {
                getcity();
            }
        }) 
    }
    //得到市
    function getcity() {
        $('#province').on('change',function () {
            var id = $(this).find('option:selected').attr('data-id');
            city(id)
        })
    }
    function city(id) {
        $.ajax({
            url:'/Api/v1/Settings/District/'+ id +'/Child',
            type:'get'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewcity(rs);
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    var cityvalue;
    function viewcity(rs) {
        if (cityvalue){
            cityvalue.data = rs.data
        }else{
            cityvalue = new Vue({
                el:'#City',
                data:rs,
                ready:function () {
                    getxian()
                }
            })
        }

    }
    function getxian() {
        $('#City').on('change',function () {
            var id = $(this).find('option:selected').attr('data-id');
            xian(id);
        })
    }
    function xian(id) {
        $.ajax({
            url:'/Api/v1/Settings/District/'+ id +'/Child',
            type:'get'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewxian(rs);
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    var xianvalue;
    function viewxian(rs) {
        if (xianvalue){
            xianvalue.data = rs.data
        }else{
            xianvalue = new Vue({
                el:'#District',
                data:rs,
                ready:function () {
                    getjd()
                }
            })
        }

    }
    function getjd() {
        $('#District').on('change',function () {
            var id = $(this).find('option:selected').attr('data-id');
            street(id);
        })
    }
    function street(id) {
        $.ajax({
            url:'/Api/v1/Settings/District/'+ id +'/Child',
            type:'get'
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                viewstreet(rs);
            }else{
                if(rs.returnCode == '401'){
                    Backlog();
                }else{
                    oppo(rs.msg ,1)
                }
            }
        })
    }
    var streetvalue;
    function viewstreet(rs) {
        if (streetvalue){
            streetvalue.data = rs.data
        }else{
            streetvalue = new Vue({
                el:'#Street',
                data:rs,
                ready:function () {
                    getjd()
                }
            })
        }
    }
    $('.submit').on('click',function () {
        if ($(this).hasClass('gray')){
            return false;
        }else{

            if($('.use').val() == ''){
                oppo('收货人不能为空',1)
                return false;
            }else if($('.ph').val() == ''){
                oppo('手机号不能为空',1)
                return false;
            }else if(!reg.test($('.ph').val())){
                oppo("手机号格式有误", 1);
                return false;
            }else if($('.postcode').val() == ''){
                oppo('邮政编码不能为空',1)
                return false;
            }else if($('#province').val() == ''){
                oppo('省份不能为空',1)
                return false;
            }else if($('#City').val() == ''){
                oppo('市区不能为空',1)
                return false;
            }else if($('#District').val() == ''){
                oppo('地区不能为空',1)
                return false;
            }else if($('#Street').val() == ''){
                oppo('街道不能为空',1)
                return false;
            }else if($('.textarea').val() == ''){
                oppo('详细地址不能为空',1)
                return false;
            }else{
                var RegionName = $('#province').val()+','+$('#City').val()+','+$('#District').val()+','+$('#Street').val()
                var data = {
                    Address:$('.textarea').val(),
                    Contacts:$('.use').val(),
                    Phone:$('.ph').val(),
                    Province:$('#province option:selected').attr('data-id'),
                    City:$('#City option:selected').attr('data-id'),
                    District:$('#District option:selected').attr('data-id'),
                    Street:$('#Street option:selected').attr('data-id'),
                    RegionName:RegionName,
                    Postcode:$('.postcode').val()
                }
                $(this).addClass('gray')
                ajax(data);
            }
        }

    })
        

    function ajax(data) {
        $.ajax({
            url:'/Api/v1/Member/Address',
            type:'post',
            data:data
        }).done(function (rs) {
            if (rs.returnCode == '200'){
                oppo('保存成功',1);
                window.location.replace("/Html/Member/PersonalCenter.html")

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

})