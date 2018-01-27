jQuery(document).ready(function ($) {

    "use strict";
    /*------------------------------------------------------------------
		Global Variables
	------------------------------------------------------------------*/

    var contactFormVars = {
        "contact_form_required_fields_label_ajax": "This is a required field.",
        "contact_form_warning": "Please verify fields and try again.",
        "contact_form_email_warning": "Please enter a valid e-mail address and try again.",
        "contact_form_error": "There was an error sending your email. Please try again later.",
        "contact_form_success_message": "Thanks, your message has been sent"
    };
    var submitStatus = false;


    /*------------------------------------------------------------------
		Validating
	------------------------------------------------------------------*/

    $('.contact-form input[type="text"], .contact-form input[type="email"], .contact-form textarea').each(function () {
        $(this).val('');
    });

    $('.contact-form').submit(function () {
        submitStatus = false;
        $('.contact-form input, .contact-form textarea').each(function () {
            $(this).removeClass('contactform-not-valid');
        });
        $('.contact-form .submit').attr("disabled", "disabled");
        $(".ajax-loader").css("visibility", "visible");
        var isError = false;
        $('.contact-form input, .contact-form textarea').each(function () {
            if ($(this).attr('aria-required') && ($.trim($(this).val()) == $(this).attr('placeholder') || $.trim($(this).val()) == '')) {
                //Add border
                $(this).addClass('contactform-not-valid');
                //Message
                $('.contactform-response-output').css("display", "block");
                $('.contactform-response-output').html(contactFormVars.contact_form_error).removeClass('contactform-mail-sent-ng, contactform-mail-sent-ok');
                $('.contactform-response-output').html(contactFormVars.contact_form_warning).addClass('contactform-validation-errors');
                isError = true;
            }
            if ($(this).attr('type') == 'email') {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (reg.test($(this).val()) == false) {
                    $(this).addClass('contactform-not-valid');
                    if (!isError) {
                        $('.contactform-response-output').css("display", "block");
                        $('.contactform-response-output').html(contactFormVars.contact_form_error).removeClass('contactform-mail-sent-ng, contactform-mail-sent-ok');
                        $('.contactform-response-output').html(contactFormVars.contact_form_email_warning).addClass('contactform-validation-errors');
                    }
                    isError = true;
                }
            }
        });

        //$('.contact-form input[type="text"], .contact-form input[type="email"], .contact-form textarea').focus(function () {
        //    if (submitStatus) {
        //        $('.contactform-response-output').css("display", "none");
        //    }
        //});

        if (isError) {
            $('.contact-form .submit').removeAttr("disabled");
            $(".ajax-loader").css("visibility", "hidden");
            return false;
        } else {
            var name = $('#contact-name').val(),
                email = $('#contact-email').val(),
                url = $('#contact-url').val(),
                message = $('#contact-message').val();
            $.ajaxSetup({
                cache: false
            });
            var dataString = 'contact-name=' + name + '&contact-email=' + email + '&contact-url=' + url + '&contact-message=' + message + '&submitted=true&isAjax=1';
            $.ajax({
                type: "POST",
                url: $('.contact-form').attr('action'),
                data: dataString,
                success: function (msg) {
                    $('.img.ajax-loader').css({ visibility: 'hidden' });
                    // Check to see if the mail was successfully sent
                    $('.contactform-response-output').css("display", "block");
                    if (msg == 'Mail sent') {
                        // Update the progress bar
                        $('.contactform-response-output').html(contactFormVars.contact_form_error).removeClass('contactform-mail-sent-ng, contactform-validation-errors');
                        $('.contactform-response-output').html(contactFormVars.contact_form_success_message).addClass('contactform-mail-sent-ok');
                        // Reset the subject field and message textbox
                        $('.contact-form input[type="text"], .contact-form input[type="email"], .contact-form textarea').each(function () {
                                $(this).val('');
                        });
                    } else {
                        $('.contactform-response-output').html(contactFormVars.contact_form_error).removeClass('contactform-mail-sent-ok, contactform-validation-errors');
                        $('.contactform-response-output').html(contactFormVars.contact_form_error).addClass('contactform-mail-sent-ng');
                        $('.contactForm .submit').removeAttr("disabled");
                    }
                    // Activate the submit button
                    $('.contactForm .submit').removeAttr("disabled");
                    submitStatus = true;
                },
                error: function (ob, errStr) {
                    $('.contactform-response-output').css("display", "block");
                    $('.contactform-response-output').html(contactFormVars.contact_form_error).removeClass('contactform-mail-sent-ok, contactform-validation-errors');
                    $('.contactform-response-output').html(contactFormVars.contact_form_error).addClass('contactform-mail-sent-ng');
                    //Activate the submit button
                    $('.contactForm .submit').removeAttr("disabled");
                }

            });
            $(".ajax-loader").css("visibility", "hidden");
            return false;
        }
    }); 
});

