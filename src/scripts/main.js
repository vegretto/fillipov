$(document).ready(function () {

    const moveElement = (element, target, screenSize, append = true, after = false) => {
        if (screen.width < screenSize) {
            if (after) {
                for (let i = 0; i < $(element).length; i++) {
                    $(target).eq(i).after($(element).eq($(target).length === 1 ? 0 : i))
                }
            } else {
                if (append) {
                    for (let i = 0; i < $(element).length; i++) {
                        $(element).eq(i).appendTo($(target).eq($(target).length === 1 ? 0 : i))
                    }
                } else {
                    for (let i = 0; i < $(element).length; i++) {
                        $(element).eq(i).prependTo($(target).eq($(target).length === 1 ? 0 : i))
                    }
                }
            }
        }
    }

    moveElement('.testimonial .rating-box', '.testimonial__content-box--product', 991, false, true);
    moveElement('.testimonial__rm-additional-wrapper', '.testimonial .rating-box', 991, false, true);
    moveElement('.testimonial__answer-box', '.testimonial__rm-additional-wrapper', 991, false, true);
    moveElement('.product-card-main__name', '.product-card-main__inner', 991, false);
    moveElement('.modal__tags-wrapper', '.modal__rating-left', 991, false, true);
    moveElement('.modal .file-upload', '.modal__fields', 991, false, true);
    moveElement('.category-sidebar__categories', '.category-top__container', 991, false, false);

    function loadScript(url, callback) {
        var script = document.createElement("script");

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }



    setTimeout(function () {
        const header = $('.header');
        const headerHeight = header.height();
        const mobileCategoriesMenu = $('.category-sidebar__categories');
        let mobileCategoriesMenuY, mobileCategoriesMenuHeight, headerFixedHeight
        if (mobileCategoriesMenu.length > 0) {
            mobileCategoriesMenuY = mobileCategoriesMenu.offset().top;
            mobileCategoriesMenuHeight = mobileCategoriesMenu.innerHeight();
            header.addClass('fixed');
            headerFixedHeight = header.height();
            header.removeClass('fixed');
        }


        const checkHeader = () => {
            if ($(document).scrollTop() >= headerHeight) {
                header.addClass('fixed');
                $('body').css('padding-top', headerHeight);
            } else {
                header.removeClass('fixed');
                $('body').css('padding-top', 0);
            }
        }
        let shareIsVisible = false;
        const checkVisible = () => {
            $('.ya-share2').each(function () {
                console.log(shareIsVisible);
                if(!shareIsVisible && $(this).visible())  {
                    shareIsVisible = true;
                    loadScript('https://yastatic.net/share2/share.js', ()=>{})
                }
            })
        }

        $('.js-test').on('click', function () {
            let html = `<div id="modal-quick-view">
<div class="modal-body"></div>
</div>`


            console.log(123);
            $('body').append(html)
        })
        $(window).on('quickView', function () {
            console.log(222);
        })

        const checkMobileCategories = () => {
            if ($(window).scrollTop() > mobileCategoriesMenuY) {
                mobileCategoriesMenu.addClass('fixed');
                mobileCategoriesMenu.css('top', headerFixedHeight);
                mobileCategoriesMenu.parent().css('padding-top', mobileCategoriesMenuHeight);
            } else {
                mobileCategoriesMenu.removeClass('fixed').removeAttr('style');
                mobileCategoriesMenu.parent().removeAttr('style');
            }
        }

        checkHeader();
        checkVisible();
        if (screen.width < 992 && mobileCategoriesMenu.length > 0) {
            checkMobileCategories();
        }

        window.addEventListener('scroll', function () {
            checkHeader();
            checkVisible();
            if (screen.width < 992) {
                checkMobileCategories();
            }
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

    $(document).on('click', '.js-input-stars .rating-stars__star', function () {
        const parent = $(this).parent('.js-input-stars');
        parent.attr('data-rating', $(this).index() + 1);
        renderStars(parent)
    });

    $(document).on('click', '.js-close', function () {
        const parent = $(this).parent();
        parent.removeClass('opened');

        if (screen.width < 768) {
            if (parent.hasClass('color-size-picker')) {
                $(this).parents('.product-slider-redesign').removeClass('arrows-hidden');
            }
        }
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

    const shopRatingSlider = new Swiper('.js-shop-rating-slider', {
        slidesPerView: 1,
        spaceBetween: 0,
        observer: true,
        observeParents: true,

        navigation: {
            nextEl: '.shop-rating__arrow--next',
            prevEl: '.shop-rating__arrow--prev',
        },

        breakpoints: {
            1199: {
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
            loop: true,
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
            loop: true,
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

    function swipeScroll(element, item) {
        if (item !== null) {
            item.style.cursor = 'grab';
            let mouseMove = false;

            let pos = {top: 0, left: 0, x: 0, y: 0};

            const mouseDownHandler = function (e) {
                item.style.cursor = 'grabbing';
                item.style.userSelect = 'none';

                pos = {
                    left: item.scrollLeft,
                    top: item.scrollTop,
                    x: e.clientX,
                    y: e.clientY,
                };

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            };

            const mouseMoveHandler = function (e) {
                const dx = e.clientX - pos.x;
                const dy = e.clientY - pos.y;

                item.scrollTop = pos.top - dy;
                item.scrollLeft = pos.left - dx;
                mouseMove = true;
            };

            const mouseUpHandler = function (e) {
                item.style.cursor = 'grab';
                item.style.removeProperty('user-select');

                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };


            item.querySelectorAll(element + '> *').forEach(function (elem) {
                elem.addEventListener('click', function (e) {
                    if (mouseMove) {
                        e.preventDefault();
                    }
                    mouseMove = false;
                })

            });

            $(document).on("dragstart", element, function () {
                return false;
            });

            item.addEventListener('mousedown', mouseDownHandler);
        }
    }

    if (screen.width > 1199) {
        $('.js-swipe-scroll').each(function () {
            swipeScroll(`.${$(this).attr("class").split(/\s+/)[0]}`, $(this)[0]);
        })
        $('.js-swipe-scroll > *').attr('draggable', 'false');
        $('.js-swipe-scroll img').attr('draggable', 'false');
    }

    // Maps
    (function () {
        var mapContainer = document.querySelector('.our-works__map');

        if (!mapContainer) {
            return;
        }

        var spinner = mapContainer.querySelector('.loader');

        let mapsToLoad = [{
            id: 'works-map',
            isMultiPoint: true
        }]

        function init() {
            // Создание карт.
            function prepareMap(mapId, multiPoints = false) {

                let mapJsonPath = $('#' + mapId).attr('data-json')
                let myGeoObjects = [];
                let geoObjectsCentersSum = [0, 0];
                let mapCenterCoords = [0, 0];

                $.getJSON(mapJsonPath, function (data) {
                    data.map(function (geoObject) {
                        geoObjectsCentersSum[0] += geoObject.coords[0];
                        geoObjectsCentersSum[1] += geoObject.coords[1];

                        myGeoObjects
                            .push(new ymaps.Placemark(geoObject.coords, {
                                balloonContent: `<div class="our-works__bubble" data-id="${geoObject.id}">
                                                <div class="our-works__name">${geoObject.name}</div>
                                                <div class="our-works__date">${geoObject.date}</div>
                                                <a class="our-works__map-link" href="${geoObject.link}">Подробнее</a>
                                            </div>`
                            }, {
                                iconLayout: 'default#image',
                                iconImageHref: 'img/svg/marker.svg',
                            }))
                    })

                    //Считаем центр карты
                    if (multiPoints) {
                        mapCenterCoords[0] = +(geoObjectsCentersSum[0] / data.length).toFixed(4);
                        mapCenterCoords[1] = +(geoObjectsCentersSum[1] / data.length).toFixed(4);
                    } else {
                        mapCenterCoords = geoObjectsCentersSum;
                    }

                    function modalClose(modal) {
                        document.querySelector('body').classList.remove('scroll-hidden');
                        modal.remove()
                    }

                    function drawModal(data) {
                        var modal = document.querySelector('#works-map-template').content.querySelector('.works-modal').cloneNode(true);
                        var container = document.querySelector('.our-works__map');
                        var fragment = document.createDocumentFragment();

                        if (!modal) {
                            return;
                        }

                        var closeModalBtn = modal.querySelector('.works-modal__close');
                        var containerMedia = modal.querySelector('.our-project__img');
                        var mediaItem = containerMedia.querySelector('a');
                        var mediaItemPreview = mediaItem.querySelector('img');
                        var imageIcon = mediaItem.querySelector('.icon-photo-camera');
                        var videoIcon = mediaItem.querySelector('.icon-play-btn');
                        var count = mediaItem.querySelector('.our-project__img-num');

                        data.desc ? modal.querySelector('.our-project__desc').textContent = data.desc : '';
                        data.name ? modal.querySelector('.our-project__title').textContent = data.name : '';
                        data.date ? modal.querySelector('.our-project__date').textContent = data.date : '';
                        containerMedia.setAttribute('data-count', data.count);
                        mediaItem.href = data.images[0].link;
                        mediaItem.setAttribute('data-fancybox', 'works-map-' + data.id);
                        mediaItemPreview.alt = data.name;
                        mediaItemPreview.src = data.images[0].thumb;
                        count.textContent = data.count;

                        if (data.images[0].isVideo === true) {
                            imageIcon.remove();
                        } else {
                            videoIcon.remove();
                            mediaItem.removeAttribute('data-video-project');
                        }

                        for (var i = 1; i < data.images.length; i++) {
                            var item = mediaItem.cloneNode(true);
                            var preview = item.querySelector('img');

                            item.querySelector('.our-project__cover').remove();
                            item.href = data.images[i].link;
                            preview.src = data.images[i].thumb;
                            preview.style.display = 'none';
                            if (data.images[i].isVideo !== true) {
                                item.removeAttribute('data-video-project');
                            }

                            containerMedia.appendChild(item);
                        }

                        document.addEventListener('click', function (evt) {

                            if (evt.target.closest('.fancybox-stage') && !evt.target.closest('.fancybox-content')) {
                                modalClose(modal);
                            }
                            if (evt.target.closest('.works-modal') && !evt.target.closest('.works-modal__content')) {
                                modalClose(modal);
                            }
                        });

                        document.addEventListener('keydown', function (evt) {
                            if (evt.keyCode === 27) {
                                modalClose(modal);
                            }
                        });

                        containerMedia.addEventListener('click', function () {
                            function onBoxClickBtn() {
                                var boxCloseBtn = document.querySelector('.fancybox-button--close');
                                boxCloseBtn.addEventListener('click', function () {
                                    modalClose(modal);
                                });
                            }

                            setTimeout(onBoxClickBtn, 50);
                        });

                        closeModalBtn.addEventListener('click', function () {
                            var el = document.querySelector('.works-modal');
                            if (el !== null) {
                                modalClose(el);
                            }
                        });

                        modal.classList.add('active');

                        fragment.appendChild(modal);
                        container.appendChild(fragment);
                    }

                    document.addEventListener('click', function (evt) {
                        if (evt.target.closest('.our-works__map-link')) {
                            var content = document.querySelector('.our-works__bubble');
                            var container = content.parentElement.parentElement.parentElement;
                            var closeBtn = container.previousElementSibling;
                            var contentId = content.getAttribute('data-id');
                            var dataPin = data.find(item => item.id == contentId);
                            document.querySelector('body').classList.add('scroll-hidden');
                            evt.preventDefault();
                            closeBtn.click();
                            drawModal(dataPin);
                        }
                    });

                    var myMap = new ymaps.Map(mapId, {
                        center: mapCenterCoords,
                        zoom: 4,
                        controls: ['zoomControl'],
                    });

                    //Если будет много точек на карте, делаем кластерезацию
                    if (multiPoints) {


                        var myClusterer = new ymaps.Clusterer({
                            clusterIcons: [
                                {
                                    href: 'img/svg/marker.svg',
                                    size: [40, 40],
                                    offset: [-20, -20]
                                },
                                {
                                    href: 'img/svg/marker.svg',
                                    size: [50, 50],
                                    offset: [-30, -30]
                                }],
                            clusterNumbers: [10],
                            clusterIconContentLayout: null
                        });
                        myClusterer.add(myGeoObjects);
                        myMap.geoObjects.add(myClusterer);
                    }

                    //Если будет одна точка на карте, просто добавляем её
                    else {
                        myMap.geoObjects.add(myGeoObjects[0]);
                    }

                    myMap.behaviors.disable('scrollZoom');
                });
            }

            mapsToLoad.forEach(item => {
                if ($('#' + item.id).length > 0) {
                    prepareMap(item.id, item.isMultiPoint)
                }
            })

            mapContainer.querySelector('.placeholder').style.display = "none";

            if (spinner) {
                spinner.classList.remove('is-active');
            }
        }

        function mapLoad() {
            mapContainer.removeEventListener('mouseenter', mapLoad);
            const spinner = mapContainer.querySelector('.loader');
            if (spinner) {
                spinner.classList.add('is-active');
            }
            loadScript("https://api-maps.yandex.ru/2.1/?apikey=04709a29-6f21-442a-9cb5-272b39900456&lang=ru_RU", function () {
                ymaps.ready(init);
            });
        }

        mapContainer.addEventListener('mouseenter', mapLoad);
    })();


    $('.js-checkbox').on('click', function (e) {
        if (e.target.tagName.toLowerCase() !== 'a') {
            e.preventDefault()
            let isChecked = $(this).find('input[type="checkbox"]').prop('checked');
            $(this).toggleClass('checked').find('.custom-cb-badge, .custom-cb-badge-allow').toggleClass('checked');
            $(this).find('input[type="checkbox"]').prop('checked', !isChecked);
        }
    });

    const disableReadMore = (elements, height) => {
        if (elements.length > 0) {
            elements.each(function () {
                const parent = $(this).parents('.js-read-more-wrapper');
                if ($(this).height() < height) {
                    parent.css('height', 'auto');
                    parent.find('.js-read-more-toggle').hide();
                    parent.siblings('.js-read-more-toggle').hide();
                    parent.find('.read-more-bg').hide();
                }
            })

        }
    }

    disableReadMore($('.catalog-tags .js-read-more-container'), 70);
    disableReadMore($('.testimonial .js-read-more-container'), 240);

    let initialFoldedHeight;
    let initialText;

    $(document).on('click', '.js-read-more-toggle', function () {
        const parent = $(this).parent('.js-read-more-wrapper').length > 0 ?
            $(this).parent('.js-read-more-wrapper') :
            $(this).parent('.js-read-more-additional-wrapper').find('.js-read-more-wrapper');
        let initialHeight = parent.find('.js-read-more-container').height();

        if (!$(this).hasClass('opened')) {
            parent.addClass('opened')
            initialFoldedHeight = parent.height();
            initialText = $(this).text()
            parent.animate({
                height: initialHeight + (screen.width < 991 ? 30 : 0)
            }, 300);
            $(this).addClass('opened');
            $(this).text('Свернуть');
        } else {
            parent.removeClass('opened')
            parent.animate({
                height: initialFoldedHeight + (screen.width < 991 ? 30 : 0)
            }, 300);
            $(this).removeClass('opened');
            $(this).text(initialText);
        }
    });

    $('.js-subcategory-toggle').on('click', function () {
        const category = $(this).parent('.category-sidebar__category');
        const subcategories = category.siblings('.category-sidebar__subcategories');
        if (category.hasClass('opened')) {
            category.removeClass('opened');
            subcategories.slideUp(function () {
                subcategories.removeClass('opened');
            });
        } else {
            category.addClass('opened');
            subcategories.slideDown();
            subcategories.addClass('opened');
        }
    });

    // показываем скрываем списки с опциями
    $('.product-filters__item').on('click', '.product-filters__control', function (e) {
        if ($('.product-filters__clean').has(e.target).length) {
            clearFilter($(this).parent())
        } else {
            if (!$(this).parent().hasClass('is-active')) {
                $(this).parent().addClass('is-active');
                if ($(window).width() > 768) {
                    $(this).parent().siblings('.is-active').find('.product-filters__list').fadeOut();
                    $(this).parent().siblings('.is-active').removeClass('is-active');
                }
                submitFilter($(this).parent().siblings('.is-active'));
                $(this).parent().find('.product-filters__list').fadeIn();
            } else {
                submitFilter($(this).parent())
                $(this).parent().removeClass('is-active');
                $(this).parent().find('.product-filters__list').fadeOut();
            }
        }
    });
    // Сбрасываем все фильтры
    $('.product-filters').on('click', '.product-filters__clear-all', function () {
        $('.product-filters__item.is-choosen').each(function () {
            clearFilter($(this));
        });
        if ($(window).width() > 768) {
            $(this).remove()
        }
    });
// кнопка применить в мобильной версии
    $('.product-filters__mob-submit').on('click', function () {
        $('.product-filters').removeClass('is-active');
        document.body.style.overflow = 'visible';
        var container = $(".product-filters__item.is-active");
        submitFilter(container);
    });

// Выбираем параметры, считаем количество выбранных опций, добавляем кнопку очистки отдельного фильтра и всех фильтров
    function submitFilter(item) {
        const choosenOptions = item.find('input[type="checkbox"]:checked').length;
        if (!$('.product-filters__clear-all').length && choosenOptions && $(window).width() > 768) {
            $('.product-filters').append("<button type='button' class='product-filters__clear-all'>Сбросить</button>")
        }
        if (choosenOptions) {
            item.addClass('is-choosen');
            if (!item.find('.product-filters__choosen-num').length && !item.find('.product-filters__clean').length) {
                item.find('.product-filters__control')
                    .append('<span class="product-filters__choosen-num">(' + choosenOptions + ')</span>')
                    .append('<span class="product-filters__clean"><svg width="8" version="1.1" xmlns="http://www.w3.org/2000/svg" height="8" viewBox="0 0 64 64" >\n' +
                        '<path fill="#fff" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"/>\n' +
                        '</svg></span>');
            } else {
                item.find('.product-filters__choosen-num').html('(' + choosenOptions + ')');
            }
        } else {
            item.find('.product-filters__control').html(item.find('.product-filters__name').get(0));
            item.removeClass('is-choosen');
            if (!$('.product-filters').find('.is-choosen').length && $(window).width() > 768) {
                $('.product-filters__clear-all').remove();
                //applyFilter();
            }
        }
    }

    // Чистим отдельный фильтр
    function clearFilter(item) {
        item.find('.product-filters__control').html(item.find('.product-filters__name').get(0));
        item.find('input[type=checkbox]').prop('checked', false);
        item.removeClass('is-choosen');
    }

    // Закрываем по клику за пределами фильтра
    $(document).mouseup(function (e) {
        if ($(window).width() > 768) {
            var container = $(".product-filters__item.is-active");
            if (container.has(e.target).length === 0) {
                submitFilter(container)
                container.removeClass('is-active');
                container.find('.product-filters__list').fadeOut();
            }
        }
    });

    if ($(window).width() < 767) {
        $('.mobile-filters.mobile-filters--sort').append($('.js-sort'));
        $('.mobile-filters__categories').append($('.category-tags__list'));
        $('.mobile-filters__tags').append($('.js-tags-filter'));
        $(document).on('click', '.js-categories-toggle', function (e) {
            e.preventDefault();
            $(this).parent().find('.category-tags__list').slideToggle();
            $(this).parents('.mobile-filters__categories').toggleClass('is-active');
        });

        $(document).on('click', '.js-tabs-toggle', function (e) {
            e.preventDefault();
            var href = $(this).attr("href"),
                offsetTop = href === "#" ? 0 : $(href).offset().top;
            $('html, body').stop().animate({
                scrollTop: offsetTop
            }, 1000);
        });
        $(document).on('click', '.js-tags-toggle', function (e) {
            e.preventDefault();
            document.body.style.overflow = 'hidden';
            $('.product-filters').addClass('is-active');
            if (!$('.js-close-product-filters').length) {
                $('.product-filters').prepend('<button class="js-close-product-filters close-product-filters" type="button"><svg class="icon icon-cross"><use xlink:href="/img/svg/sprite.svg#cross"></use></svg></button>')

            }
        });

        $(document).on('click', '.js-close-product-filters', function (e) {
            document.body.style.overflow = 'visible';
            $('.product-filters').removeClass('is-active');
        });
    }

    $(document).on('click', '.js-answer-toggle', function () {
        $(this).siblings('.testimonial__answer').slideToggle();
    });

    const phones = document.querySelectorAll("input[type='tel']");

    phones.forEach(function (phone) {
        const phoneMask = IMask(phone, {
            mask: [
                {
                    mask: '{#} (000) 000-00-00',
                    definitions: {
                        '#': /[8]/
                    }
                },
                {
                    mask: '{+#} (000) 000-00-00',
                    definitions: {
                        '#': /[+7]/
                    }
                },
                {
                    mask: '{+###} (000) 000-00-00',
                    definitions: {
                        '#': /[+35780]/
                    }
                },
                {
                    mask: '+{#}0000000000000',
                    definitions: {
                        '#': /[1245690]/
                    }
                },
            ]
        });
    });

    $('.js-scroll-to').on('click', function (e) {
        e.preventDefault();
        const elementToScroll = $($(this).attr('href'));
        let headerPadding = 147;
        if (screen.width < 991 && screen.width > 600) {
            headerPadding = 124;
        } else if (screen.width < 600) {
            headerPadding = 105;
        }
        console.log(headerPadding);

        if (elementToScroll.hasClass('accordion-section')) {
            elementToScroll.find('.js-accordion-toggle').addClass('active');
            elementToScroll.find('.js-accordion-content').addClass('opened');
        }

        $([document.documentElement, document.body]).scrollTop( elementToScroll.offset().top - headerPadding)

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

    $(document).on('click', '.js-open-popup', function () {
        $('.js-open-popup').removeClass('opened');
        let popup = $(this).parent().find('.js-popup');
        popup.toggleClass('opened');
        renderClickableBG(false, popup, 'popup-bg', $('body'), false);
    });

    $(document).on('click', '.js-custom-select .custom-select-option', function () {
        const optionValue = $(this).attr('data-value');
        const optionsText = $(this).text();
        const customSelect = $(this).parents('.js-custom-select');
        customSelect.find('.custom-select__value').text(optionsText);
        setTimeout(function () {
            $('.clickable-bg').remove();
        }, 50);
        customSelect.find('option').each(function () {
            if ($(this).attr('value') === optionValue) {
                customSelect.find('select').val($(this).attr('value')).change();
            }
        })
    });

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

    // Accordion
    $(document).on('click', '.js-accordion-toggle', function () {
        $(this).toggleClass('active');
        $(this).next('.js-accordion-content').slideToggle(300, function () {
            $(this).toggleClass('opened');
        });
    });

    const options = {
        data: ["Москва", "Пятигорск", "Ростов", "Краснодар", "Якутск"],
    };

    $("#tes3").easyAutocomplete(options);

    $(document).on('change', '.js-file-upload', function () {
        $(this).siblings('.file-upload__upload-text').text('Файлы загружены')
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
})


