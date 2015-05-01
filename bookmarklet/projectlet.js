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
      ajax.post('/people', {projectId: this.state.id, handle: handle});
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

  setData: function (data) {
    data.handles = _.pluck(data.people, 'handle');
    this.setState(data).render();
    return this;
  },
});


var ajax = {
  request: function (options) {
    options = _.extend({
      contentType: 'application/json',
      dataType: 'json',
    }, options);
    if (options.data) {
      options.data = JSON.stringify(options.data);
    }
    return $.ajax(options);
  },
};
_.each(['get', 'post', 'put', 'delete'], function (method) {
  ajax[method] = function (path, data, options) {
    return this.request(_.extend({
      method: method,
      url: 'http://localhost:3001' + path,
      data: data,
    }, options));
  };
});

var projectlet = new Projectlet().render();
projectlet.$el.appendTo(document.body);

ajax.post('/projects', {
  uri: location.toString()
}).then(function (result) {
  projectlet.setData(result);
});


})(document);

