/**
 * shakedown.io
 */

(function() {

  marked.setOptions({ gfm: true });

  Ember.Handlebars.helper('format-markdown', function(md) {
    return new Ember.Handlebars.SafeString(marked(md));
  });




  App = Ember.Application.create();

  var model = { markdown: '' };

  App.IndexRoute = Ember.Route.extend({
    model: function() { return model; }
  });

})();
