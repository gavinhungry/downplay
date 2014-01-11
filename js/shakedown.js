(function() {
  'use strict';

  // nanoScroller.js options
  var nano_options = { alwaysVisible: true };

  // Add Handlebars helper for formatting GFM
  marked.setOptions({ gfm: true });
  Ember.Handlebars.helper('format-markdown', function(md) {
    return new Ember.Handlebars.SafeString(marked(md));
  });

  // Support additional HTML5 attributes on {{textarea}}
  Ember.TextArea.reopen({
    attributeBindings: ['autofocus', 'spellcheck']
  });

  var App = Ember.Application.create();

  var model = { markdown: '' };
  App.IndexRoute = Ember.Route.extend({
    model: function() { return model; }
  });

  App.IndexView = Ember.View.extend({
    didInsertElement: function() {
      var $input = $('#input');
      var $output = $('#output');

      var init_nano = function() {
        setTimeout(function() {
          $input.add($output).nanoScroller(nano_options).each(function() {
            // we gave the slider a 2px margin, so we must reduce its height
            var slider = this.nanoscroller.sliderHeight - 4;
            $(this).find('> .pane > .slider').height(slider);
          });
        }, 0);
      };

      // re-init nanoScroller.js when content changes
      $(window).on('resize', init_nano);
      $input.children('.content').on('input paste', init_nano);
    }
  });

})();
