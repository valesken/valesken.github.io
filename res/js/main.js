var phrases = ['Software Engineer', 'Traveler', 'Mobile Developer', 
               'Grad Student', 'Full-Stack Developer', 'Human'];
var position = 0;

/**
 * Rotate to the next phrase in phrases array
 */
function rotatePhrase() {
    if (position === (phrases.length - 1)) {
        position = 0;
    } else {
        position += 1;
    }
};

/**
 * Change the phrase that is currently displayed in the main-content div
 */
function changePhrase() {
    $('.option').removeClass('fadeIn');
    $('.option').addClass('fadeOut');
    rotatePhrase();
    setTimeout(function() {
        $('.option').text(phrases[position]);
        $('.option').removeClass('fadeOut');
        $('.option').addClass('fadeIn');
    }, 1500);
}

/**
 * Change the initial phrase that is displayed in the main-content div. This is
 * a separate piece of logic because it needs to set up the recurring interval,
 * which is longer than the time it should take for the first phrase to change.
 */
function changeInitialPhrase() {
    changePhrase();
    setInterval(changePhrase, 5000);
}

/**
 * Vertically and horizontally center the content of the site.
 */
function centerContent() {
    $('#content').css({
        'margin-top': ($(window).height() - $('#content').outerHeight()) / 2,
        'margin-left': ($(window).width() - $('#content').outerWidth()) / 2
    });
}

/**
 * Change the content on display depending on whether the user has indicated
 * that they want to go to the 'Contact Me' or 'Home' page.
 */
function changeInnerContent(event) {
    var $target = $(event.target);
    if ($target.attr('id') === 'contact-link') {
        if ($target.text() === 'Contact Me') {
            $('#main-content').addClass('do-not-display');
            $('#contact-content').removeClass('do-not-display');
            $target.text("Home");
        } else {
            $('#main-content').removeClass('do-not-display');
            $('#contact-content').addClass('do-not-display');
            $target.text("Contact Me");
        }
    }
    centerContent();
}

/**
 * Check if the optional input is provided.
 *
 * @param {String} input - The prefix for the input field to validate
 */
function checkOptionalInput(input) {
    var inputId = '#' + input + '-input';
    var iconId = '#' + input + '-icon';
    var groupId = '#' + input + '-group';
    if ($(inputId).val().length > 0) {
        $(iconId).css('visibility', 'visible');
        $(groupId).addClass('has-success');
    } else {
        $(iconId).css('visibility', 'hidden');
        $(groupId).removeClass('has-success');
    }
}

/**
 * Check if the provided input is valid. If not, show the input as in error and
 * return false, otherwise show the input as ok and return true.
 *
 * @param {String} input - The prefix for the input field to validate
 */
function isInputValid(input) {
    var inputId = '#' + input + '-input';
    var iconId = '#' + input + '-icon';
    var groupId = '#' + input + '-group';
    if ($(inputId).val().length > 0) {
        $(iconId).css('visibility', 'visible');
        $(iconId).removeClass('glyphicon-remove')
        $(iconId).addClass('glyphicon-ok')
        $(groupId).removeClass('has-error');
        $(groupId).addClass('has-success');
        return true;
    } else {
        $(iconId).css('visibility', 'visible');
        $(iconId).removeClass('glyphicon-ok')
        $(iconId).addClass('glyphicon-remove')
        $(groupId).removeClass('has-success');
        $(groupId).addClass('has-error');
        return false;
    }
}

/**
 * Check if the form's fields all validate. If valid, enable the button, else
 * disable the button. Return the true if the form is valid, else false.
 */
function checkContactFormInput() {
    checkOptionalInput('name');
    checkOptionalInput('subject');
    var valid = isInputValid('from-email') & isInputValid('body');
    $('#send-button').prop('disabled', !valid);
    return valid;
}

/**
 * Handle the logic to send the form.
 */
function sendEmail() {
    if (checkContactFormInput()) {
        // Get information from the contact form
        var subject = $('#subject-input').val();
        var name = $('#name-input').val();
        if (name.length > 0) {
            subject += ('; from ' + name);
        };
        var data = {
            'subject': subject,
            'replyTo': $('#from-email-input').val(),
            'textBody': $('#body-input').val()
        };

        // Post the information
        $.ajax({
            type: 'POST',
            url: 'https://webtask.it.auth0.com/api/run/wt-jeff_valesken-gmail_com-0/contact?webtask_no_cache=1',
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: 'json'
        }).done(function(data) {
            if(data.statusCode == 200){
                console.log('Success! ' + data.message);
            } else {
                console.log('failure');
            }
        });
    }
}

$(document).ready(function() {
    centerContent();
    setTimeout(changeInitialPhrase, 3000);
    $('a').on('click', changeInnerContent);
    $('.form-control').on('change', checkContactFormInput);
    $('#send-button').on('click', sendEmail);
});
$(window).resize(centerContent);