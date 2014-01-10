/**
 * shakedown.io
 */

(function() {
  'use strict';

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

})();
