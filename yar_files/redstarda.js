(function($) {
    //сделать doc.ready !!!!!!!!!!!!!!!!!!!!!!!!!!!
    $('.f-redstarda').each(function(){
        var redda_ob = this,
            redda_fillDef = "#4A4A4A",
            redda_obStar = $('.f-redstarda .starda').css("background","none").html('<svg height="33" width="35" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 33">' +
                '<path fill="'+redda_fillDef+'" fill-rule="evenodd" d="M 20.3 9.6 L 17.27 0.18 L 14.23 9.6 L 20.3 9.6" />' +
                '<path fill="'+redda_fillDef+'" fill-rule="evenodd" d="M 19.88 26.97 L 27.87 32.8 L 24.79 23.41 L 19.88 26.97" />' +
                '<path fill="'+redda_fillDef+'" fill-rule="evenodd" d="M 34.42 12.64 L 23.1 12.66 L 23.1 12.67 L 12.34 12.67 L 12.34 12.67 L 0.12 12.64 L 10.75 20.33 L 6.67 32.8 L 17.27 25.06 L 17.27 25.07 L 23.79 20.34 L 23.78 20.33 L 34.42 12.64 L 34.42 12.64 Z M 23.38 16.23 L 21.7 17.45 L 19.59 18.97 L 19.6 18.98 L 17.23 20.7 L 17.22 20.69 L 13.48 23.42 L 14.94 18.97 L 12.83 17.45 L 11.16 16.23 L 23.1 16.23 L 23.38 16.23 L 23.38 16.23 Z M 23.38 16.23" /></svg>'),
            reddaObStarPath = $(redda_obStar).find("path"),
            redda_distance = 100,
            redda_offsetLeft,
            redda_offsetTop,
            redda_outerWidth,
            redda_outerHeight,
            redda_borderLeft,
            redda_borderRight,
            redda_borderTop,
            redda_borderBottom,
            redda_centerCircleX,
            redda_centerCircleY,
            redda_distanceX,
            redda_distanceY,
            redda_class,
            redda_hovered = false;


        //$(window).bind('resize load', onResize);

        function onResize(){
            redda_offsetLeft = $(redda_ob).offset().left;
            redda_offsetTop = $(redda_ob).offset().top;
            redda_outerWidth = $(redda_ob).outerWidth();
            redda_outerHeight = $(redda_ob).outerHeight();
            redda_borderLeft = redda_offsetLeft - redda_distance;
            redda_borderRight = redda_offsetLeft + redda_outerWidth + redda_distance;
            redda_borderTop = redda_offsetTop - redda_distance;
            redda_borderBottom = redda_offsetTop + redda_outerHeight + redda_distance;
            redda_centerCircleX = redda_offsetLeft + (redda_outerWidth / 2);
            redda_centerCircleY = redda_offsetTop + (redda_outerHeight / 2);
        }
        onResize();
        $(document).mousemove(function( event ) {
            onResize();
            if(
                (event.pageX > redda_borderLeft && event.pageX < redda_borderRight)
                &&
                (event.pageY > redda_borderTop && event.pageY < redda_borderBottom)
            ) {
                redda_hovered = true;
                //info += "<br>inside!!!!!";
                //redda_distanceX = Math.ceil( ((event.pageX - redda_borderLeft)*100/redda_distance) / 10 );
                if(event.pageX >= redda_offsetLeft && event.pageX <= redda_offsetLeft + redda_outerWidth)
                    redda_distanceX = redda_distance;
                else if(event.pageX > redda_offsetLeft + redda_outerWidth){
                    redda_distanceX = Math.ceil( ((redda_borderRight - event.pageX)));
                }
                else
                    redda_distanceX = Math.ceil( ((event.pageX - redda_borderLeft)));

                if(event.pageY >= redda_offsetTop && event.pageY <= redda_offsetTop + redda_outerHeight)
                    redda_distanceY = redda_distance;
                else if(event.pageY > redda_offsetTop + redda_outerHeight){
                    redda_distanceY = Math.ceil( ((redda_borderBottom - event.pageY)));
                }
                else
                    redda_distanceY = Math.ceil( ((event.pageY - redda_borderTop)));

                //info += "<br>redda_distanceX: " + redda_distanceX;
                //info += "<br>redda_distanceY: " + redda_distanceY;

                if(redda_distanceX > redda_distanceY)
                    redda_class = redda_distanceY;
                else
                    redda_class = redda_distanceX;

                //info += "<br>calc distance: " + redda_class;
                redda_class = ( (redda_class) * 100 / redda_distance );
                //info += "<br>calc distance persent: " + redda_class;
                redda_class =  Math.ceil(redda_class /10);
                //info += "<br>redda_class: " + redda_class;

                $(redda_ob).removeClassWild("redstarda-gen-*").find("a").removeClassWild("redstarda-gen-*");
                $(redda_ob).addClass('redstarda-gen-'+redda_class).find("a").addClass('redstarda-gen-'+redda_class);
                //info += "<br>color: " + $(redda_ob).css("color");
                $(reddaObStarPath).attr("fill",$(redda_ob).css("color"));
            }
            else
            if(redda_hovered){
                $(redda_ob).removeClassWild("redstarda-gen-*").find("a").removeClassWild("redstarda-gen-*");
                $(reddaObStarPath).attr("fill", redda_fillDef);
                redda_hovered = false;
                //info += "<br>hoverred: " + redda_hovered;
            }

            //$('.info').html(info);
        });
        //$(document)
        //    .on('mouseenter','.f-redstarda a',function(){
        //        $(this).addClass("hover");
        //    })
        //    .on('mouseleave','.f-redstarda a',function(){
        //        $(this).removeClass("hover");
        //    });
    });
    //(function($) {
        $.fn.removeClassWild = function(mask) {
            return this.removeClass(function(index, cls) {
                var re = mask.replace(/\*/g, '\\S+');
                return (cls.match(new RegExp('\\b' + re + '', 'g')) || []).join(' ');
            });
        };
    //})(jQuery);

})(jQuery);

