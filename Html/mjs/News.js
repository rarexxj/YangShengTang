/**
 * Created by Administrator on 2016/10/27.
 */
$(function () {

    $.ADDLOAD();
    var datas = {
        Category: 0,
        pageNo: 1,
        limit: 10
    };
    var list;
    ajaxNews();
    function ajaxNews() {
        $.ajax({
            url: '/Api/v1/Message',
            data: datas,
            type: 'get'
        }).done(function (rs) {
            if (rs.returnCode == '200') {
                window.allpage=Math.ceil(rs.data.TotalCount/datas.Limit)
                // 总页数
                viewNews(rs.data)
                
            } else {
                if (rs.returnCode == '401') {
                    Backlog();
                } else {
                    oppo(rs.msg, 1)
                }
            }
        })
    }
    function viewNews(rs) {
        if(list){
            list.Messages=list.Messages.concat(rs.Messages);
        }else{
            list = new Vue({
                el:'#News',
                data:rs,
                ready:function () {
                    $.RMLOAD()
                }
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
            if(datas.pageNo>allpage){
                //$('.loading').hide();

            }else{
                setTimeout(function () {
                    flag = true;
                }, 500)
                ajaxNews()
            }
        }
    })
})