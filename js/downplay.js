window.downplay = window.downplay || (function($) {
  'use strict';

  var downplay = {};

  // worst polyfill ever
  var localStorage = window.localStorage || {
    getItem: function(){},
    setItem: function(){}
  };

  var nano_opts = { alwaysVisible: true };
  var html_opts = { indent_size: 2 };
  var state = { html: false };

  var $input, $markdown, $output, $html, $preview;
  var init = false;

  var try_json = function(json) {
    try {
      var obj = JSON.parse(json);
      return obj;
    } catch(err) { return null; }
  };

  downplay.init = function() {
    if (init) { return; }

    // cached elements
    $input = $('#input');
    $markdown = $('#markdown');
    $output = $('#output');
    $html = $('#html');

    $preview = $('#preview');

    // CodeMirror
    downplay.cm = CodeMirror.fromTextArea($markdown[0], {
      lineWrapping: true
    });

    // cache
    downplay.load();
    downplay.cm.on('change', downplay.update);
    downplay.cm.on('cursorActivity', downplay.save);

    // controls
    $preview.on('click', function(e) {
      state.html = !state.html;
      downplay.update();
    });

    // nanoScroller
    downplay.nano();
    $(window).on('resize', downplay.nano);

    init = true;
  };

  downplay.state = function() {
    $preview.toggleClass('active', state.html);
    $html.toggleClass('gfm', !state.html);
    $html.toggleClass('pre', state.html);
  };

  /**
   * update Markdown output
   */
  downplay.update = function() {
    var markdown = downplay.cm.getValue();
    downplay.save();
    downplay.state();

    var html = marked(markdown);
    if (state.html) {
      html = _.escape(html_beautify(html, html_opts)).replace(/\n\r?/g, '<br>');
    }

    $html.html(html);
    downplay.nano();
  };

  /**
   * save state to local storage
   */
  downplay.save = _.debounce(function() {
    var markdown = downplay.cm.getValue();

    // cache markdown in local storage
    localStorage.setItem('cursor', JSON.stringify(downplay.cm.getCursor()));
    localStorage.setItem('markdown', markdown);
    localStorage.setItem('state', JSON.stringify(state));
  }, 0);

  /**
   * load state from local storage
   */
  downplay.load = function() {
    var markdown = localStorage.getItem('markdown');
    var cursor = try_json(localStorage.getItem('cursor'));
    var cache = try_json(localStorage.getItem('state'));

    if (markdown) { downplay.cm.setValue(markdown); }
    if (cursor) { downplay.cm.setCursor(cursor); }
    if (cache) {
      state = cache;
      downplay.state();
    }

    downplay.update();
  };

  /**
   * re(init) nanoScroller
   */
  downplay.nano = function() {
    setTimeout(function() {
      $output.nanoScroller(nano_opts).each(function() {
        // we gave the slider a 2px margin, so we must reduce its height
        var slider = this.nanoscroller.sliderHeight - 4;
        $(this).find('> .pane > .slider').height(slider);
      });
    }, 0)
  };

  $(downplay.init);

  return downplay;

})(jQuery);
