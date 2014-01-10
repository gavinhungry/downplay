/**
 * shakedown.io
 */

(function() {
  'use strict';

  marked.setOptions({ gfm: true });
  Ember.Handlebars.helper('format-markdown', function(md) {
    return new Ember.Handlebars.SafeString(marked(md));
  });

  var App = Ember.Application.create();

  var model = { markdown: '' };
  App.IndexRoute = Ember.Route.extend({
    model: function() { return model; }
  });

})();
