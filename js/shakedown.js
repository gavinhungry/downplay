(function($) {
  'use strict';

  $(function() {

    var init_nano = function() {
      setTimeout(function() {
        $('#input, #output').nanoScroller({
          alwaysVisible: true
        }).each(function() {
          // we gave the slider a 2px margin, so we must reduce its height
          var slider = this.nanoscroller.sliderHeight - 4;
          $(this).find('> .pane > .slider').height(slider);
        });
      }, 0)
    };

    CodeMirror.fromTextArea($('#markdown')[0], {
      lineWrapping: true
    }).on('change', function(cm) {
      var markdown = cm.getValue();
      $('#html').html(marked(markdown));
      init_nano();
    });

    init_nano();

    $(window).on('resize', init_nano);
  });

})(jQuery);
