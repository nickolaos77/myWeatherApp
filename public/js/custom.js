//Hides for 2 sec the page contents displaying instead the loading screen
function show() {
    $('#sidr').removeClass('hidden')
    $('#second').removeClass('hidden')
    $('#simple-menu').removeClass('hidden')
    $('#first').addClass('hidden')
}
$(document).ready(function () {
    $('#simple-menu').sidr({
        displace: false
    })
    setTimeout(function () {
        if (document.readyState !== 'complete') show()
        else {
            $(document).ready(function () {
                show()
            })
        }
    }, 2000) 
})
$('#overlay, #close-menu-button').click(function () {
    $.sidr('close', 'sidr')
})
//Google autocomplete js https://ubilabs.github.io/geocomplete/
$("#cityName").geocomplete();

//Bookmarking function
$(function() {
  $('#bookmarkme').click(function() {
    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
      window.external.AddFavorite(location.href, document.title);
    } else if (window.opera && window.print) { // Opera Hotlist
      this.title = document.title;
      return true;
    } else { // webkit - safari/chrome
      alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
    }
  });
}); 
