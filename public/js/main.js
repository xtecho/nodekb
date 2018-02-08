$(document).ready(function(){
  $('.detele-article').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url:'/articles/'+id,
      success:function(response){
        alert('Are you sure you want to delete the article?');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
