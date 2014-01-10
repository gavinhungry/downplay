/**
 * shakedown.io
 */

(function() {
  App = Ember.Application.create();

  var model = { markdown: '' };

  App.IndexRoute = Ember.Route.extend({
    model: function() { return model; }
  });

})();
