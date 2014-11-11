window.downplay = window.downplay || (function($) {
  'use strict';

  var downplay = {};

  // worst polyfill ever
  var localStorage = window.localStorage || {
    getItem: function(){},
    setItem: function(){},
    removeItem: function(){}
  };

  var html_opts = { indent_size: 2 };

  var _markdown = '';
  var current_topic;
  var opts = {
    html: false,
    scroll: false,
    autosave: false
  };

  var $input, $markdown, $output, $contents, $toggles, $topics;
  var init = false;

  var get_cache = {};
  var cached_get = function(uri) {
    if (!uri) { return ''; }
    return get_cache[uri] || $.get(uri).done(function(data) {
      get_cache[uri] = data;
    });
  };

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
    $contents = $('#contents');

    $toggles = $('.toggle');
    $topics = $('.topic');

    // CodeMirror
    downplay.cm = CodeMirror.fromTextArea($markdown[0], {
      mode: 'gfm',
      theme: 'downplay',
      lineWrapping: true,
      tabSize: 2,
      extraKeys: {
        Tab: function(cm) {
          var spaces = Array(cm.getOption('tabSize') + 1).join(' ');
          cm.replaceSelection(spaces, 'end');
        }
      }
    });

    // cache
    downplay.load();
    downplay.cm.on('change', downplay.update);
    downplay.cm.on('cursorActivity', downplay.save);

    downplay.controls();
    downplay.topics();

    init = true;
  };

  /**
   *
   */
  downplay.controls = function() {
    $toggles.on('click', function(e) {
      var toggle = $(this).attr('id');
      opts[toggle] = !opts[toggle];
      downplay.update();
    });
  };

  /**
   *
   */
  downplay.topics = function() {
    $topics.on('click', function() {
      var topic = $(this).attr('id');
      current_topic = (topic === current_topic) ? null : topic;

      $topics.not(this).removeClass('active');
      $(this).toggleClass('active', topic === current_topic);

      if (current_topic) {
        var file = $(this).attr('data-md-file');
        var md_m = cached_get(file);
        $.when(md_m).done(function(markdown) {
          downplay.cm.setOption('readOnly', true);
          downplay.cm.setValue(markdown);
        });
      } else {
        downplay.cm.setOption('readOnly', false);
        downplay.cm.setValue(_markdown);
      }
    });
  };

  /**
   *
   */
  downplay.opts = function() {
    $toggles.each(function() {
      var toggle = $(this).attr('id');
      $(this).toggleClass('active', opts[toggle]);
    });

    $contents.toggleClass('gfm', !opts.html);
    $contents.toggleClass('pre', opts.html);
  };

  /**
   * update Markdown output
   */
  downplay.update = function() {
    var markdown = downplay.cm.getValue();
    downplay.save();
    downplay.opts();

    var html = marked(markdown);
    if (opts.html) {
      html = _.escape(html_beautify(html, html_opts)).replace(/\n\r?/g, '<br>');
    }

    $contents.html(html);

    if (opts.scroll) {
      $output.scrollTop($contents.height());
    }
  };

  /**
   * save opts to local storage
   */
  downplay.save = _.debounce(function() {
    var markdown = downplay.cm.getValue();

    // cache markdown in local storage
    if (!downplay.cm.getOption('readOnly')) {
      _markdown = markdown;

      if (opts.autosave) {
        localStorage.setItem('cursor', JSON.stringify(downplay.cm.getCursor()));
        localStorage.setItem('markdown', _markdown);
      }
    }

    if (!opts.autosave) {
      localStorage.removeItem('cursor');
      localStorage.removeItem('markdown');
    }

    localStorage.setItem('opts', JSON.stringify(opts));
  }, 0);

  /**
   * load opts from local storage
   */
  downplay.load = function() {
    _markdown = localStorage.getItem('markdown');
    var cursor = try_json(localStorage.getItem('cursor'));
    var cache = try_json(localStorage.getItem('opts'));

    if (_markdown) { downplay.cm.setValue(_markdown); }
    if (cursor) { downplay.cm.setCursor(cursor); }
    if (cache) {
      opts = cache;
      downplay.opts();
    }

    downplay.update();
  };

  $(downplay.init);

  return downplay;

})(jQuery);
