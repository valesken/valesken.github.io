$(document).ready(function() {
    console.log($('.container').width());
    console.log($(window).height());
    console.log($('.panel').width());
    console.log($('.panel').height());
    $('.panel').css({
        'margin-left': ($('.container').width() - $('.panel').outerWidth()) / 2,
        'margin-top': ($(window).height() - $('.panel').outerHeight()) / 2
    });
})