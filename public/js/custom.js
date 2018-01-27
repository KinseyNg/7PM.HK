jQuery(function ($) {


    "use strict";
    /*---------------------------------------------------------------------------------*/
    /*  Global Values
	/*---------------------------------------------------------------------------------*/

    var $window = $(window),
		$body = $('body'),
		viewport_width = $window.width(),
		viewport_height = $window.height(),
        lightbox_gallery_mode = "1",
	    lightbox_close_button = "1",
	    lightbox_close_button_position = "true",
	    lightbox_align = "false",
        main_header_width = $('.main-header').width(),
        $loader = $('.ss-preloader'),
        mobile_menu = false,
        tile_base_height,
        $tiles_container_width_ajax;

    function update_viewport_vars() {
        viewport_width = $(window).width();
        viewport_height = $(window).height();
    }
    var _update_viewport_vars = _.throttle(update_viewport_vars, 100);
    $window.resize(_update_viewport_vars);

    // Animation Vars
    var ss_animation_type = 'fade',
        ss_animation_speed = '0.6',
        ss_animation_out_type = 'fade',
        ss_animation_out_speed = '0.6';

    var
        //admin_ajax_url = ss_data.admin_ajax_url,
        //home_url = ss_data.home_url,
        //theme_directory_url = ss_data.theme_directory_url,
        animation_on_mobile_switch = 'true',
        //preloader_switch = ss_data.preloader_switch,
        preloader_base = 'images';


    /*---------------------------------------------------------------------------------*/
    /*	Preloader
	/*---------------------------------------------------------------------------------*/

    function reveal_content() {

        var $main_container = $('.main-container');

        if ($main_container.attr('data-animation-type')) ss_animation_type = $main_container.attr('data-animation-type');
        if ($main_container.attr('data-animation-speed')) ss_animation_speed = $main_container.attr('data-animation-speed');

        if ($main_container.hasClass('ss-animatable') && $main_container.not('.ss-has-children')) $main_container.css('opacity', '0');
        if ($main_container.hasClass('ss-animatable') && $main_container.hasClass('ss-has-children')) $main_container.children().css('opacity', '0');
        $main_container.find('.ss-animatable').filter(':not(.ss-has-children)').css('opacity', '0');
        $main_container.find('.ss-animatable').filter('.ss-has-children').children().css('opacity', '0');

        $('.ss-animatable').filter(':not(.ss-has-children)').bring({
            action: 'show',
            animation: ss_animation_type,
            speed: ss_animation_speed,
            animation_on_mobile: animation_on_mobile_switch,
        });

        var anim_index = 0,
        $anim_elements = $('.ss-animatable').filter('.ss-has-children').children(),
        anim_elements_size = $anim_elements.size();
        var interval = setInterval(function () {
            $anim_elements.eq(anim_index).bring({
                action: "show",
                animation: ss_animation_type,
                speed: ss_animation_speed,
                delay: "0",
                offset: 1,
                animation_on_mobile: animation_on_mobile_switch,
            });
            if (++anim_index > anim_elements_size) clearInterval(interval);
        }, 100);

    }

    if (preloader_base === 'images') {
        var body_imageLoader = imagesLoaded('body');
        body_imageLoader.on('always', function (instance) {
            reveal_content();
            $loader.hide();
        });
    } else {
        $window.load(function () {
            reveal_content();
            $loader.hide();
        });
    }


    /*------------------------------------------------------------------*/
    /* Home Slider
    /*------------------------------------------------------------------*/

    var home_slider_init = function () {

        if ($(".ss-home-slider").length > 0) {
            $(".ss-home-slider").height(viewport_height);
            $.waypoints('refresh');
            //_skrollr.refresh();
            var $home_rev_slider = $(".ss-home-slider");
            // When Images are loaded
            var imageLoader = imagesLoaded($home_rev_slider);
            imageLoader.on('always', function (instance) {
                $home_rev_slider.revolution({
                    delay: 5000,
                    onHoverStop: "off",
                    hideTimerBar: "on",
                    navigationType: "none",
                    fullWidth: "off",
                    fullScreen: "on",
                    fullScreenAlignForce: "on",
                })
            });
        }

    }

    home_slider_init();


    /*---------------------------------------------------------------------------------*/
    /*	sly
	/*---------------------------------------------------------------------------------*/

    var main_header_options = {
        scrollBy: 200,
        speed: 600,
        easing: 'easeOutQuart',
        scrollBar: '#main-header-scrollbar',
        dynamicHandle: 1,
        dragHandle: 1,
        clickBar: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        swingSpeed: 0.1,
        elasticBounds: 1,
        cycleBy: null,
        cycleInterval: 4000
    };
    var main_header_frame = new Sly('#main-header-frame', main_header_options);
    main_header_frame.init();

    if ($('.main-header-scrollbar').height() == $('.main-header-scrollbar .handle').height()) {
        $('.main-header-scrollbar').css('display', 'none');
    } else {
        $('.main-header-scrollbar').css('display', 'block');
    }

    var scroll_frame_resize = _.throttle(function () {

        main_header_frame.reload();
        $.waypoints('refresh');

        if ($('.main-header-scrollbar').height() === $('.main-header-scrollbar .handle').height()) {
            $('.main-header-scrollbar').css('display', 'none');
        } else {
            $('.main-header-scrollbar').css('display', 'block');
        }

    }, 100);
    $window.resize(scroll_frame_resize);

    // Hack : Enable Touch Draging on Sly since the native one doesn't work properly
    var hammertime = Hammer(main_header_frame.frame).on("dragup", function (ev) {
        ev.gesture.preventDefault();  // Prevent the browser from scrolling
    }).on("dragdown", function (ev) {
        ev.gesture.preventDefault();  // Prevent the browser from scrolling
    });


    /*---------------------------------------------------------------------------------*/
    /*  Tiles
	/*---------------------------------------------------------------------------------*/

    var ss_tiles_init = function () {

        //hidden filtering menu
        $('.tiles-filtering-container').css('display', 'none');

        $('.ss-tiles-container').each(function () {

            //show filtering menu
            $('.tiles-filtering-container').css('display', 'block');

            // Cache Selectors
            var $tiles_container = $(this),
                $tiles_inner = $tiles_container.find('.ss-tiles-inner-container'),
                $tiles_container_width = $tiles_container.find('.ss-tiles-inner-container').width();
            $tiles_container_width_ajax = $tiles_container_width;

            function update_tiles_container_width() {
                $tiles_container_width = $tiles_container.find('.ss-tiles-inner-container').width();
                $tiles_container_width_ajax = $tiles_container_width;
            }
            var _update_tiles_container_width = _.throttle(update_tiles_container_width, 100);
            $window.resize(_update_tiles_container_width);

            //sizing the width
            if (viewport_width > 992) {
                $tiles_container.width(viewport_width - main_header_width);
            } else {
                $tiles_container.width(viewport_width);//inner-wrapper padding
            }
            var tiles_container_resize = _.throttle(function () {
                if (viewport_width > 992) {
                    $tiles_container.width(viewport_width - main_header_width);
                } else {
                    $tiles_container.width(viewport_width);//inner-wrapper padding
                }
            }, 100);
            $window.resize(tiles_container_resize);



            // When Images are loaded
            var imageLoader = imagesLoaded($tiles_container);
            imageLoader.on('always', function (instance) {

                //sizing tiles
                //if ($('.ss-tiles-inner-container').hasClass('three-col')) {
                //    tile_base_height = Math.floor($tiles_container.width() / 3);//tiles height size for small one in 3 column
                //} else if ($('.ss-tiles-inner-container').hasClass('five-col')) {
                //    tile_base_height = Math.floor($tiles_container.width() / 5);//tiles height size for small one in 5 column
                //} else {
                //    tile_base_height = Math.floor($tiles_container.width() / 4);//tiles height size for small one in 4 column
                //}
                if (Modernizr.mq('(max-width: 380px)')) {//if media query max-width < 380
                    //calculate tile base height
                    if ($('.ss-tile.hover-size-1').length) {
                        tile_base_height = $('.ss-tile.hover-size-1').width();
                    } else if ($('.ss-tile.hover-size-2').length) {
                        tile_base_height = $('.ss-tile.hover-size-2').width();
                    } else if ($('.ss-tile.hover-size-3').length) {
                        tile_base_height = $('.ss-tile.hover-size-3').width();
                    } else if ($('.ss-tile.hover-size-4').length) {
                        tile_base_height = $('.ss-tile.hover-size-4').width();
                    } else if ($('.ss-tile.hover-size-5').length) {
                        tile_base_height = $('.ss-tile.hover-size-5').width();
                    }
                    //calculate each tiles height size
                    $('.ss-tile.hover-size-1').height(tile_base_height);
                    $('.ss-tile.hover-size-2').height(tile_base_height / 2);
                    $('.ss-tile.hover-size-3').height(tile_base_height * 2);
                    $('.ss-tile.hover-size-4').height(tile_base_height);
                    $('.ss-tile.hover-size-5').height(tile_base_height);
                } else {//if media query max-width > 380
                    //calculate tile base height
                    if ($('.ss-tile.hover-size-1').length) {
                        tile_base_height = $('.ss-tile.hover-size-1').width();
                    } else if ($('.ss-tile.hover-size-2').length) {
                        tile_base_height = Math.floor($('.ss-tile.hover-size-2').width() / 2);
                    } else if ($('.ss-tile.hover-size-3').length) {
                        tile_base_height = $('.ss-tile.hover-size-3').width();
                    } else if ($('.ss-tile.hover-size-4').length) {
                        tile_base_height = Math.floor($('.ss-tile.hover-size-4').width() / 2);
                    } else if ($('.ss-tile.hover-size-5').length) {
                        tile_base_height = Math.floor($('.ss-tile.hover-size-5').width() / 2);
                    }
                    //calculate each tiles height size
                    $('.ss-tile.hover-size-1').height(tile_base_height);
                    $('.ss-tile.hover-size-2').height(tile_base_height);
                    $('.ss-tile.hover-size-3').height(tile_base_height * 2);
                    $('.ss-tile.hover-size-4').height(tile_base_height * 2);
                    $('.ss-tile.hover-size-5').height(tile_base_height * 2);
                }




                var layout_base_resize = _.throttle(function () {
                    //if ($('.ss-tiles-inner-container').hasClass('three-col')) {
                    //    tile_base_height = Math.floor($tiles_container.width() / 3);//tiles height size for small one in 3 column
                    //} else if ($('.ss-tiles-inner-container').hasClass('five-col')) {
                    //    tile_base_height = Math.floor($tiles_container.width() / 5);//tiles height size for small one in 5 column
                    //} else {
                    //    tile_base_height = Math.floor($tiles_container.width() / 4);//tiles height size for small one in 4 column
                    //}

                    if (Modernizr.mq('(max-width: 380px)')) {//if media query max-width < 380
                        //calculate tile base height
                        if ($('.ss-tile.hover-size-1').length) {
                            tile_base_height = $('.ss-tile.hover-size-1').width();
                        } else if ($('.ss-tile.hover-size-2').length) {
                            tile_base_height = $('.ss-tile.hover-size-2').width();
                        } else if ($('.ss-tile.hover-size-3').length) {
                            tile_base_height = $('.ss-tile.hover-size-3').width();
                        } else if ($('.ss-tile.hover-size-4').length) {
                            tile_base_height = $('.ss-tile.hover-size-4').width();
                        } else if ($('.ss-tile.hover-size-5').length) {
                            tile_base_height = $('.ss-tile.hover-size-5').width();
                        }
                        //calculate each tiles height size
                        $('.ss-tile.hover-size-1').height(tile_base_height);
                        $('.ss-tile.hover-size-2').height(tile_base_height / 2);
                        $('.ss-tile.hover-size-3').height(tile_base_height * 2);
                        $('.ss-tile.hover-size-4').height(tile_base_height);
                        $('.ss-tile.hover-size-5').height(tile_base_height);
                    } else {//if media query max-width > 380
                        //calculate tile base height
                        if ($('.ss-tile.hover-size-1').length) {
                            tile_base_height = $('.ss-tile.hover-size-1').width();
                        } else if ($('.ss-tile.hover-size-2').length) {
                            tile_base_height = Math.floor($('.ss-tile.hover-size-2').width() / 2);
                        } else if ($('.ss-tile.hover-size-3').length) {
                            tile_base_height = $('.ss-tile.hover-size-3').width();
                        } else if ($('.ss-tile.hover-size-4').length) {
                            tile_base_height = Math.floor($('.ss-tile.hover-size-4').width() / 2);
                        } else if ($('.ss-tile.hover-size-5').length) {
                            tile_base_height = Math.floor($('.ss-tile.hover-size-5').width() / 2);
                        }
                        //calculate each tiles height size
                        $('.ss-tile.hover-size-1').height(tile_base_height);
                        $('.ss-tile.hover-size-2').height(tile_base_height);
                        $('.ss-tile.hover-size-3').height(tile_base_height * 2);
                        $('.ss-tile.hover-size-4').height(tile_base_height * 2);
                        $('.ss-tile.hover-size-5').height(tile_base_height * 2);
                    }

                    //boxed-mode top position
                    $tiles_inner.find('.ss-tile').each(function () {
                        if ($(this).hasClass('boxed-hover')) {
                            $(this).find('.ss-tile-caption-inner-content').css({
                                'margin-top': function () {
                                    return (($(this).height() / 2) * -1) + 'px';
                                }
                            });
                        }
                    });

                    $masonry_tiles_container.isotope({
                        // update columnWidth to a percentage of container width
                        masonry: { columnWidth: '.ss-tile-grid-sizer' }
                    });

                }, 100);
                $window.resize(layout_base_resize);

                //hover color size
                $tiles_inner.find('.ss-tile').each(function () {
                    //boxed-mode top position
                    if ($(this).hasClass('boxed-hover')) {
                        $(this).find('.ss-tile-caption-inner-content').css({
                            'margin-top': function () {
                                return (($(this).height() / 2) * -1) + 'px';
                            }
                        });
                    }



                    //color
                    var $hover_bg_color = $(this).find('.ss-tile-caption').attr('data-hover-bg-color');
                    var $hover_color = $(this).find('.ss-tile-caption').attr('data-hover-color');

                    $(this).find('.ss-tile-caption-inner').css('background-color', $hover_bg_color);
                    $(this).find('.ss-tile-hover-content-wrapper').css('color', $hover_color);
                    $(this).find('.hover-separator').css('background-color', $hover_color);
                    $(this).find('.ss-tile-hover-title').css('color', $hover_color);
                    $(this).find('a').css('color', $hover_color);
                    $(this).find('.ss-tile-caption-inner-content').css('border-color', $hover_color);
                });

                //init masonry
                if ($tiles_inner.length > 0) {
                    var $masonry_tiles_container = $tiles_inner.isotope({
                        resizable: false, // disable normal resizing
                        masonry: {
                            columnWidth: '.ss-tile-grid-sizer',
                            gutter: 0,
                            layoutMode: 'masonry'
                        }
                    });

                    // update columnWidth on window resize

                    $window.resize(layout_base_resize);

                    $('.ss-filter-tiles-button').click(function () {
                        var fillter_all = "";
                        $masonry_tiles_container.isotope({ filter: fillter_all });
                        var filterValue = $(this).attr('data-filter');
                        $(this).parent().parent().find('.active').removeClass('active');
                        $(this).addClass('active');
                        $masonry_tiles_container.isotope({ filter: filterValue });
                        $masonry_tiles_container.isotope('layout');
                        event.preventDefault();
                    });
                }

                //Init magnificPopup on Recent works
                $tiles_inner.magnificPopup({
                    type: 'inline',
                    delegate: 'a.item-format',
                    gallery: {
                        enabled: Boolean(parseInt(lightbox_gallery_mode, 10))
                    },
                    removalDelay: 600,
                    showCloseBtn: Boolean(parseInt(lightbox_close_button, 10)),
                    closeBtnInside: (lightbox_close_button_position == 'true'),
                    alignTop: (lightbox_align == 'true'),
                    mainClass: 'mfp-fade'
                });
            });
        });

    }

    ss_tiles_init();

    /*---------------------------------------------------------------------------------*/
    /*  Header
	/*---------------------------------------------------------------------------------*/

    var header_init = function () {

        var show_submenu = function ($submenu_toshow) {
            $submenu_toshow.addClass('open-sub-menu');
            $submenu_toshow.addClass('open-sub-menu').css('display', 'block');
            $submenu_toshow.children('li').addClass('showing-submenu-item');
            $submenu_toshow.parent().children('a').addClass('open-sub-menu');
        }

        if ($('.sub-menu').children('li').hasClass('current-menu-item')) {
            var $current_ul = $('.current-menu-item').parent();
            show_submenu($current_ul);
            var inner_child = true;
            while (inner_child) {
                if ($current_ul.parent().hasClass('menu-item-has-children')) {
                    $current_ul = $current_ul.parent().parent();
                    show_submenu($current_ul);
                } else {
                    inner_child = false;
                }
            }

        }
        main_header_frame.reload();

        var show_menu_mobile = function () {
            $('.main-navigation ul.sub-menu').each(function () {
                show_submenu($(this));
            });
            main_header_frame.reload();
        }

        if (viewport_width < 992) {
            show_menu_mobile();
        }


        var show_submenu_resize = _.throttle(function () {
            if (viewport_width > 992) {
                if ($('.ss-filter-tiles-button.active').attr('data-filter') == "" || !$('.ss-filter-tiles-button').hasClass('active')) {
                    $('.tiles-filtering > li.menu-item-has-children').find('.sub-menu.open-sub-menu').find('li').removeClass('showing-submenu-item');
                }
                setTimeout(function () {

                    $('.main-navigation-container').find('.sub-menu.open-sub-menu').each(function () {
                        if (!$(this).find('li').hasClass('current-menu-item')) {

                            $(this).removeClass('open-sub-menu');
                            $(this).parent().find('a').removeClass('open-sub-menu');
                            $(this).find('li').removeClass('showing-submenu-item');
                            main_header_frame.reload();
                            $(this).slideUp(400, function () {

                            });
                        }
                    });



                    //filter menu
                    if ($('.ss-filter-tiles-button.active').attr('data-filter') == "" || !$('.ss-filter-tiles-button').hasClass('active')) {
                        $('.tiles-filtering > li.menu-item-has-children').find('.sub-menu.open-sub-menu').slideUp(300, function () {
                            $(this).removeClass('open-sub-menu');
                            $('.tiles-filtering > li.menu-item-has-children > a').removeClass('open-sub-menu');
                            $(this).find('li').removeClass('showing-submenu-item');
                            main_header_frame.reload();
                        });
                    }
                }, 100);
            } else if (viewport_width < 992) {
                show_menu_mobile();
            }

        }, 100);
        $window.resize(show_submenu_resize);

        $('.header-menu').hover(
            function () {

            },
            function () {
                //$('.main-navigation-container').find('.sub-menu.open-sub-menu').find('li').removeClass('showing-submenu-item');
                if (viewport_width > 992) {
                    if ($('.ss-filter-tiles-button.active').attr('data-filter') == "" || !$('.ss-filter-tiles-button').hasClass('active')) {
                        $('.tiles-filtering > li.menu-item-has-children').find('.sub-menu.open-sub-menu').find('li').removeClass('showing-submenu-item');
                    }
                    setTimeout(function () {

                        $('.main-navigation-container').find('.sub-menu.open-sub-menu').each(function () {
                            if (!$(this).find('li').hasClass('current-menu-item')) {

                                $(this).removeClass('open-sub-menu');
                                $(this).parent().find('a').removeClass('open-sub-menu');
                                $(this).find('li').removeClass('showing-submenu-item');
                                main_header_frame.reload();
                                $(this).slideUp(400, function () {

                                });
                            }
                        });



                        //filter menu
                        if ($('.ss-filter-tiles-button.active').attr('data-filter') == "" || !$('.ss-filter-tiles-button').hasClass('active')) {
                            $('.tiles-filtering > li.menu-item-has-children').find('.sub-menu.open-sub-menu').slideUp(300, function () {
                                $(this).removeClass('open-sub-menu');
                                $('.tiles-filtering > li.menu-item-has-children > a').removeClass('open-sub-menu');
                                $(this).find('li').removeClass('showing-submenu-item');
                                main_header_frame.reload();
                            });
                        }
                    }, 100);
                }
                if (viewport_width < 992) {
                    show_menu_mobile();
                }
            });

        $('.main-navigation li.menu-item-has-children > a').hover(
            function () {
                if ($(this).parent().find('.sub-menu').hasClass('open-sub-menu')) {
                    return
                }
                $(this).delay(300).addClass('open-sub-menu');
                $(this).parent().children('.sub-menu').slideDown(300, function () {

                    main_header_frame.reload();
                });
                $(this).parent().children('.sub-menu').delay(300).addClass('open-sub-menu');
                $(this).parent().children('.sub-menu').find('li').each(function (i) {
                    var submenu_item = $(this);

                    setTimeout(function () {
                        if ($('.header-menu').is(':hover')) {
                            submenu_item.addClass('showing-submenu-item');
                        }
                    }, (i + 1) * 100);
                });


            },
            function () {

            });

        //action on menu item click 
        $('.main-navigation li > a').click(function () {

            var $current_li_clicked = $(this).parent();

            $('.sub-menu').children('li.current-menu-item').removeClass('current-menu-item');
            $('.main-navigation').find('li.current-menu-item').removeClass('current-menu-item');
            $('.main-navigation').find('li.current-menu-ancestor').removeClass('current-menu-ancestor');
            $(this).parent().addClass('current-menu-item');

            while ($current_li_clicked.parent().hasClass('sub-menu')) {
                $current_li_clicked.parent().parent().addClass('current-menu-ancestor');
                $current_li_clicked = $current_li_clicked.parent().parent();
            }

            if ($('.sub-menu').children('li').hasClass('current-menu-item')) {
                var $current_ul = $('.current-menu-item').parent();
                show_submenu($current_ul);
                var inner_child = true;
                while (inner_child) {
                    if ($current_ul.parent().hasClass('menu-item-has-children')) {
                        //$current_ul.parent().addClass('current-menu-ancestor');
                        $current_ul = $current_ul.parent().parent();
                        show_submenu($current_ul);

                    } else {
                        inner_child = false;
                    }
                }


            }
            main_header_frame.reload();

            //on mobile
            if (mobile_menu) {
                mobile_menu = false;
                $('#wrapper').removeClass('ss-mobile-menu-active');
                $('.main-header').removeClass('ss-mobile-menu-active-header');
                $('.mobile-header .logo').css('opacity', 1);
                show_menu_mobile();
            }
        });

        $('.header-widget a').click(function () {
            //on mobile
            if (mobile_menu) {
                mobile_menu = false;
                $('#wrapper').removeClass('ss-mobile-menu-active');
                $('.main-header').removeClass('ss-mobile-menu-active-header');
                $('.mobile-header .logo').css('opacity', 1);
                show_menu_mobile();
            }
        });

        //filtering click action block
        $('.tiles-filtering > li.menu-item-has-children > a').click(function (e) {
            e.preventDefault();
        });

        //filtering menu hover action
        $('.tiles-filtering > li.menu-item-has-children > a').hover(
            function () {
                if ($('.tiles-filtering > li.menu-item-has-children').find('.sub-menu').hasClass('open-sub-menu')) {
                    return
                }
                $('.tiles-filtering > li.menu-item-has-children > a').delay(300).addClass('open-sub-menu');
                $('.tiles-filtering > li.menu-item-has-children').find('.sub-menu').slideDown(300, function () {

                    main_header_frame.reload();
                });
                $(this).parent().find('.sub-menu').delay(300).addClass('open-sub-menu');
                $(this).parent().find('.sub-menu').find('li').each(function (i) {
                    var submenu_item = $(this);

                    setTimeout(function () {
                        if ($('.header-menu').is(':hover')) {
                            submenu_item.addClass('showing-submenu-item');
                        }
                    }, (i + 1) * 100);
                });
            },
            function () {

            });


        $('.header-social-container').hover(
            function () {
                $(this).find('.social-navigation-list-container').css('display', 'block');

                var delay = 0;

                $(this).parent().find('.social-navigation-list-container ul li').each(function (i) {
                    var social_icon = $(this);

                    setTimeout(function () {
                        if ($('.header-social-container').is(':hover')) {
                            social_icon.addClass('active-social-items');
                        }
                    }, (i + 1) * 100);

                });
                main_header_frame.reload();
            },
            function () {

                var delay = 0;
                $(this).parent().find('.social-navigation-list-container ul li').removeClass('active-social-items');

                setTimeout(function () {
                    $('.social-navigation-list-container').css('display', 'none');
                    main_header_frame.reload();
                }, 300);

            }
        );

    }

    header_init();




    /*---------------------------------------------------------------------------------*/
    /*  Logo
	/*---------------------------------------------------------------------------------*/

    if (!Modernizr.svg) {
        $('.logo img[src*="svg"]').attr('src', function () {
            return $(this).attr('src').replace('.svg', '.png');
        });
    }


    /*---------------------------------------------------------------------------------*/
    /*	Mobile Menu
	/*---------------------------------------------------------------------------------*/


    $('.ss-mobile-menu-button').click(function (e) {

        $('#wrapper').toggleClass('ss-mobile-menu-active');
        $('.main-header').toggleClass('ss-mobile-menu-active-header');

        if (mobile_menu) {
            mobile_menu = false;
            $('.mobile-header .logo').css('opacity', 1);
        } else {
            mobile_menu = true;
            $('.mobile-header .logo').css('opacity', 0);
        }
        e.stopPropagation();
        e.preventDefault();
    });

    $('#wrapper').click(function () {
        if (mobile_menu) {
            mobile_menu = false;
            $('#wrapper').removeClass('ss-mobile-menu-active');
            $('.main-header').removeClass('ss-mobile-menu-active-header');
            $('.mobile-header .logo').css('opacity', 1);

        }

    });

    $('.mobile-close-button').click(function () {
        if (mobile_menu) {
            mobile_menu = false;
            $('#wrapper').removeClass('ss-mobile-menu-active');
            $('.main-header').removeClass('ss-mobile-menu-active-header');
            $('.mobile-header .logo').css('opacity', 1);

        }

    });

    //$('.inner-wrapper').click(function () {
    //    if ($('.main-container').hasClass('has-sidebar') && !($('.sidebar').hasClass('close'))) {
    //        $('.sidebar').addClass('close');
    //        $('.inner-wrapper').removeClass('mobie-sidebar-open');
    //        $('.ss-mobile-menu.sidebar-toggle-button').removeClass('active-sidebar');
    //    }
    //});

    $window.resize(function () {
        if (viewport_width > 992) {
            $('#wrapper').removeClass('ss-mobile-menu-active');
            $('.main-header').removeClass('ss-mobile-menu-active-header');
            $('.mobile-header .logo').css('opacity', 1);
            mobile_menu = false;
        }
    });



    /*---------------------------------------------------------------------------------*/
    /*	Sticky Header
	/*---------------------------------------------------------------------------------*/

    var header_sticky_handler = function () {

        if (viewport_width > 992) {
            $('.main-container').css({
                'padding-top': 0
            });
            $('.sidebar').css({
                'top': 0
            });
        } else if (viewport_width < 992) {
            if ($('.mobile-header').hasClass('ss-sticky-mobile-header')) {
                $('.main-container').css({
                    'padding-top': function () {
                        return $('.mobile-header').outerHeight();
                    }
                });
            }

            $('.sidebar').css({
                'top': function () {
                    return $('.mobile-header').outerHeight();
                }
            });
        }

        var main_container_resize = _.throttle(function () {
            if (viewport_width > 992) {
                $('.main-container').css({
                    'padding-top': 0
                });
                $('.sidebar').css({
                    'top': 0
                });
            } else if (viewport_width < 992) {
                if ($('.mobile-header').hasClass('ss-sticky-mobile-header')) {
                    $('.main-container').css({
                        'padding-top': function () {
                            return $('.mobile-header').outerHeight();
                        }
                    });
                }
                $('.sidebar').css({
                    'top': function () {
                        return $('.mobile-header').outerHeight();
                    }
                });
            }

        }, 100);
        $window.resize(main_container_resize);

    }

    header_sticky_handler();

    /*---------------------------------------------------------------------------------*/
    /*	sidebar
	/*---------------------------------------------------------------------------------*/

    $('.ss-mobile-menu.sidebar-toggle-button').click(function () {
        $('.sidebar').toggleClass('close');
        if (!$('.sidebar').hasClass('close')) {
            $('.ss-mobile-menu.sidebar-toggle-button').addClass('active-sidebar');
        } else {
            $('.ss-mobile-menu.sidebar-toggle-button').removeClass('active-sidebar');
        }
        $('.inner-wrapper').toggleClass('mobie-sidebar-open');
        event.preventDefault();
    });

    var sidebar_init = function () {

        if ($('.main-container').hasClass('has-sidebar')) {
            $('.ss-mobile-menu.sidebar-toggle-button').css('display', 'block');
        } else {
            $('.ss-mobile-menu.sidebar-toggle-button').css('display', 'none');
        }

        $('.sidebar .sidebar-toggle-button').click(function () {
            $('.sidebar').toggleClass('close');
            if (!$('.sidebar').hasClass('close')) {
                $('.ss-mobile-menu.sidebar-toggle-button').addClass('active-sidebar');
            } else {
                $('.ss-mobile-menu.sidebar-toggle-button').removeClass('active-sidebar');
            }
            $('.inner-wrapper').toggleClass('mobie-sidebar-open');
            event.preventDefault();
        });

        // Closes sidebar on inner-wrapper click
        $('.inner-wrapper').click(function () {
            if ($('.main-container').hasClass('has-sidebar') && !($('.sidebar').hasClass('close'))) {
                $('.sidebar').addClass('close');
                $('.inner-wrapper').removeClass('mobie-sidebar-open');
                $('.ss-mobile-menu.sidebar-toggle-button').removeClass('active-sidebar');
            }
        });

        // Widget Portfolio
        $('.widget_latest_portfolio').imagesLoaded().always(function (instance) {
            // hover height for centering its content
            $('.widget_latest_portfolio').find('.portfolio-item-overlay').css('height', function () {
                return $('.widget_latest_portfolio ul li').find('.inner-container').height();
            });
            var _widget_latest_portfolio_update = _.throttle(function () {
                $('.widget_latest_portfolio').find('.portfolio-item-overlay').css('height', function () {
                    return $('.widget_latest_portfolio ul li').find('.inner-container').height();
                });
            }, 100);
            $window.resize(_widget_latest_portfolio_update);
        });

    }

    sidebar_init();


    /*---------------------------------------------------------------------------------*/
    /*	Init Blog Masonry
	/*---------------------------------------------------------------------------------*/

    var blog_masonry_init = function () {

        $('.blog-container').imagesLoaded().always(function (instance) {

            //sizing the width
            if (viewport_width > 992) {
                $('.page-container.masonry').width(viewport_width - main_header_width);
            } else {
                $('.page-container.masonry').width(viewport_width);//inner-wrapper padding
            }
            var blog_container_resize = _.throttle(function () {
                if (viewport_width > 992) {
                    $('.page-container.masonry').width(viewport_width - main_header_width);
                } else {
                    $('.page-container.masonry').width(viewport_width);//inner-wrapper padding
                }
            }, 100);
            $window.resize(blog_container_resize);

            $('.blog-item').each(function () {
                var $blog_item = $(this)
                // hover height for centering its content
                $blog_item.find('.blog-item-overlay').css('height', function () {
                    return $blog_item.find('.blog-item-fig').height();
                });
                var _blog_item_hover_update = _.throttle(function () {
                    $blog_item.find('.blog-item-overlay').css('height', function () {
                        return $blog_item.find('.blog-item-fig').height();
                    });
                }, 100);
                $window.resize(_blog_item_hover_update);
            });

        });

        var blog_container = document.querySelector('.blog-container.masonry');
        if (typeof (blog_container) != 'undefined' && blog_container != null) {
            var imageLoader = imagesLoaded(blog_container);
            imageLoader.on('always', function (instance) {
                var $blog_container_masonry = $(blog_container);
                $blog_container_masonry.isotope({
                    // options
                    itemSelector: '.blog-item',
                    layoutMode: 'masonry',
                    columnWidth: '.grid-sizer',
                });
                $blog_container_masonry.isotope('layout');
            });

        }

        //Init magnificPopup on Recent works
        $('.blog-container').magnificPopup({
            type: 'inline',
            delegate: 'a.item-format',
            gallery: {
                enabled: Boolean(parseInt(lightbox_gallery_mode, 10))
            },
            removalDelay: 600,
            showCloseBtn: Boolean(parseInt(lightbox_close_button, 10)),
            closeBtnInside: (lightbox_close_button_position == 'true'),
            alignTop: (lightbox_align == 'true'),
            mainClass: 'mfp-fade'
        });

    }

    blog_masonry_init();


    /*---------------------------------------------------------------------------------*/
    /*	Shortcodes
	/*---------------------------------------------------------------------------------*/

    var shortcodes_init = function () {

        /*------------------------------------------------------------------*/
        /* Fit Videos
        /*------------------------------------------------------------------*/

        $(".main-container").fitVids();


        /*---------------------------------------------------------------------------------*/
        /*	Royal Slider
        /*---------------------------------------------------------------------------------*/

        $(".royalSlider").royalSlider({
            loop: true,
            autoHeight: true,
            autoScaleSlider: true,
            imageScaleMode: 'fill',
            imageAlignCenter: false,
            slidesSpacing: 0,
            arrowsNav: true,
            controlNavigation: 'bullets',
            keyboardNavEnabled: true,
            arrowsNavAutoHide: true,
            sliderDrag: true,
            updateSliderSize: true,
            usePreloader: true,
        });


        /*------------------------------------------------------------------*/
        /*	Pie-Chart Initializing
        /*------------------------------------------------------------------*/

        $('.pie-chart').waypoint(function (direction) {
            var $span = $(this).children('span'),
            percent = $(this).attr('data-percent'),
            barColor = $(this).attr('data-bar-color'),
            trackColor = $(this).attr('data-track-color');

            $('.pie-chart').easyPieChart({
                barColor: barColor,
                trackColor: trackColor,
                scaleColor: "#ffffff",
                scaleLength: 0,
                lineCap: "round",
                lineWidth: 2,
                size: 180,
                rotate: 0,
                animate: 2000,
            });

            $({ countNum: 0 }).animate({ countNum: percent }, {
                duration: 2000,
                easing: 'linear',
                step: function () {
                    $span.text(Math.floor(this.countNum) + "%");
                }
            });
        }, { offset: "90%", triggerOnce: true });




        /*------------------------------------------------------------------
		    Alerts
	    ------------------------------------------------------------------*/

        $('.alert-message').click(function () {
            TweenLite.to($(this), 0.6, { css: { 'opacity': '0', scaleX: 1.1, scaleY: 1.1, 'display': 'none' }, delay: 0 });
        });


        /*------------------------------------------------------------------
            custome button color
        ------------------------------------------------------------------*/

        $('.ss-button.custom').each(function () {
            $(this).css({
                'border-color': function () {
                    return $(this).attr('data-button-color');
                },
                'color': function () {
                    return $(this).attr('data-button-color');
                }
            });
            $(this).hover(
                function () {
                    $(this).css({
                        'border-color': function () {
                            return $(this).attr('data-button-hover-color');
                        },
                        'color': function () {
                            return $(this).attr('data-button-hover-color');
                        }
                    });
                },
                function () {
                    $(this).css({
                        'border-color': function () {
                            return $(this).attr('data-button-color');
                        },
                        'color': function () {
                            return $(this).attr('data-button-color');
                        }
                    });
                });

        });


        /*---------------------------------------------------------------------------------*/
        /*	Accordion
        /*---------------------------------------------------------------------------------*/

        var accordion = $('.accordion-container');
        $('.accordion-container').tabs(
            ".accordion-container .accordion-item div.accordion-item-desc",
            {
                tabs: '.accordion-item div.accordion-item-header',
                effect: 'slide',
            }
          );
        $('.accordion-item div.accordion-item-header.current').find('.ss-accordion-arrow').removeClass('icon-arrow-down2').addClass('icon-arrow-up2');
        $('.accordion-item div.accordion-item-header').click(function () {
            $('.ss-accordion-arrow').each(function () {
                if ($(this).parent().parent().is('.current')) {
                    $(this).removeClass('icon-arrow-down2');
                    $(this).addClass('icon-arrow-up2');
                } else {
                    $(this).removeClass('icon-arrow-up2');
                    $(this).addClass('icon-arrow-down2');
                }
            });
        });



        /*---------------------------------------------------------------------------------*/
        /*	Toggle
        /*---------------------------------------------------------------------------------*/

        var toggle_header = $('.toggle-container .toggle-item .toggle-item-header');
        $(toggle_header).click(function () {
            if ($(this).hasClass('ui-toggle-header-active')) {
                $(this).removeClass('ui-toggle-header-active');
                $(this).find('.ss-toggle-arrow').removeClass('icon-arrow-up2');
                $(this).find('.ss-toggle-arrow').addClass('icon-arrow-down2');
            } else {
                $(this).addClass('ui-toggle-header-active');
                $(this).find('.ss-toggle-arrow').removeClass('icon-arrow-down2');
                $(this).find('.ss-toggle-arrow').addClass('icon-arrow-up2');
            }
            $(this).next().slideToggle();
            return false;
        }).next().hide();


        /*---------------------------------------------------------------------------------*/
        /*	Tabs
        /*---------------------------------------------------------------------------------*/

        $("div.tab-container").tabs(".tab-container div.tab-pane");


        /*---------------------------------------------------------------------------------*/
        /*	Google Map
        /*---------------------------------------------------------------------------------*/

        if ($('#map').length > 0) {
            $('.map-canvas-1').height($('.map-canvas-1').parent().height());
            var map_canvas_1_resize = _.throttle(function () {
                $('.map-canvas-1').css({
                    'max-height': function () {
                        return $('.map-canvas-1').parent().height()
                    }
                });
            }, 100);
            $window.resize(map_canvas_1_resize);

            //google.maps.event.addDomListener(window, 'load', map_init);
            map_init();
        }


        function map_init() {

            if ($('#map').length > 0) {
                "use strict";
                var $map = $('#map');
                var mapOptions = {
                    zoom: 15,
                    minZoom: 0,
                    center: new google.maps.LatLng($map.data('latitude'), $map.data('longitude')),
                    backgroundColor: '#c4cdcd',
                    scrollwheel: false,
                };
                var mapElement = document.getElementById('map');
                var map = new google.maps.Map(mapElement, mapOptions);

                var marker = new google.maps.Marker({
                    position: mapOptions['center'],
                    map: map,
                });
            }
        }


        /*---------------------------------------------------------------------------------*/
        /*  ss-social-item
        /*---------------------------------------------------------------------------------*/

        $('.ss-social-container').hover(


            function () {
                var $current_social = $(this);

                $(this).find('.social-navigation-list-container').css('display', 'block');

                var delay = 0;

                $(this).find('.social-navigation-list-container ul li').each(function (i) {
                    var social_icon = $(this);

                    setTimeout(function () {
                        if ($current_social.is(':hover')) {
                            social_icon.addClass('active-social-items');
                        }
                    }, (i + 1) * 100);
                });
            },
            function () {

                var $current_social = $(this);
                var delay = 0;
                $current_social.find('.social-navigation-list-container ul li').removeClass('active-social-items');

                setTimeout(function () {
                    $current_social.find('.social-navigation-list-container').css('display', 'none');
                }, 300);

            }
        );



    }


    shortcodes_init();


    /*---------------------------------------------------------------------------------*/
    /*	Header Background Pattern
	/*---------------------------------------------------------------------------------*/

    $('.main-header').css({
        'background-image': function () {
            if ($('.main-header').attr('data-background-pattern') !== 'undefind') {
                return 'url(' + $('.main-header').attr('data-background-pattern') + ')';
            }

        }
    });


    /*---------------------------------------------------------------------------------*/
    /*  Global Vars for AJAX
    /*---------------------------------------------------------------------------------*/

    var $portfolio_container = $('.ss-tiles-container'),
        $mosaics_container = $portfolio_container.children('.ss-tiles-inner-container'),
        $blog_container = $('.blog-container.masonry'),
        $portfolio_load_more_button = $('.tiles-load-more'),
        $blog_load_more_button = $('.blog-load-more'),
        load_more_button_text = '',
        mosaic_per_page = $portfolio_container.attr('data-per-page'),
        portfolio_categories_not = $portfolio_container.attr('data-categories-not'),
        blog_per_page = $blog_container.attr('data-per-page'),
        blog_categories_not = $blog_container.attr('data-categories-not'),
        done_text = 'Done',
        page_number = 1,
        loading = false,
        portfolio_options = '',
        blog_options = '',
        tiles_number_toload = $portfolio_container.find('.tiles-load-more').attr('data-tiles-number-toload'),
        blog_number_toload = $('.blog-load-more').attr('data-blog-number-toload'),
        start_index = 0,
        end_index = 0;

    var update_ajax_vars = function () {
        $portfolio_container = $('.ss-tiles-container'),
        $mosaics_container = $portfolio_container.children('.ss-tiles-inner-container'),
        $blog_container = $('.blog-container.masonry'),
        $portfolio_load_more_button = $('.tiles-load-more'),
        $blog_load_more_button = $('.blog-load-more'),
        load_more_button_text = '',
        mosaic_per_page = $portfolio_container.attr('data-per-page'),
        portfolio_categories_not = $portfolio_container.attr('data-categories-not'),
        blog_per_page = $blog_container.attr('data-per-page'),
        blog_categories_not = $blog_container.attr('data-categories-not'),
        done_text = 'Done',
        page_number = 0,
        loading = false,
        portfolio_options = '',
        blog_options = '';
    }


    /*---------------------------------------------------------------------------------*/
    /*  AJAX : Portfolio Mosaics
    /*---------------------------------------------------------------------------------*/

    var load_portfolio_mosaics = function () {

        $body.css('overflow', 'hidden');
        $body.css('overflow-y', 'scroll');


        var dataString = 'numPosts=' + tiles_number_toload + '&pageNumber=' + page_number + '&submitted=true&isAjax=1';
        $.ajax({
            type: "GET",
            data: dataString,
            dataType: "html",
            url: "testajax.html", //kinsey
            success: function (data) {

                var $data = $(data);

                //find all tiles to show
                var $tiles;

                start_index = (page_number - 1) * tiles_number_toload;
                end_index = +start_index + +tiles_number_toload;

                if ($data.find('.ss-tile').slice(start_index).length) {
                    $data.find('.ss-tile').slice(start_index, end_index).each(function (index) {

                        var $tile = $(this);

                        if (Modernizr.mq('(max-width: 380px)')) {//if media query max-width < 380
                            //sizing tiles
                            if ($tile.hasClass('hover-size-1') || $tile.hasClass('hover-size-4') || $tile.hasClass('hover-size-5')) {
                                $tile.height(tile_base_height);
                            } else if ($tile.hasClass('hover-size-2')) {
                                $tile.height(tile_base_height / 2);
                            } else if ($tile.hasClass('hover-size-3')) {
                                $tile.height(tile_base_height * 2);
                            }

                        } else {//if media query max-width > 380
                            //sizing tiles
                            if ($tile.hasClass('hover-size-1') ||
                                $tile.hasClass('hover-size-2')) {
                                $tile.height(tile_base_height);
                            } else if (
                                $tile.hasClass('hover-size-3') ||
                                $tile.hasClass('hover-size-4') ||
                                $tile.hasClass('hover-size-5')
                                ) {
                                $tile.height(tile_base_height * 2);
                            }

                        }

                        var ajax_tile_loading_resize = _.throttle(function () {

                            if (Modernizr.mq('(max-width: 380px)')) {//if media query max-width < 380
                                //sizing tiles
                                if ($tile.hasClass('hover-size-1') || $tile.hasClass('hover-size-4') || $tile.hasClass('hover-size-5')) {
                                    $tile.height(tile_base_height);
                                } else if ($tile.hasClass('hover-size-2')) {
                                    $tile.height(tile_base_height / 2);
                                } else if ($tile.hasClass('hover-size-3')) {
                                    $tile.height(tile_base_height * 2);
                                }

                            } else {//if media query max-width > 380
                                //sizing tiles
                                if ($tile.hasClass('hover-size-1') ||
                                    $tile.hasClass('hover-size-2')) {
                                    $tile.height(tile_base_height);
                                } else if (
                                    $tile.hasClass('hover-size-3') ||
                                    $tile.hasClass('hover-size-4') ||
                                    $tile.hasClass('hover-size-5')
                                    ) {
                                    $tile.height(tile_base_height * 2);
                                }

                            }

                        }, 100);
                        $window.resize(ajax_tile_loading_resize);

                        //coloring the tile
                        var $hover_bg_color = $tile.find('.ss-tile-caption').attr('data-hover-bg-color');
                        var $hover_color = $tile.find('.ss-tile-caption').attr('data-hover-color');

                        $tile.find('.ss-tile-caption-inner').css('background-color', $hover_bg_color);
                        $tile.find('.ss-tile-hover-content-wrapper').css('color', $hover_color);
                        $tile.find('.hover-separator').css('background-color', $hover_color);
                        $tile.find('.ss-tile-hover-title').css('color', $hover_color);
                        $tile.find('a').css('color', $hover_color);
                        $tile.find('.ss-tile-caption-inner-content').css('border-color', $hover_color);

                        //boxed-mode top position
                        if ($tile.hasClass('boxed-hover')) {
                            $tile.find('.ss-tile-caption-inner-content').css({
                                'margin-top': function () {
                                    return (($tile.height() / 2) * -1) + 'px';
                                }
                            });
                        }

                        // Get Isotope Instance
                        var iso = $mosaics_container.data('isotope');
                        $tile.hide().appendTo($mosaics_container);

                        var imageLoader = imagesLoaded($mosaics_container[0]);
                        imageLoader.on('always', function (instance) {
                            $mosaics_container.isotope('appended', $tile);
                            $mosaics_container.isotope('layout');
                            // var $children = $mosaics_container.children('.ss-ajax').css('opacity','0').show();
                            // $children.bring({
                            //     action: "show",
                            //     animation: "fade-from-right"
                            // });
                            $mosaics_container.children('.ss-ajax').removeClass('ss-ajax');
                            $portfolio_load_more_button.find('a').text(load_more_button_text);
                            $portfolio_load_more_button.find('a').removeClass('ss-loading');
                            loading = false;
                        });
                    });


                    djax_init();
                } else {
                    $portfolio_load_more_button.find('a').removeClass('ss-loading');
                    $portfolio_load_more_button.find('a').text(done_text);
                    setTimeout(function () {
                        $portfolio_load_more_button.bring({
                            action: "hide",
                            animation: "scale-down"
                        });
                    }, 2000);
                }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                $portfolio_load_more_button.text('Error! Check the console for more information.');
            }
        });
    }

    var load_portfolio_mosaics_init = function () {
        update_ajax_vars();
        // Init The Call On The Load Button
        $portfolio_load_more_button.children('a').click(function () {
            load_more_button_text = $(this).text();
            $(this).text('');
            $(this).addClass('ss-loading');
            loading = true;
            page_number++;

            // Prepare Data
            portfolio_options = {
                action: 'load_portfolio_mosaics',
                per_page: mosaic_per_page,
                page_number: page_number,
                categories_not: portfolio_categories_not,
            };

            load_portfolio_mosaics();
            return false;
        });
    }

    load_portfolio_mosaics_init();


    /*---------------------------------------------------------------------------------*/
    /*  AJAX : Blog Masonry
    /*---------------------------------------------------------------------------------*/

    var load_blog_masonry_items = function () {

        $body.css('overflow', 'hidden');
        $body.css('overflow-y', 'scroll');


        var dataString = 'numPosts=' + blog_number_toload + '&pageNumber=' + page_number + '&submitted=true&isAjax=1';
        $.ajax({
            type: "GET",
            data: dataString,
            dataType: "html",
            url: "testajaxblog.html", //kinsey
            success: function (data) {

                var $data = $(data);

                //find all tiles to show
                var $tiles;

                start_index = (page_number - 1) * blog_number_toload;
                end_index = +start_index + +blog_number_toload;

                if ($data.find('.blog-item').slice(start_index).length) {
                    $data.find('.blog-item').slice(start_index, end_index).each(function (index) {

                        var $blog_item = $(this);

                        // Get Isotope Instance
                        var iso = $mosaics_container.data('isotope');
                        $blog_item.hide().appendTo($blog_container);

                        var imageLoader = imagesLoaded($blog_container[0]);
                        imageLoader.on('always', function (instance) {
                            $blog_container.isotope('appended', $blog_item);
                            $blog_container.isotope('layout');
                            // var $children = $mosaics_container.children('.ss-ajax').css('opacity','0').show();
                            // $children.bring({
                            //     action: "show",
                            //     animation: "fade-from-right"
                            // });
                            $blog_container.children('.ss-ajax').removeClass('ss-ajax');
                            $blog_load_more_button.find('a').text(load_more_button_text);
                            $blog_load_more_button.find('a').removeClass('ss-loading');
                            loading = false;
                        });
                    });


                    djax_init();
                } else {
                    $blog_load_more_button.find('a').removeClass('ss-loading');
                    $blog_load_more_button.find('a').text(done_text);
                    setTimeout(function () {
                        $blog_load_more_button.bring({
                            action: "hide",
                            animation: "scale-down"
                        });
                    }, 2000);
                }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                $blog_load_more_button.text('Error! Check the console for more information.');
            }
        });
    }

    var load_blog_masonry_init = function () {
        update_ajax_vars();
        // Init The Call On The Load Button
        $blog_load_more_button.children('a').click(function () {
            load_more_button_text = $(this).text();
            $(this).text('');
            $(this).addClass('ss-loading');
            loading = true;
            page_number++;

            // Prepare Data
            portfolio_options = {
                action: 'load_portfolio_mosaics',
                per_page: mosaic_per_page,
                page_number: page_number,
                categories_not: portfolio_categories_not,
            };

            load_blog_masonry_items();
            return false;
        });
    }

    load_blog_masonry_init();

    /*---------------------------------------------------------------------------------*/
    /*  dJAX init
    /*---------------------------------------------------------------------------------*/

    // On animating content (animating)
    var djax_transition = function ($response) {

        $body.css('overflow', 'hidden');
        $body.css('overflow-y', 'scroll');

        // Get animation type
        if ($response.attr('data-animation-type')) ss_animation_type = $response.attr('data-animation-type');
        if ($response.attr('data-animation-speed')) ss_animation_speed = $response.attr('data-animation-speed');

        // Replace with new content
        var $target = this;  // reference to the DOM element that is about to be replaced
        var $ss_preloader = $('.ss-preloader-spin-ajax').clone(); // clone ajax preloader
        if ($response.hasClass('main-container')) $response.append($ss_preloader);
        $response.hide(); //hide new content
        $target.replaceWith($response); //replace the old content with new one
        $response.show(); // show the content
        if ($response.hasClass('ss-animatable') && $response.not('.ss-has-children')) $response.css('opacity', '0');
        if ($response.hasClass('ss-animatable') && $response.hasClass('ss-has-children')) $response.children().css('opacity', '0');
        $response.find('.ss-animatable').filter(':not(.ss-has-children)').css('opacity', '0');
        $response.find('.ss-animatable').filter('.ss-has-children').children().css('opacity', '0');
    }

    //initial djax
    var djax_init = function () {
        // Init
        $('body').djax('.ss-ajaxable', ['sitemap', 'wp-admin', 'wp-login', '#load-more', '#sidebar', '#menu', '#lightbox', '#tab', '#like', '#meta-comment-link', '#color', '#no-ajax', '#respond'], djax_transition);
    }
    djax_init();

    // Fix for updating head after djax
    window.includes = {
        script: {},
        css: {}
    };
    function includesRemember() {
        jQuery(document).find('script').each(function (index, element) {
            var src = $(element).attr('src');
            window.includes.script[src] = 1
        });
        jQuery(document).find('link[rel="stylesheet"]').each(function (index, element) {
            var href = $(element).attr('href');
            var media = $(element).attr('media');
            window.includes.css[href + '-' + media] = 1
        });
    }
    function includesUpdate(data) {
        var $revslider_style_tag = '';
        jQuery(data.response).filter('style').each(function () {
            if ($(this).prev('.ss-last-node').size() > 0) {
                $revslider_style_tag = $(this);
            }
        });
        $('.ss-last-node').after($revslider_style_tag);

        jQuery(data.response).filter('script').each(function (index, element) {
            var src = $(element).attr('src');
            if (!window.includes.script[src]) {
                includesAppendScript(src);
                window.includes.script[src] = 1
            }
        });
        jQuery(data.response).filter('link[rel="stylesheet"]').each(function (index, element) {
            var href = $(element).attr('href');
            var media = $(element).attr('media');
            if (!window.includes.css[href + '-' + media]) {
                includesAppendCss(href, media);
                window.includes.css[href + '-' + media] = 1
            }
        });
    }

    function includesAppendScript(filename) {
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    function includesAppendCss(filename, media) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("media", media)
        fileref.setAttribute("href", filename)
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
    includesRemember();


    // On link click (loading)
    $(window).bind('djaxClick', function (e, data) {


        if ($('.main-container').attr('data-animation-type')) ss_animation_out_type = $('.main-container').attr('data-animation-type');
        if ($('.main-container').attr('data-animation-out-speed')) ss_animation_out_speed = $('.main-container').attr('data-animation-out-speed');

        $('.ss-animatable').filter(':not(.ss-has-children)').bring({
            action: 'hide',
            animation: ss_animation_out_type,
            speed: ss_animation_out_speed,
            animation_on_mobile: animation_on_mobile_switch,
        });

        //if (
        //    $('.main-container').hasClass('main-container-template-blog-masonry.php') ||
        //    $('.main-container').hasClass('main-container-template-portfolio-mosaic-gallery.php') ||
        //    $('.main-container').hasClass('main-container-template-portfolio-mosaic-gallery-3col.php') ||
        //    $('.main-container').hasClass('main-container-template-portfolio-mosaic-gallery-4col.php')
        //) {
        //    ss_animation_out_speed = 0.4;
        //}

        var anim_index = 0,
        $anim_elements = $('.ss-animatable').filter('.ss-has-children').children(),
        anim_elements_size = $anim_elements.size();
        var interval = setInterval(function () {
            $anim_elements.eq(anim_index).bring({
                action: "hide",
                animation: ss_animation_out_type,
                speed: ss_animation_out_speed,
                delay: "0",
                offset: 1,
                animation_on_mobile: animation_on_mobile_switch,
            });
            if (++anim_index > anim_elements_size) clearInterval(interval);
        }, 50);

        var $ss_preloader = $('.ss-preloader-spin-ajax').clone();
        $ss_preloader.appendTo('.main-container').css('opacity', '0').show().bring({
            action: 'show',
            animation: 'scale-up',
            animation_on_mobile: animation_on_mobile_switch,
        });
        $('html,body').animate({ scrollTop: 0 }, 300);
        $body.css('overflow', 'hidden');

    });

    // On load (loaded)
    $(window).bind('djaxLoad', function (e, data) {

        includesUpdate(data);

        // Re Init all the nessecary JS after dJAX
        header_init();
        header_sticky_handler();
        sidebar_init();
        shortcodes_init();
        home_slider_init();


        var ajax_imageloader = imagesLoaded('body');
        ajax_imageloader.on('always', function (instance) {

            ss_tiles_init();
            blog_masonry_init();
            load_portfolio_mosaics_init();
            load_blog_masonry_init();

            setTimeout(function () {
                $('.main-container').children('.ss-preloader-spin-ajax').remove();

                $('.ss-animatable').filter(':not(.ss-has-children)').bring({
                    action: 'show',
                    animation: ss_animation_type,
                    speed: ss_animation_speed,
                    animation_on_mobile: animation_on_mobile_switch,
                });

                var anim_index = 0,
                $anim_elements = $('.ss-animatable').filter('.ss-has-children').children(),
                anim_elements_size = $anim_elements.size();
                var interval = setInterval(function () {
                    $anim_elements.eq(anim_index).bring({
                        action: "show",
                        animation: ss_animation_type,
                        speed: ss_animation_speed,
                        delay: "0",
                        offset: 1,
                        animation_on_mobile: animation_on_mobile_switch,
                    });
                    if (++anim_index > anim_elements_size) clearInterval(interval);
                }, 100);
            }, 500);

        });


    });

});
