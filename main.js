var phrases = ['Software Engineer', 'Traveller', 'Mobile Developer', 'Book Lover', 'Grad Student'];
var position = 0;

function advancePosition() {
    if (position === (phrases.length - 1)) {
        position = 0;
    } else {
        position += 1;
    }
};

function changeText() {
    $('.option').removeClass('fadeIn');
    $('.option').addClass('fadeOut');
    advancePosition();
    setTimeout(function() {
        $('.option').text(phrases[position]);
        $('.option').removeClass('fadeOut');
        $('.option').addClass('fadeIn');
    }, 1500);
}

function changeInitialText() {
    changeText();
    setInterval(changeText, 5000);
}

function centerMain() {
    $('#main').css({
        'margin-left': ($(window).width() - $('#main').outerWidth()) / 2,
        'margin-top': ($(window).height() - $('#main').outerHeight()) / 2
    });
}

$(document).ready(function() {
    centerMain();
    setTimeout(changeInitialText, 3000);
});
$(window).resize(centerMain);