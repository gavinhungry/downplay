(function($) {
  'use strict';

  var state = {
    html: false
  };

  // HTML indentation level
  var indent = 2;

  $(function() {
    var $input = $('#input');
    var $markdown = $('#markdown');
    var $output = $('#output');
    var $html = $('#html');

    // init a nanoScroller
    var nano = function() {
      setTimeout(function() {
        $output.nanoScroller({
          alwaysVisible: true
        }).each(function() {
          // we gave the slider a 2px margin, so we must reduce its height
          var slider = this.nanoscroller.sliderHeight - 4;
          $(this).find('> .pane > .slider').height(slider);
        });
      }, 0)
    };

    // CodeMirror
    var cm = CodeMirror.fromTextArea($markdown[0], {
      lineWrapping: true
    });

    // update output from Markdown
    var update = function() {
      var markdown = cm.getValue();

      var html = marked(markdown)
      if (state.html) {
        html = _.escape(html_beautify(html, {
          indent_size: indent
        })).replace(/\n/g, '<br>');
      }

      $html.html(html);
      nano();
    };

    cm.on('change', update);

    nano();
    $(window).on('resize', nano);

    // controls
    $('#preview').on('click', function(e) {
      state.html = !state.html;
      $(this).toggleClass('active', state.html);
      $html.toggleClass('gfm', !state.html);
      $html.toggleClass('pre', state.html);
      update();
    });

  });

})(jQuery);
