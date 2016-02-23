$(document).ready(function() {
    $('#main').css({
        'margin-left': ($('.container').width() - $('#main').outerWidth()) / 2,
        'margin-top': ($(window).height() - $('#main').outerHeight()) / 2
    });
})