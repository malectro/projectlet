(function (document) {

var template =
  '<div id="spaced-projectlet" class=<%- d.className %>>' +
    '<div class="spaced-projectlet-title">Tag this project with a tweeter.</div>' +
    '<form>' +
      '<input type="text" value="<%- d.handle %>" placeholder="@twitterhandle" />' +
    '</form>' +
    '<div class="spaced-projectlet-handles">' +
      '<% _.each(d.handles, function (handle) { %>' +
        '<a class="spaced-projectlet-handle" href="twitter.com/<%- handle %>">@<%- handle %></a>' +
      '<% }); %>' +
    '</div>' +
    '<a class="spaced-projectlet-close">close</a>' +
  '</div>';

var Projectlet = Backbone.View.extend({
  template: _.template(template, {variable: 'd'}),

  state: {
    handles: [],
  },

  events: {
    'submit form': function (event) {
      event.preventDefault();
      var handle = this.$('input').val();
      this.setState({
        handles: _.union(this.state.handles, [handle])
      }).render();
    },
    'click .spaced-projectlet-close': function () {
      var self = this;
      this.$el.fadeOut(200, function () {
        self.remove();
      });
    },
  },

  initialize: function (options) {
    options = _.extend({}, options);
    this.state = _.extend(this.state, options.state);
  },

  render: function () {
    this.$el.html(this.template(this.state));
    return this;
  },

  setState: function (attrs) {
    _.extend(this.state, attrs);
    return this;
  },
});

var projectlet = new Projectlet().render();
projectlet.$el.appendTo(document.body);

})(document);

