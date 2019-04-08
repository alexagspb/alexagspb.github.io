$(".logo__main_image_sub").fadeOut(0);
$(document).ready(function () {
    //$('.header__head').clone().addClass('header__head--clone').prependTo('.header');
    fixedMenu();
    $('[data-custom-scroll]').mCustomScrollbar({
        theme: "minimal-dark"
    });
    $('[data-toggle="tooltip"]').tooltip();
    initParallax();
    var $d = $('#date');
    var startDate = $d.attr('data-current');
    var dp = $d.datepicker({
        language: 'ru',
        startDate: startDate,
        //todayBtn: true,
        //date: '21.01.2017',
        //value: '25.01.2017',
        todayHighlight: true
    }).on('changeDate', function (e) {
        //if ($(this)[0].hasAttribute('data-open'))
        var d = e.date.getDate();
        if (d < 10) d = '0' + d;
        var m = (e.date.getMonth() + 1);
        if (m < 10) m = '0' + m;
        var date = d + '.' + m + '.' + e.date.getFullYear();
        $('[name="search[date]"]').val(date);

        var options = {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        };
        var text = e.date.toLocaleString("ru", options);
        var $p = $(this).parents('.search-block').eq(0);

        var tomorrow = new Date();
        if (e.date.getDate() == tomorrow.getDate() && e.date.getMonth() == tomorrow.getMonth() && e.date.getFullYear() == tomorrow.getFullYear()) {
            text = text.replace(/(.+?)(,)(.+?)/, 'сегодня, ')
		// text = text.replace(/(.+?)(,)(.+?)/, 'сегодня, \3 ')
        }
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (e.date.getDate() == tomorrow.getDate() && e.date.getMonth() == tomorrow.getMonth() && e.date.getFullYear() == tomorrow.getFullYear()) {
            text = text.replace(/(.+?)(,)(.+?)/, 'завтра, ')
        }

        $p.find('.search-block__value').text(text);
        slideToggle($(this));
        /*$(this).slideUp({
         start: function () {
         $p.find('.search-block__icon--reverse-y').removeClass('search-block__icon--reverse-y');
         }
         })*/
    });
    dp.datepicker("setDate", dp.attr('data-date'));
    var $sb = $('.search-block').not('.search-block--change');
    $sb.on('click', '.search-block__box', function (e) {
        console.log('search-block__box click');
        console.log($(this));
        var suggest = $(this).find('.search-block__suggest--visible').length;
        console.log(suggest);
        if (suggest)
            return;
        e.stopPropagation();
        e.preventDefault();
        var href = $(this).attr('href');
        var $t = $(href);
        slideToggle($t, $(this));

    });
    $sb.on('click', '.select__link', function (e) {
        e.preventDefault();
        var text = $(this).text();
        if ($(this).hasClass('select__link--disable')) return false;
        var parent = $(this).parents('.select').eq(0);
        var id = parent.attr('id');
        var $block = $('[href="#' + id + '"]');
        var val = $block.find('.search-block__value');
        val.text($(this).text());
        /*parent.stop().slideUp({
         start: slideStart($(this))
         });*/
        slideToggle(parent);
        parent.find('.select__link--active').removeClass('select__link--active');
        $(this).addClass('select__link--active');
        var cityId = $(this).attr('data-id');
        var nParent = $('.select').not(parent);
        var nEqual = nParent.find('[data-id="' + cityId + '"]');
        nParent.find('.select__link--disable').removeClass('select__link--disable');
        nEqual.addClass('select__link--disable');
        var name = parent.attr('id');
        $('[name="search[' + name + ']"]').val(cityId);
        $block.find('.search-block__default').remove();
        console.log(text);
        console.log($block);
        var $suggest = $block.find('.search-block__suggest');
        console.log($suggest);
        $suggest.removeClass('search-block__suggest--visible').val(text);
        /*var nSelect = nParent.find('.select__link--active');
         if (nSelect.attr('data-id')==cityId) {
         nSelect.removeClass('select__link--active');
         nParent.parents('.search-block').not('.search-block--date').find('.search-block__value').text('');
         }*/
    });
    var $sf = $('#search-form');
    $sf.on('click', '.search-block--change', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $from = $('[name="search[from]"]');
        var $to = $('[name="search[to]"]');
        var a = [$from.val(), $to.val()];
        $from.val(a[1]);
        $to.val(a[0]);
        var fromList = $('#from').find('.select__list');
        var toList = $('#to').find('.select__list');
        var fromListClone = fromList.clone();
        var toListClone = toList.clone();
        fromList.parent().html(toListClone);
        toList.parent().html(fromListClone);
        $sb = $('.search-block__box');
        var $fromLink = $sb.filter('[href="#from"]').find('.search-block__value');
        var $toLink = $sb.filter('[href="#to"]').find('.search-block__value');
        var toLinkText = $toLink.text();
        var fromLinkText = $fromLink.text();
        $fromLink.text(toLinkText);
        $toLink.text(fromLinkText);
    });
    $sf.on('submit', function (e) {
        e.preventDefault();
        var fromVal = $sf.find('[name="search[from]"]').val();
        var toVal = $sf.find('[name="search[to]"]').val();
        var toDate = $sf.find('[name="search[date]"]').val();
        if (!fromVal && !toVal) {
            e.preventDefault();
            openModal({
                title: 'Откуда едем?',
                body: 'Вы не указали место отправления'
            });
            return false;
        }
        if (!fromVal) {
            e.preventDefault();
            openModal({
                title: 'Откуда едем?',
                body: 'Вы не указали место отправления'
            });
            return false;
        }
        if (!toVal) {
            e.preventDefault();
            openModal({
                title: 'Куда едем?',
                body: 'Вы не указали место назначения'
            });
            return false;
        }
        var uri = '/' + fromVal + '/' + toVal + '/' + toDate + '/';
        history.pushState(null, '', uri);
        search_action(uri);
    });
    suggest();

    $('.table-striped').wrap("<div class='scroll-container'></div>");
    $(".table-striped").before("<a class='scroll'>(Показать/Скрыть)</a>");
    $('.table-striped').toggle();
    $(document).on('click',".scroll", function(){
    $(this).parent().find("table").slideToggle(500);});


    $('.minimize').wrap("<div class='minimize-container'></div>");
    $(".minimize").before("<a class='minimize-btn'>(Показать/Скрыть)</a>");
    $('.minimize').toggle();
    $(document).on('click',".minimize-btn", function(){
        $(this).parent().find(".minimize").slideToggle(500);});

});

function autoHeight(vis) {
    var length = vis.length;
    var select = vis.eq(0).parents('.select').eq(0);
    if (length <= 5) {
        select.addClass('select--auto-height');
    }
    else {
        select.removeClass('select--auto-height');
    }
}

function cursorAction(vis, keyCode){
    var l = vis.filter('.select__link--active').length;
    if (!l) {
        if (keyCode == 40) {
            vis.removeClass('select__link--active');
            vis.eq(0).addClass('select__link--active');
        }
    }
    else{
        console.log(vis);
        var act = vis.filter('.select__link--active');
        console.log(act);
        var p = act.parents('li').eq(0);
        console.log(p);
        var nextLi = p.next('li');
        console.log(nextLi);
        var nextLink = nextLi.find('.select__link');
        console.log(nextLink);
        vis.removeClass('select__link--active');
        nextLink.addClass('select__link--active');
    }
}

function get_matches($obj, keyCode) {
    var $p = $obj.parents('.search-block__box').eq(0);
    var href = $p.attr('href');
    var $t = $(href);
    var $links = $t.find('.select__link');
    var val = translate($obj.val().toLowerCase());
    var re = new RegExp(val, 'g');
    var keys = $('body').data('keys');
    var matched_sections = [];
    var vis = $links.not('.select__link--hide');
    $links.each(function (i, o) {

        var string = $(o).text().toLowerCase();
        var match = string.match(re);
        if (match) {
            matched_sections.push(i);
            $(o).removeClass('select__link--hide');
        }
        else {
            $(o).addClass('select__link--hide');
        }

    });

    //cursorAction(vis, keyCode);

    autoHeight(vis);
}

function replace(target, oldTerm, newTerm, caseSens, wordOnly) {

    var work = target;
    var ind = 0;
    var next = 0;

    if (!caseSens) {
        oldTerm = oldTerm.toLowerCase();
        work = target.toLowerCase();
    }

    while ((ind = work.indexOf(oldTerm, next)) >= 0) {
        if (wordOnly) {
            var before = ind - 1;
            var after = ind + oldTerm.length;
            if (!(space(work.charAt(before)) && space(work.charAt(after)))) {
                next = ind + oldTerm.length;
                continue;
            }
        }
        target = target.substring(0, ind) + newTerm +
            target.substring(ind + oldTerm.length, target.length);
        work = work.substring(0, ind) + newTerm +
            work.substring(ind + oldTerm.length, work.length);
        next = ind + newTerm.length;
        if (next >= work.length) {
            break;
        }
    }

    return target;

}
var lat = new Array("q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/");
var cyr = new Array("й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".");


function translate(tex) {
    var buf = tex;
    var i;

    for (i = 0; i < lat.length; i++) {
        if (tex.charCodeAt(0) < 128)
            buf = replace(buf, lat[i], cyr[i], 1, 0);
    }

    tex = buf;
    return tex;
}


function suggest() {
    $('.search-block__suggest').keyup(function (event) {
        get_matches($(this), event.keyCode);
    })
}

function closeSlide($t) {
    $t.stop().slideUp({
        start: function () {
            $t.removeAttr('data-open');
            reverseIcon($t, 'close');
        },
        complete: function () {

        }
    });

}

function closeSlides($slides, type) {

    $slides.each(function (i, o) {
        closeSlide($(o));
    });
}
function toggleSuggest($obj) {
    if ($obj === undefined)
        return true;
    var $suggest = $obj.find('.search-block__suggest');
    console.log($suggest);
    $suggest.toggleClass('search-block__suggest--visible').focus();
}
function slideToggle($t, $obj) {
    if ($t.length == 0)
        return false;
    toggleSuggest($obj);
    closeSlides($('[data-hide-mouseup]').not($t), 'other');
    if ($t[0].hasAttribute('data-open')) {
        closeSlide($t);
    }
    else {
        $t.stop().slideDown({
            start: function () {
                $(this).attr('data-open', true);
                reverseIcon($t, 'open');
            },
            complete: function () {

            }
        });
    }
}

function initParallax() {
    $('[data-parallax]').parallax("50%", 0.4);
}

function search_action(url) {
    $.post('/ajax/search.php', {data: url}, function (r) {
        $('#search-results').slideUp({
            duration: 800,
            start: function () {
                $(window).trigger('resize');
            },
            complete: function () {
                $(this).html(r).slideDown({
                    duration: 800,
                    start: function () {
                        $(window).trigger('resize');
                    },
                    step: function () {
                        $(window).trigger('resize');
                    },
                    progress: function () {
                        $(window).trigger('resize');
                    },
                    complete: function () {
                        $(window).trigger('resize');
                    }
                });
                //initParallax();
            }
        });
    })
}

function urldecode(str) {
    return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

window.addEventListener("popstate", function (e) {
    search_action(urldecode(window.location.href));
});

function reverseIcon($obj, action) {
    var $icon = $obj.parents('.search-block').eq(0).find('.search-block__icon.icon--down');
    if (action == 'open')
        $icon.addClass('search-block__icon--reverse-y');
    else
        $icon.removeClass('search-block__icon--reverse-y');
}

function openModal(params) {
    var $m = $('#modal');
    if (params['title'])
        $m.find('.modal-title').text(params['title']);
    if (params['body'])
        $m.find('.modal-body').text(params['body']);
    $m.modal({})
}

/*$(window).mouseup(function (e) {
 console.log(e.target);
 var container = $("[data-hide-mouseup]");
 /!*container.stop().slideUp({
 //complete: slideStop(container)
 });*!/
 });*/


$(document).mouseup(function (e) {
    var container = $("[data-hide-mouseup]");

    console.log($(e.target));
    if ($(e.target).hasClass('search-block__suggest--visible')) {
        console.log('запрешаем');
        return false;
    }
    if ($(e.target).hasClass('select__link--disable')) {
        return false;
    }
    $('.search-block__suggest--visible').removeClass('search-block__suggest--visible');
    console.log('продолжаем');
    if ($(e.target).closest('.search-block').length != 0)
        return false;
    if (!container.is(e.target)
        && container.has(e.target).length === 0) {
        closeSlides(container, 'all');
    }
});
$(window).scroll(function () {
    fixedMenu();
});


function fixedMenu() {
    if ($('#bx-panel').length == 0) {
        if ($(window).scrollTop() >= 80) {
            $('.header__head').addClass('header__head--fixed');
            $(".logo__main_image").fadeOut(10);
            $(".logo__main_image_sub").fadeIn(10);
        }
        else {
            $('.header__head').removeClass('header__head--fixed');
            $(".logo__main_image_sub").fadeOut(10);
            $(".logo__main_image").fadeIn(10);

        }
    }
}