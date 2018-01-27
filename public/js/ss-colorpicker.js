jQuery(function ($) {
    
    "use strict";
    var $colorpicker_height = $('.ss-colorpicker').height();
    $('.ss-colorpicker').height($('.ss-colorpicker-button').height());
    $('.ss-colorpicker').addClass('firstseen-colorpicker');

    $('.ss-colorpicker-button a').mouseover(function () {
        if ($('.ss-colorpicker').hasClass('firstseen-colorpicker')) {
            $('.ss-colorpicker').removeClass('firstseen-colorpicker');
        }
        $('.ss-colorpicker').height($colorpicker_height);
        if (!$(this).parent().hasClass('show-color')) {
            $(this).parent().addClass('show-color');
            $('.ss-colorpicker-list li').each(function (i) {
                var color_item = $(this);
                setTimeout(function () {
                    if ($('.ss-colorpicker').is(':hover')) {

                        color_item.addClass('active-color');
                    }

                }, (i + 1) * 100);
            });
        } else {

        }
        event.preventDefault();
    });

    $('.ss-colorpicker').mouseleave(function () {

        $('.ss-colorpicker').height($('.ss-colorpicker-button').height());
        var $ss_colorpicker_button = $('.ss-colorpicker-button a');

        if (!$ss_colorpicker_button.parent().hasClass('show-color')) {

        } else {

            $ss_colorpicker_button.parent().removeClass('show-color');
            $($('.ss-colorpicker-list li').get().reverse()).each(function (i) {
                var color_item = $(this);
                color_item.removeClass('active-color');
                setTimeout(function () {

                }, (i + 1) * 100);
            });
        }
        event.preventDefault();
    });

    $('.ss-colorpicker').mouseleave(function () {

        $('.ss-colorpicker').height($('.ss-colorpicker-button').height());
        var $ss_colorpicker_button = $('.ss-colorpicker-button a');

        if (!$ss_colorpicker_button.parent().hasClass('show-color')) {

        } else {

            $ss_colorpicker_button.parent().removeClass('show-color');
            $($('.ss-colorpicker-list li').get().reverse()).each(function (i) {
                var color_item = $(this);
                color_item.removeClass('active-color');
                setTimeout(function () {

                }, (i + 1) * 100);
            });
        }
        event.preventDefault();
    });

    $('.ss-colorpicker .ss-colorpicker-list li a ').click(function () {

        var current_color = $('.ss-colorpicker .ss-colorpicker-list li').find('a.active').attr('data-color');

        var selected_color = $(this).attr('data-color');
        if (!$(this).hasClass('active')) {
            color_changer(selected_color, current_color);
            $('.ss-colorpicker .ss-colorpicker-list li a ').removeClass('active');
            $(this).addClass('active');
        }
        event.preventDefault();
    });

    var color_changer = function (selected_color, current_color) {
        
        //change pattern image and logo
        if (selected_color == "light") {
            change_image('geometry.png');
            change_logo("images/logo.svg");
        } else if (selected_color == "dark") {
            change_image('congruent_outline.png');
            change_logo("images/logo-white.svg");
        } else if (selected_color == "green") {
            change_image('green-image.png');
            change_logo("images/logo-white.svg");
        } else if (selected_color == "yellow") {
            change_image('yellow_pattern.jpg');
            change_logo("images/logo-white.svg");
        } else if (selected_color == "blue") {
            change_image('none');
            change_logo("images/logo-white.svg");
        } else if (selected_color == "violet") {
            change_image('violet_pattern.jpg');
            change_logo("images/logo-white.svg");
        }

        //remove old stylesheet
        $("head link[href*='/color']").disabled = true;
        $("head link[href*='/color']").remove();
        //<link rel="stylesheet" type="text/css" href="css/color_light.css"/>
        $("head").append("<link/>");
        var css = $("head").children(":last");
        css.attr({
            //title: selected_color,
            rel:  "stylesheet",
            type: "text/css",
            href: "css/color_" + selected_color + ".css"
        });
        $("head").children(":last").disabled = false;

    }

    var change_image = function (imageurl) {
        if (imageurl == 'none') {
            $('.main-header').css({
                'background-image': function () {
                    return imageurl;
                }
            });
        } else {
            $('.main-header').css({
                'background-image': function () {
                    return 'url(images/patterns/' + imageurl + ')';
                }
            });
        }
    }

    var change_logo = function (logo_address) {

        $('.logo img').attr('src', function () {
            return logo_address;
        });

        if (!Modernizr.svg) {
            $('.logo img[src*="svg"]').attr('src', function () {
                return $(this).attr('src').replace('.svg', '.png');
            });
        }
    }


});