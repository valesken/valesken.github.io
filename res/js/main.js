const phrases = ['Software Engineer', 'Poet', 'Traveler', 'Scala Guy', 'Human'];
let position = 0;

/**
 * Rotate to the next phrase in phrases array
 */
function rotatePhrase() {
  if (position === (phrases.length - 1)) {
    position = 0;
  } else {
    position += 1;
  }
}

/**
 * Change the phrase that is currently displayed in the main-content div
 */
function changePhrase() {
  const $option = $('.option');
  $option.removeClass('fadeIn');
  $option.addClass('fadeOut');
  rotatePhrase();
  setTimeout(function() {
    $option.text(phrases[position]);
    $option.removeClass('fadeOut');
    $option.addClass('fadeIn');
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
function centerContent(animate) {
  const $content = $('#content');
  const $navbar = $('.myNav');
  const contentMarginTop = ($(window).height() - $content.outerHeight()) / 2;
  // Center main content
  $content.css({
    'margin-top': contentMarginTop,
    'margin-left': ($(window).width() - $content.outerWidth()) / 2
  });
  // Center navbar
  $navbar.css({
    'width': '100%',
    'text-align': 'center'
  });
  if (animate) {
    $navbar.animate({
      'margin-top': (contentMarginTop + $content.outerHeight()).toString()
    }, 500);
  } else {
    $navbar.css({
      'margin-top': contentMarginTop + $content.outerHeight()
    });
  }
}

/**
 * Change the content on display depending on whether the user has indicated
 * that they want to go to the 'Contact Me' or 'Home' page.
 */
function changeInnerContent(event) {
  $(".alert-success").addClass("do-not-display");
  $(".alert-danger").addClass("do-not-display");
  const $target = $(event.target);
  const $mainContent = $('#main-content');
  const $contactContent = $('#contact-content');
  if ($target.attr('id') === 'contact-link') {
    if ($target.text() === 'Contact Me') {
      // Fade out main-content, fade in contact-content
      $mainContent.removeClass('fadeInLeft');
      $mainContent.addClass('fadeOutLeft');
      setTimeout(function() {
        $mainContent.addClass('do-not-display');
        $contactContent.removeClass('do-not-display');
        $contactContent.removeClass('fadeOutRight');
        $contactContent.addClass('fadeInRight');
        $target.text("Home");
        centerContent(true);
      }, 750);
    } else {
      // Fade out contact-content, fade in main-content
      $contactContent.removeClass('fadeInRight');
      $contactContent.addClass('fadeOutRight');
      setTimeout(function() {
        $contactContent.addClass('do-not-display');
        $mainContent.removeClass('do-not-display');
        $mainContent.removeClass('fadeOutLeft');
        $mainContent.addClass('fadeInLeft');
        $target.text("Contact Me");
        centerContent(true);
      }, 750);
    }
  }
}

/**
 * Check if the optional input is provided.
 *
 * @param {String} input - The prefix for the input field to validate
 */
function checkOptionalInput(input) {
  const inputIsProvided = $('#' + input + '-input').val().length > 0;
  const $iconId = $('#' + input + '-icon');
  const $groupId = $('#' + input + '-group');
  if (inputIsProvided) {
    $iconId.css('visibility', 'visible');
    $groupId.addClass('has-success');
  } else {
    $iconId.css('visibility', 'hidden');
    $groupId.removeClass('has-success');
  }
}

/**
 * Check if the provided input is valid. If not, show the input as in error and
 * return false, otherwise show the input as ok and return true.
 *
 * @param {String} input - The prefix for the input field to validate
 */
function isInputValid(input) {
  const inputIsValid = $('#' + input + '-input').val().length > 0;
  const $iconId = $('#' + input + '-icon');
  const $groupId = $('#' + input + '-group');
  if (inputIsValid) {
    $iconId.css('visibility', 'visible');
    $iconId.removeClass('glyphicon-remove');
    $iconId.addClass('glyphicon-ok');
    $groupId.removeClass('has-error');
    $groupId.addClass('has-success');
  } else {
    $iconId.css('visibility', 'visible');
    $iconId.removeClass('glyphicon-ok');
    $iconId.addClass('glyphicon-remove');
    $groupId.removeClass('has-success');
    $groupId.addClass('has-error');
  }
  return inputIsValid;
}

/**
 * Check if the form's fields all validate. If valid, enable the button, else
 * disable the button. Return the true if the form is valid, else false.
 */
function checkContactFormInput() {
  checkOptionalInput('name');
  checkOptionalInput('subject');
  const valid = isInputValid('from-email') & isInputValid('body');
  $('#send-button').prop('disabled', !valid);
  return valid;
}

/**
 * Handle the logic to send the form.
 */
function sendEmail() {
  if (checkContactFormInput()) {
    // Get information from the contact form
    let subject = $('#subject-input').val();
    const name = $('#name-input').val();
    if (name.length > 0) {
      subject += ('; from ' + name);
    }
    const data = {
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
      const $alertDanger = $('.alert-danger');
      const $alertSuccess = $('.alert-success');
      if(data.statusCode === 200){
        $alertDanger.addClass('do-not-display');
        $alertSuccess.removeClass('do-not-display');
        $alertSuccess.text('Success! ' + data.message);
      } else {
        $alertSuccess.addClass('do-not-display');
        $alertDanger.removeClass('do-not-display');
        $alertDanger.text('Error! ' + data.message);
      }
    });
  }
}

// Initial DOM ready, kick everything off
$(document).ready(function() {
  centerContent(false);
  setTimeout(changeInitialPhrase, 3000);
  $('a').on('click', changeInnerContent);
  $('.form-control').on('change', checkContactFormInput);
  $('#send-button').on('click', sendEmail);
});

// If window is resized, re-center everything
$(window).resize(function() {
  centerContent(false);
});