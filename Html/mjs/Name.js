/**
 * Created by admin on 2016/8/24.
 */
// Storage['qy_Identity']session
$(function () {
    $('.submit').on('click',function () {
        var data={
            NickName:$('.text2').val(),
            Birthday:'',
            Sex:'0'
        }
        if ($(this).hasClass('gray')){
            return false;
        }else{
            $(this).addClass('gray')
            ajax(data);
        }
    })
    function ajax(data) {
      $.ajax({
          url:'/Api/v1/Member/'+ localStorage['qy_Identity'],
          type:'put',
          data:data
      }).done(function (rs) {
          if(rs.returnCode == '200'){
            oppo('修改成功',1,function () {
                window.location.href="/Html/Member/My.html";
                localStorage['qy_NickName'] = encodeURIComponent(encodeURIComponent(rs.data.NickName));
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
})