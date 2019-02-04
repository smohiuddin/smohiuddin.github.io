( function( $ ) {
    "use strict";

    // IE8 detector
    var isIE = document.all && document.querySelector && !document.addEventListener;
    if (isIE === true) {
        $('body').addClass('ie8');
    }

    // Minimize menu for mobile screens (max width: 940px)
    function mobileMenu() {
        var $navMenu = $('#nav-menu'),
            smallClass = 'small-menu',
            breakPoint = 941;


        if ( $(window).width() < breakPoint ) {
            if ( ! $navMenu.hasClass(smallClass) ) {
                $navMenu.addClass(smallClass).prepend('<a id="toggle-menu" href="#"><i class="fa fa-bars"></i></a>');
            }          
        } else {
            $navMenu.removeClass(smallClass).removeClass('open-small-nav').find('#toggle-menu').remove();
        }
    }

    // Vertical centering
    function contentVerticalCentering(element) {
        if ( element == null ) {
            element = $('.wrapper');
            var offset = $(window).height() - element.outerHeight();

            if ( offset > 0 ) {
                element.css({
                    'margin-top'    : offset/2, 
                    'margin-bottom' : offset/2
                });
            } else {
                element.removeAttr('style').css('overflow','auto');
            }
        } else {
            element.css('margin-top', -(element.outerHeight()/2) );
        }
    }

    // Add Scrollbar to the extra section
    function addSlimScroll() {
        if ( ! $('.container').length > 0 ) { 
            $('.extra-section').wrapInner('<div class="container" />');
        }
        $('.container').slimScroll({
            height      : 'auto',
            distance    : '10px',
            position    : 'left',
            color       : '#999'
        });
    }

    // Set full height to extra section
    function fullHeightExtSection(){
        $('.extra-section').css('height', $(window).outerHeight());  
    }
    
    // Add Form Message Container
    function addMsgForm() {
        if ( ! $('#form-msg').length > 0 ) {
           $('body').append('<div id="form-msg" style="display:none"><a href="#"><i class="fa fa-times"></i></a><span></span></div>'); 
        } else {
           $('#form-msg').removeClass().find('span').text(''); 
        }   
    }

    // Email validation
    function validateEmail(email){
        var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        var valid = emailReg.test(email);

        if (!valid) {
            return false;
        } else {
            return true;
        }
    }

    // Add Overlay div for background gradient
    $('.wrapper').append('<div id="overlay"/>');

    contentVerticalCentering();

    mobileMenu();

    $(document).on('click','#toggle-menu', function(){
        $(this).parent().toggleClass('open-small-nav');
        return false;
    });


    /*-------------------------------------------------------------------*/
    /*      EXTRA SECTIONS 
    /*-------------------------------------------------------------------*/

    // Open Extra Section
    $('#nav-menu ul a').on('click touchend',function(e){
        e.preventDefault();
        var cls = $(this).attr('class');
        if ( ! $(this).hasClass('open-ext') ) {
            $('#nav-menu a').removeClass('open-ext');
            $(this).addClass('open-ext');   
            $('.extra-section').removeClass('open');
            $('#'+cls).addClass('open').css('opacity',1);
            addSlimScroll();
            $('body').addClass('ext');
        }
    });

    // Close Extra Section
    $('.close-ext-section').on('click touchend',function(e){
        e.preventDefault();
        $('.extra-section').removeClass('open');
        setTimeout(function(){
            $('.extra-section').css('opacity',0);
        }, 500);
        $('body').removeClass('ext');
        $('#nav-menu').removeClass('open-small-nav').find('a').removeClass('open-ext');
    });


    /*-------------------------------------------------------------------*/
    /*      FORMS 
    /*-------------------------------------------------------------------*/

    // Form Messages
    var formMessages = {
      subscribed    : 'Thanks for your subscription!',              // newsletter form
      sent          : 'Message sent successfully. Thanks!',
      duplicate     : 'You\'re already subscribed!',                // newsletter form
      fail          : 'Oops! Sending error. Please try again',
      failEmail     : 'Invalid Email!',
      emptyField    : 'Empty field!',
      emptyFields   : 'Empty fields!'
    };

    // Form Processor
    $('.extra-section form').submit(function(e){
        e.preventDefault();

        // Add form message container
        addMsgForm();

        var emailField, emptyMsg, successMsg,
            checkEmpty = false,
             postData = {},
            $msgForm = $('#form-msg'),
            $msgText = $msgForm.find('span'),
            $that = $(this);
    
        if ( $that.hasClass('newsletter-form') ) {
            // Newsletter form variables
            emailField = $that.find('input[name="newsletter"]').val();
            postData = { newsletter: emailField };
            emptyMsg = formMessages.emptyField;
            successMsg = formMessages.subscribed;
        } else {
            // Contact form variables
            emailField = $that.find('input[name="email"]').val();
            postData = $that.serialize();
            emptyMsg = formMessages.emptyFields;
            successMsg = formMessages.sent;
        }
        
        // Check if all fields are not empty
        $that.find(':text, textarea').each(function() {
            if($.trim($(this).val()) === '') {
                $msgText.text(emptyMsg).parent().addClass('fail').fadeIn('fast');
                checkEmpty = true;
            }     
        });

        // Stop all if there is at least one empty field
        if ( checkEmpty ) {
            return false;
        }

        // Check if the email is valid. Otherwise stop all
        if ( ! validateEmail(emailField) ) {
            $msgText.text(formMessages.failEmail).parent().addClass('fail').fadeIn('fast');
            return false;
        }

        $that.find('.submit').after('<img id="form-loader" src="img/loader.gif" alt="loader">');

        // Send data to the corresponding processing file
        $.post($that.attr('action'), postData, function(result){
            if (result == 'success') {
                $msgText.text(successMsg);                      // success
                $that.find(':text, textarea').val('');          // reset all form fields
            } else if (result == 'duplicate') {
                $msgText.text(formMessages.duplicate);          // duplicate email (newsletter form)    
            } else {
                $msgText.text(formMessages.fail);               // fail
            }       
        }).fail(function() {
            $msgText.text(formMessages.fail);                   // fail (problem with sending data)
        }).always(function(result) {
            $('#form-loader').remove();
            $msgForm.addClass(result).fadeIn('fast');           // show form message
        });

        contentVerticalCentering($('#form-msg span'));

    });


    // Close Form Message
    $(document).on('click','#form-msg a', function(){
        $(this).parent().fadeOut();
        return false;
    });


    /* Window load scripts */
    $(window).load(function() {

        /*-------------------------------------------------------------------*/
        /*      COUNTDOWN 
        /*-------------------------------------------------------------------*/
        /*
        var $countdown = $('#countdown'),
            dateCountdown = $countdown.data('countdown'),
            endCountdownMSg = 'We are ready!',
            countdownComp = {
                weeks   : '<div class="count-el"><span>%-w</span> %!w:week,weeks;</div>',
                days    : '<div class="count-el"><span>%-d</span> %!d:day,days;</div>',
                hours   : '<div class="count-el"><span>%-H</span> %!H:hour,hours;</div>',
                mins    : '<div class="count-el"><span>%-M</span> %!M:minute,minutes;</div>',
                sec     : '<div class="count-el"><span>%-S</span> %!S:second,seconds;</div>'
            };
        
        $countdown.countdown(dateCountdown)
        .on('update.countdown', function(event) {
            var format = '';      
            if(event.offset.weeks > 0) {
                format += countdownComp.weeks;
            }
            format += countdownComp.days
                    + countdownComp.hours
                    + countdownComp.mins
                    + countdownComp.sec;

            $(this).html(event.strftime(format));
        })
        .on('finish.countdown', function(event) {
            $(this).addClass('end-countdown').html('<span>'+endCountdownMSg+'</span>');
        });
        */

        fullHeightExtSection();

        addSlimScroll();

        $('body').removeClass('loading');

    });

    /* window resize scripts */
    $(window).resize(function() {

        contentVerticalCentering();

        fullHeightExtSection(); 

        addSlimScroll();

        mobileMenu();

    });

} )( jQuery );