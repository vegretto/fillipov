$(document).ready(function () {

    setTimeout(function () {
        const header = $('.header');
        const headerHeight = header.height();

        const checkHeader = () => {
            if ($(document).scrollTop() >= headerHeight) {
                header.addClass('fixed');
                $('body').css('padding-top', headerHeight);
            } else {
                header.removeClass('fixed');
                $('body').css('padding-top', 0);
            }
        }

        const checkVisible = () => {
            $('.ya-share2').each(function () {
                let shareIsVisible = false;
                if (!shareIsVisible && $(this).visible()) {
                    shareIsVisible = true;
                    loadScript('https://yastatic.net/share2/share.js', () => {
                    })
                }
            })
        }

        checkHeader();
        checkVisible();

        window.addEventListener('scroll', function () {
            checkHeader();
            checkVisible();
        }, {passive: true});

        document.querySelector('#modal-quick-view .modal__body').addEventListener('scroll', function () {
            checkVisible();
        }, {passive: true});

    }, 100)


    $('.js-close-promo').on('click', function () {
        $(this).parents('.top-promo').slideUp();
    });

    $('.js-mobile-search-toggle').on('click', function () {
        $('.header__mobile-search').slideDown();
    });

    $('.js-close-search').on('click', function () {
        $('.header__mobile-search').slideUp();
    });

    const renderStars = (element) => {
        const rating = element.attr('data-rating');
        let c = 0;
        element.find('.rating-stars__star').removeClass('filled').each(function () {
            if (c < Math.floor(rating)) {
                $(this).addClass('filled');
                c++;
            }
        })
    }

    $('.js-stars').each(function () {
        renderStars($(this));
    });

    $(document).on('click', '.js-open-picker', function () {
        $(this).parents('.product-preview').find('.color-size-picker').addClass('opened');
        if (screen.width < 768) {
            $(this).parents('.product-slider-redesign').addClass('arrows-hidden');
        }
    });

    $(document).on('click', '.js-add-to-cart', function (e) {
        e.preventDefault();
        const parent = $(this).parents('.product-preview');
        const cartBtn = parent.find('.product-preview__add-to-cart');

        $(this).parents('.color-size-picker').removeClass('opened');
        cartBtn.addClass('active');
        if (parent.hasClass('product-preview--accessory')) {
            cartBtn.text('В корзину')
        }
        if (screen.width < 768) {
            $(this).parents('.product-slider-redesign').removeClass('arrows-hidden');
        }
    });

    $(document).on('click', '.js-active-toggle', function () {
        $(this).toggleClass('active');
    });

    $(document).on('click', '.js-only-active-toggle', function () {
        $(this).parent().find('.js-only-active-toggle').removeClass('active')
        $(this).addClass('active');
    });

    $(document).on('click', '.js-product-card-cart', function (e) {
        e.preventDefault();
        $(this).addClass('active');
        $(this).find('span').text('Перейти в корзину');
    });

    // Sliders

    const productSliderRedesign = new Swiper('.js-product-slider-redesign', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,

        navigation: {
            nextEl: '.product-slider-redesign__arrow--next',
            prevEl: '.product-slider-redesign__arrow--prev',
        },

        breakpoints: {
            1199: {
                slidesPerView: 4,

            },
            991: {
                slidesPerView: 3,

            },
            600: {
                slidesPerView: 2,

            },
        }
    });

    const initProductCardSliders = (thumbsEl, mainEl) => {
        const productThumbsSlider = new Swiper(thumbsEl, {
            slidesPerView: 3,
            spaceBetween: 10,
            direction: "horizontal",
            watchSlidesProgress: true,
            observer: true,
            observeParents: true,

            navigation: {
                nextEl: '.product-card-main__arrow--next',
                prevEl: '.product-card-main__arrow--prev',
            },

            breakpoints: {
                767: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                    direction: "vertical",
                }
            }

        });

        const productMainSlider = new Swiper(mainEl, {
            slidesPerView: 1,
            thumbs: {
                swiper: productThumbsSlider,
            }
        });
    }

    $('.js-product-thumbs-slider').each(function () {
        initProductCardSliders(
            $(this)[0],
            $(this).parents('.product-card-main__gallery')
                .find('.js-product-main-slider')[0]
        )
    })

    $(document).on('click', '.js-quick-view', function () {
        openModal($('#modal-quick-view'), 'modal-bg');
        initProductCardSliders(
            $('#modal-quick-view .js-product-thumbs-slider-modal')[0],
            $('#modal-quick-view .js-product-main-slider-modal')[0])
    });

    $('.js-checkbox').on('click', function (e) {
        if (e.target.tagName.toLowerCase() !== 'a') {
            e.preventDefault()
            let isChecked = $(this).find('input[type="checkbox"]').prop('checked');
            $(this).toggleClass('checked').find('.custom-cb-badge, .custom-cb-badge-allow').toggleClass('checked');
            $(this).find('input[type="checkbox"]').prop('checked', !isChecked);
        }
    });

    /*--Overflow scroll glitch fix---*/

    let div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    document.body.append(div);
    const scrollWidth = div.offsetWidth - div.clientWidth;
    div.remove();

    const renderClickableBG = (isDark, elementToClose, id, renderParent = $('body'), blockScroll = true) => {
        renderParent.append(`<div class="clickable-bg" id=${id}></div>`);
        if (blockScroll) {
            $('body').css({
                'padding-right': scrollWidth,
                'overflow-y': 'hidden',
            });
            $('.header.fixed').css({
                'transition': 'none',
                'width' : `calc(100% - ${scrollWidth}px)`
            })
        }
        if (isDark) {
            $('.clickable-bg').addClass('clickable-bg--dark').fadeOut(1).fadeIn(400);
        }
        $(document).on('click', '.clickable-bg', function () {
            $(this).remove();
            if (elementToClose) {
                elementToClose.removeClass('opened');
                if (blockScroll) {
                    $('body').css({
                        'padding-right': 0,
                        'overflow-y': 'auto',
                    });
                    $('.header.fixed').css({
                        'width' : '100%',
                    })
                    setTimeout(function () {
                        $('.header.fixed').css({
                            'transition' : '.1s ease-in-out',
                        }, 200)
                    })
                }
            }
        })
    }

    // Modals

    const openModal = (modal, bgId) => {
        $('.modal').removeClass('opened');
        $(bgId).remove();
        modal.addClass('opened');
        renderClickableBG(true, modal, bgId, modal)
    }

    const closeModal = (modal, bg=null) => {
        modal.removeClass('opened');
        if (bg) {
            bg.remove();
        }
        $('body').css({
            'padding-right': 0,
            'overflow-y': 'auto',
        });
        $('.header.fixed').css({
            'width' : '100%',
        })
        setTimeout(function () {
            $('.header.fixed').css({
                'transition' : '.1s ease-in-out',
            }, 200)
        })
    }

    $(document).on('click', '.js-open-modal', function (e) {
        e.preventDefault();
        const modal = $($(this).attr('data-modal'));
        openModal(modal, 'modal-bg')
    });

    $(document).on('click', '.js-close-modal', function () {
        const modal = $(this).parents('.modal');
        const bg = $(this).parents('.modal').find('#modal-bg');
        closeModal(modal, bg);
    });

    $(document).on('click', '.js-mobile-menu-toggle', function () {
        const mobileMenu = $('.mobile-menu');
        if (!mobileMenu.hasClass('opened')) {
            mobileMenu.toggleClass('opened');
            renderClickableBG(true, mobileMenu, 'mobile-menu-bg', mobileMenu, true);
        } else {
            mobileMenu.removeClass('opened');
            $('#mobile-menu-bg').remove();
            $('body').css({
                'padding-right': 0,
                'overflow-y': 'auto',
            });
            $('.header.fixed').css({
                'width' : '100%',
            })
            setTimeout(function () {
                $('.header.fixed').css({
                    'transition' : '.1s ease-in-out',
                }, 200)
            })
        }
    });

    $(document).on('click', '.js-submenu-toggle', function (e) {
        e.preventDefault();

        if (!$(this).hasClass('active')) {
            $(this).addClass('active')
            $(this).parent().addClass('active').siblings('.js-submenu').slideDown().addClass('opened');
        } else {
            $(this).removeClass('active')
            $(this).parent().removeClass('active').siblings('.js-submenu').slideUp().removeClass('opened');
        }
    });

    $(document).on('click', '.js-category-mobile-toggle', function () {
        if (!$(this).hasClass('opened')) {
            $(this).siblings('.category-sidebar__category-items').slideDown();
            $(this).addClass('opened');
        } else {
            $(this).siblings('.category-sidebar__category-items').slideUp();
            $(this).removeClass('opened');
        }
    });

    $(document).on('click', '.js-catalog-menu-toggle', function () {
        const catalogMenu = $('.catalog-menu');
        if (!catalogMenu.hasClass('opened')) {
            catalogMenu.slideDown(150, function () {
                catalogMenu.removeAttr('style');
            });
            catalogMenu.addClass('opened');
            renderClickableBG (false, catalogMenu, 'catalog-menu-bg', catalogMenu, true);
        } else {
            catalogMenu.slideUp(150, function () {
                catalogMenu.removeClass('opened');
            });
            $('#catalog-menu-bg').remove();
            $('body').css({
                'padding-right': 0,
                'overflow-y': 'auto',
            });
            $('.header.fixed').css({
                'width' : '100%',
            })
            setTimeout(function () {
                $('.header.fixed').css({
                    'transition' : '.1s ease-in-out',
                }, 200)
            })
        }
    });

    $(document).on('mouseenter', '.js-catalog-submenu-toggle', function () {
        $('.catalog-menu__submenu-box.opened')
            .not($(this).find('.catalog-menu__submenu-box'))
            .not($(this).parents('.catalog-menu__submenu-box')).removeClass('opened');
        $(this).find('.catalog-menu__submenu-box').eq(0).addClass('opened');
    });

    $(document).on('mouseleave', '.js-catalog-submenu-toggle', function () {
        setTimeout( () => {
            if (!$(this).is(':hover') && $(this).find('.catalog-menu__submenu-box:hover').length === 0) {
                $(this).find('.catalog-menu__submenu-box').removeClass('opened');
            }
        }, 350);
    });

    $(document).on('mouseleave', '.catalog-menu__inner', function () {
        const catalogMenu = $('.catalog-menu');

        setTimeout(() => {
            if (!$(this).is(':hover')) {
                catalogMenu.slideUp(function () {
                    catalogMenu.removeClass('opened');
                });
                $('#catalog-menu-bg').remove();
                $('body').css({
                    'padding-right': 0,
                    'overflow-y': 'auto',
                });
                $('.header.fixed').css({
                    'width' : '100%',
                })
                setTimeout(function () {
                    $('.header.fixed').css({
                        'transition' : '.1s ease-in-out',
                    }, 200)
                })
            }
        }, 350)
    });

    if (screen.width < 1101) {
        $('.footer__nav-title').removeClass('active');
        $('.footer__nav-items').removeClass('opened');
    }

});