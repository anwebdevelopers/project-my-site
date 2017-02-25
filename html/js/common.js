$(function() {

    'use strict';
    var windowsWidth = $(window).width(),
        windowsHeight = $(window).height(),
        $introduction = $('.introduction'),
        $menu = $('.menu'),
        $homepage = $('.home-page'),
        $page = $('.page'),
        $profilePage = $('#profile-page'),
        $servicesItem = $('.services__item'),
        $profilePageFacts = $profilePage.find('.facts'),
        $resumePage = $('#resume-page'),
        $skillItem = $('.skill__item'),
        $portfolioPage = $('#portfolio-page'),
        $portfolioPageFacts = $portfolioPage.find('.facts'),
        $contactPage = $('#contact-page');


    /*  ---------------------
         Homepage Responsive
        ---------------------  */


    function homepageResponsive() {

        // Homepage Main Portions Responsive
        windowsWidth = $(window).width(),
        windowsHeight = $(window).height();

        if (windowsWidth > windowsHeight) {
            $('.introduction , .menu').css({
                width: '50%',
                height: '100%'
            });
        } else {
            $('.introduction , .menu').css({
                width: '100%',
                height: '50%'
            });
        }
    }
    homepageResponsive();
    $(window).resize(function() {
        homepageResponsive();
    });

    /*  --------------
         Menu Settings
        --------------  */

    $('.menu__btn').on('click', function() {

        // Hide Menu
        var introWidth = $introduction.width(),
            menuWidth = $menu.width();

        $introduction.animate({
            left: '-' + introWidth
        }, 1000, 'easeOutQuart');
        $menu.animate({
            left: menuWidth
        }, 1000, 'easeOutQuart', function() {
            $homepage.css({
                visibility: 'hidden'
            });
        });

        // Show Reletive Page Onclick
        $page.eq($(this).index()).fadeIn(1200);
    });

    // Close Button, Hide Menu

    $('.close-btn').on('click', function() {
        $homepage.css({
            visibility: 'visible'
        });
        $('.introduction, .menu').animate({
            left: 0
        }, 1000, 'easeOutQuart');
        $page.fadeOut(800);
    });

    /*  --------------------------------
         Maximize Services Items Height
        --------------------------------  */

    $servicesItem.find("h3").equalHeight({
        responsive: true
    });
    $servicesItem.find("p").equalHeight({
        responsive: true
    });



    /*  -------------------------------
         MixItUp ( for portfolio page )
        -------------------------------  */

    // Initiate MixItUp

    $('#projects').mixItUp({
        callbacks: {
            onMixLoad: function(state) {
                $portfolioPage.hide();
            }
        }
    });



    /*  -------------------------------
         PopUp ( for portfolio page )
        -------------------------------  */

    $('.popup-with-move-anim').magnificPopup({
        type: 'inline',
        fixedContentPos: false,
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });

    /*  -----------------------------------------------------
         MixItUp ( for portfolio page : testimonials slider )
        -----------------------------------------------------  */

    $(".owl-carousel").owlCarousel({
        nav: true,
        loop: true,
        items: 1,
        autoHeight: true,
        navText: '',
    });


    /*  -------------
    //Валидация полей формы на странице заказа
    ------------- */

    var validator = $("#contactForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            mesage: {
                required: true
            },
        },
        messages: {
            name: {
                required: 'Поле "Имя" обязательно для заполнения.',
                minlength: 'Имя не может быть меньше двух символов.'
            },
            email: {
                required: 'Поле "E-mail" обязательно для заполнения.',
                email: 'Введите корректный адрес электронной почты.'
            },
            message: {
                required: 'Поле "Сообщение" обязательно для заполнения.'
            },
        }
    });

    /*  -------------
         Contact Form
        ------------- */

    //E-mail Ajax Send
    //Documentation & Example: https://github.com/agragregra/uniMail

    $("#contactForm").submit(function() { //Change
        var $this = $(this);
        if (validator.form() == true) {
            $.ajax({
                type: "POST",
                url: "mail.php", //Change
                data: $this.serialize()
            }).done(function() {
                $(".success").fadeIn(200);
                setTimeout(function() {
                    // Done Functions
                    $this.trigger("reset");
                    $(".success").fadeOut(200);

                }, 3000);
            });
        }
        return false;
    });


    /*  ------------------
        Прокрутка чисел
    ------------------  */

    function numAnimate(num, sim) {
        $(num).each(function() {
            var $num = $(this).text().replace(/[^-0-9]/gim, '');
            $(this).animate({
                num: $num
            }, {
                duration: 2000,
                step: function(num) {
                    $(this).text((num).toFixed(0) + sim);
                }
            });
        });
    }

    /*  ------------------
        Удаляю классы для проигрывания анимации
    ------------------  */
    $skillItem.removeClass('animated');
    $servicesItem.removeClass('animated');

    /*  ------------------
        Анимации появления элементов по событию Scroll
    ------------------  */

    $(window).scroll(function() {
        windowsWidth = $(window).width(),
            windowsHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        if ($profilePage.is(':visible')) {

            $servicesItem.each(function() {
                var $this = $(this);
                if ($this.hasClass('animated') == false) {
                    if (scrollTop > $this.position().top - windowsHeight) {
                        $this.addClass('animated');
                    }
                }
            });

            if (scrollTop > $profilePageFacts.offset().top - windowsHeight) {
                $profilePageFacts.find('.facts__number span').each(function() {
                    var $this = $(this);
                    if ($this.hasClass('animated') == false) {
                        numAnimate($this, '+');
                        $this.addClass('animated');
                    }
                });
            }
        } else if ($resumePage.is(':visible')) {
            $skillItem.each(function() {
                var $this = $(this);
                if ($this.hasClass('animated') == false) {
                    if (scrollTop > $this.position().top - windowsHeight) {
                        var $skillRangeInner = $this.find('.skill__range-inner');
                        var value = $skillRangeInner.find('span').text().replace(/[^-0-9]/gim, '');
                        $this.addClass('animated');
                        $skillRangeInner.css({
                            'right': (100 - value) + '%'
                        });
                        numAnimate($this.find('.skill__range-inner span'), '%');
                    }
                }
            });
        } else if ($portfolioPage.is(':visible')) {
            if (scrollTop > $portfolioPageFacts.offset().top - windowsHeight) {
                $portfolioPageFacts.find('.facts__number span').each(function() {
                    var $this = $(this);
                    if ($this.hasClass('animated') == false) {
                        numAnimate($this, '+');
                        $this.addClass('animated');
                    }
                });
            }
        }
    });


    /*  -------------------------------
         Yandex Map ( for contact page )
        -------------------------------  */

    ymaps.ready(function() {
        var myMap = new ymaps.Map('map', {
                center: [59.9342802, 30.3350986],
                zoom: 12,
                controls: ['zoomControl'],
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"]
            }, {
                searchControlProvider: 'yandex#search'
            }),
            myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                hintContent: '',
                balloonContent: ''
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: 'img/icon/map_marker.png',
                // Размеры метки.
                iconImageSize: [46, 46],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-23, -46]
            });

        function disableDrag() {
            var w = $(window).width();
            if (w < 768) {
                myMap.behaviors.disable('drag');
            } else {
                myMap.behaviors.enable('drag');
            }
        }
        disableDrag();
        $(window).resize(function() {
            disableDrag();
        });

        myMap.geoObjects.add(myPlacemark);
    });

    //-------------------------------------------------------------------------
    //Эффект в кнопке
    //--------------------------------------------------------------------------

    // $('.button')
    //    .on('mouseenter', function(e) {
    //        var $this = $(this),
    //            parentOffset = $this.offset(),
    //            relX = e.pageX - parentOffset.left,
    //            relY = e.pageY - parentOffset.top;
    //            $this.find('i').css({top:relY, left:relX})
    //    })
    //    .on('mouseout', function(e) {
    //        var $this = $(this),
    //            parentOffset = $this.offset(),
    //            relX = e.pageX - parentOffset.left,
    //            relY = e.pageY - parentOffset.top;
    //            $this.find('i').css({top:relY, left:relX})
    //    });

    /*  ------------------
        Chrome Smooth Scroll
    ------------------  */

    try {
        $.browserSelector();
        if ($("html").hasClass("chrome")) {
            $.smoothScroll();
        }
    } catch (err) {

    };

    $("img, a").on("dragstart", function(event) {
        event.preventDefault();
    });

    /*  ------------------
        Remove Preloader
    ------------------  */

    $('.introduction__logo').addClass('introduction__logo_anomation').delay(4000).queue(function() {
        $(this).removeClass('introduction__logo_anomation');
    });

    $('#preloader').delay(350).fadeOut('slow', function() {
        $profilePage.hide();
        $resumePage.hide();
        $contactPage.hide();
    });

    $('.project__item-img img, .project__popup-img img').each(function() {
        var $this = $(this);
        $this.attr('src', $this.data('src'));
    });

});
