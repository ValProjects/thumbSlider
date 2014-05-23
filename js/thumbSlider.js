;(function ( $, window, document, undefined ) {
    var pluginName = 'thumbSlider',
        defaults = {
            thumbPosition: 'bottom', // 'top', 'bottom', 'left', 'right'
            thumbCountLabel: '.thumb__count-label', // a selector for labes such as "15 image from 20"
            thumbCountLabelShow: true // true, false
        };
    // constructor
    function thumbSlider( element, options ) {
        debugger
        this.$slider = $(element);
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    };

    thumbSlider.prototype =  {
        init: function(){
            this.$thumbs = this.$slider.find('a');
            this.count = this.$thumbs.length;
            debugger
            this.setListeners(); // устанавливаем необходимые обработчики событий
            
            this.showThumbCountLabel();
            this.$slider.trigger('thumbSlider:ready', {count: this.count});

            //this.$element.trigger('thumbslider:loaded');
        },

        /*thumbs*/
        showThumbCountLabel: function(){
            var $label = $(this.options.thumbCountLabel);

            $label.append('Images: ' + this.count);
        },

        setListeners: function(){
            var _that = this;
            

            //$(document).on('thumbslider:loaded', this.$element,  $.proxy(_that, "sliderLoaded")); // тест api событие окончания загрузки слайдера


/*            $(document).on('click', '.slides-nav a',  $.proxy(_that, "thumbsSlideLeaf")); // назначаем слушателей события клика для навигации между слайдами с тумбочками
            $(document).on('click', '.iv-thumbs-wrapper .nav',  $.proxy(_that, "popupThumbsLeaf")); // назначаем слушателей события клика для навигации между тумбочками на попапе
            $(document).on('click', '.closePopup', $.proxy(_that, "popupHide")); // назначаем обработчик события клика по крестику на попапе, чтобы его закрыть
            $(document).on('click', '.overlay', $.proxy(_that, "popupHide")); // назначаем обработчик события клика по любому месту, кроме попапа, чтобы закрыть попап
            //$(document).on('keydown', $.proxy(_that, "popupHide")); // назначаем обработчик события нажатия клавиши клавиатуры, чтобы закрыть попап
            $(window).on('resize', $.proxy(_that, "popupImgAlign")); // назначаем обработчик события изменения размера экрана*/
        },

        popupShow: function(link){
            console.log('slider is loaded');
        },

        popupShow: function(link){
            var _that = this;
            $(link).on('click', function(){
                debugger
                _that.body.prepend('<div class="popup"><div class="popup-image-container"><span class="closePopup">X</span></div><div class="iv-thumbs-wrapper"><a href="#" class="nav prev" data-show-thumb="prev"></a><a href="#" class="nav next" data-show-thumb="next"></a><div class="iv-thumbs-overview"></div></div></div>');
                $('.iv-thumbs-overview').append(_that.thumbsList)
                _that.popup = $('.popup'); 
                _that.popupImageContainer = _that.popup.find('.popup-image-container');       
                _that.body.prepend(_that.overlayEl); // добавляем задний фон для попапа

                // дожидаемся полной загрузки изображения  
                var not_loaded = 1;
                $(new Image()).attr('src', _that.imageFirst).load(function() {
                    if (--not_loaded < 1) {
                        _that.popupImageContainer.css('backgroundImage', 'url("' + _that.imageFirst + '")');
                    }
                });

                // рассчитываем смещение по высоте нашего изображения и высчитываем новую высоту изображения в случае, если оно больше, чем область просмотра
                _that.popupImgAlign(); 
                $(document).on('click', '.iv-thumbs-overview a',  $.proxy(_that, "popupBigImageChange"));
                _that.popup.show();
                return false;
            });
        },      

        popupImgAlign: function (){
            if (this.popup !== undefined){
              this.winWidth = $(window).width();
              this.winHeight = $(window).height();
              if (this.winWidth > this.winHeight){
                (this.winHeight - 2*this.popupMargin) > 750 ? this.imgHeight = 750 : this.imgHeight = this.winHeight - 2*this.popupMargin; // считаем новую высоту, она не должна быть больше оригинальной
                this.imgWidth = this.imgHeight * this.ratio; // считаем новую ширину
              } else if (this.winWidth < this.winHeight){
                if (this.ratio > 1) {
                  (this.winWidth - 2*this.popupMargin) > 920 ? this.imgWidth = 920 : this.imgWidth = this.winWidth - 2*this.popupMargin; // считаем новую ширину, она не должна быть больше оринигинальной
                  this.imgHeight = this.imgWidth / this.ratio; // считаем новую высоту 
                } else {
                  (this.winHeight - 2*this.popupMargin) > 750 ? this.imgHeight = 750 : this.imgHeight = this.winHeight - 2*this.popupMargin; // считаем новую высоту, она не должна быть больше оригинальной
                  this.imgWidth = this.imgHeight * this.ratio; // считаем новую ширину       
                }  
              } else if (this.winWidth == this.winHeight) {
                if (this.ratio >= 1) {
                  (this.winWidth - 2*this.popupMargin) > this.imgWidthOrigin ? this.imgWidth = this.imgWidthOrigin : this.imgWidth = this.winWidth - 2*this.popupMargin; // считаем новую ширину, она не должна быть больше оринигинальной
                  this.imgHeight = this.imgWidth / this.ratio; // считаем новую высоту         
                } else if (this.ratio < 1) {
                  (this.winHeight - 2*this.popupMargin) > 750 ? this.imgHeight = 750 : this.imgHeight = this.winHeight - 2*this.popupMargin; // считаем новую высоту, она не должна быть больше оригинальной
                  this.imgWidth = this.imgHeight * this.ratio; // считаем новую ширину        
                }
              }

              // высчитываем отступы сверху и слева от края экрана до изображения
              this.horPopupPosition = (this.winWidth - this.imgWidth) / 2;
              this.verPopupPosition = (this.winHeight - this.imgHeight) / 2;

                // добавляем стили для указания размеров попапа
                $('.popup').css({
                    'width': this.imgWidth + 'px', 
                    'height': this.imgHeight + 'px', 
                    'position': 'fixed', 
                    'left': this.horPopupPosition + 'px', 
                    'top': this.verPopupPosition + 'px'
                });
                $('.popup-image-container').css({
                    'width': this.imgWidth + 'px', 
                    'height': this.imgHeight - 80 + 'px'
                });
                $('.iv-thumbs-overview .iv-thumbs').width(this.thumbWidth*this.thumbs.length);
            }
        },

        popupHide: function (el) {
            el.preventDefault();
            var _that = this;
            var hideHandler = function(){
                // el.which в IE8 и ниже содержит 0 вместо 1 для клика мыши, поэтому добавим такую проверку, 27 - код клавиши Escape
                if ((el.which == 1) || (el.which == 0) || (el.which == 27)) {
                    if (el.currentTarget != _that.popup) {
                        $('.overlay').remove();
                        _that.popup.remove();
                    }
                }  
            }
            $(el.currentTarget).on(el.type, hideHandler());
        },                  

        popupThumbChange: function (direction) {
            var _that = this;
            switch (direction) {
                case 'prev': this.thumbCurrent -= 1; break;
                case 'next': this.thumbCurrent += 1; break;
            }
            $('.iv-thumbs-overview .iv-thumbs').animate({
                left: -1 * this.thumbCurrent * this.thumbWidth
            }, 200, function() {
                //_that.thumbsDisabledNavigationLinkSet();
            });
        },

        popupThumbsLeaf: function(e){
            debugger
            var _that = this,
                link = $(e.currentTarget),
                direction = link.data('showThumb');

            e.preventDefault();
            if (!link.hasClass('disabled')) {
                this.popupThumbChange(direction);
            }
        },   

        popupBigImageChange: function(e){
            var _that = this;
            var link = $(e.currentTarget);
            var newImageSrc = link.attr('href');
            
            e.preventDefault();
            $('.popup-image-container').css('backgroundImage', 'url("'+newImageSrc+'")');
        },

        thumbsPrepareMarkup: function(){
            _that = this;
            this.thumbsCreate(); // создаем тумбочки для фотогрфий
            this.thumbsImagesCountLabelShow(); // показываем ссылку количество фотографий
            this.thumbsNavigationCreate(); //показываем стрелки навигации между слайдами c тумбочками, если слайдов больше, чем 1

            $('.thumb-big').css('backgroundImage', 'url("' + this.imageFirst + '")');
            $(document).on('click', '.thumb-slide a',  $.proxy(_that, "thumbsBigImageChange"));

            this.popupTrigger = $('body').find('.iv-show-popup');
            // назначаем слушателей события клика для открытия popup окна с просмотром больших изображений
            this.popupTrigger.each (function(){
                _that.popupShow(this);
            }); 
        },

        thumbsCreate: function (){
            this.imageViewerContainer.append('<div class="thumb-list"/>');
            $('.thumb-list').append('<div class="thumb-slide-overview"/>');
            for (var i = 1; i <= this.thumbs.length; i++){
                if ( (i%8 == 0) || (i == this.thumbs.length) ) {
                    this.thumbSlide += this.thumbs[i-1].outerHTML;
                    this.thumbSlidesWidth += this.thumbSlideWidth;
                    this.thumbSlideCount += 1;
                    $('.thumb-slide-overview').append('<div class="thumb-slide thumb-slide-' + this.thumbSlideCount + '"/>');
                    $('.thumb-slide-' + this.thumbSlideCount).append(this.thumbSlide);
                    this.thumbSlide = '';
                } else {
                    this.thumbSlide += this.thumbs[i-1].outerHTML;
                }
            }
            $('.thumb-slide-overview').css({
                'width': this.thumbSlidesWidth,
                'height': '352px',
                'overflow': 'hidden',
                'position': 'absolute'
            });
        },

        thumbsBigImageChange: function(e){
            var _that = this;
            var link = $(e.currentTarget);
            var newImageSrc = link.attr('href');
            
            e.preventDefault();
            $('.thumb-big').css('backgroundImage', 'url("'+newImageSrc+'")');
        },

        thumbsImagesCountLabelShow: function(){
            this.imageViewerContainer.append('<div class="thumb-list-footer"/>');
            $('.thumb-list-footer').append('<a href="#" class="iv-total dotted iv-show-popup">' + this.thumbsGetCorrectStr(this.thumbs.length) +'</a>');
        },

        thumbsNavigationCreate: function(){
            if (this.thumbSlideCount > 1) {
                $('.thumb-list-footer').append('<ul class="slides-nav"><li><a href="#" id="iv-prev-slide" data-show-slide="prev" class="prev disabled"><span></span></a></li><li><a href="#" id="iv-next-slide" data-show-slide="next" class="next"><span></span></a></li></ul>');
            }
        },

        thumbsGetCorrectStr: function (count) {
            var val = count % 100,
                str1 = 'фотография',
                str2 = 'фотографии',
                str3 = 'фотографий';
            
            if (val > 10 && val < 20) return count +' '+ str3;
            else {
                val = count % 10;
                if (val == 1) return count +' '+ str1;
                else if (val > 1 && val < 5) return count +' '+ str2;
                else return count + ' ' + str3;
            }
        },

        thumbsSlideChange: function (direction) {
            var _that = this;
            switch (direction) {
                case 'prev': this.thumbSlideCurrent -= 1; break;
                case 'next': this.thumbSlideCurrent += 1; break;
            }
            $('.thumb-slide-overview').animate({
                left: -1 * this.thumbSlideCurrent * this.thumbSlideWidth
            }, 200, function() {
                _that.thumbsDisabledNavigationLinkSet();
            });
        },

        thumbsDisabledNavigationLinkSet: function () {
            var nav = $('.slides-nav'),
                navLinks = nav.find('a'),
                nextLink = nav.find('.next'),
                prevLink = nav.find('.prev');
            
            navLinks.removeClass('disabled');

            if (this.thumbSlideCurrent == this.thumbSlideCount - 1) {
                nextLink.addClass('disabled');
            }
            
            if (this.thumbSlideCurrent == 0) {
                prevLink.addClass('disabled');
            }
        },

        thumbsSlideLeaf: function(e){
            var _that = this,
                link = $(e.currentTarget),
                direction = link.data('showSlide');

            e.preventDefault();
            if (!link.hasClass('disabled')) {
                this.thumbsSlideChange(direction);
            }
        }    
        
    };

    

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            debugger
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new thumbSlider( this, options ));
            }
        });
    }

})( jQuery, window, document );