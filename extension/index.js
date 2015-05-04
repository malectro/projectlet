(function (document) {

// var HOST = 'localhost:3001';
var HOST = 'projectlet.herokuapp.com';

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    //console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

var template =
  '<div id="spaced-projectlet" class=<%- d.className %>>' +
    '<div class="spaced-projectlet-title">Tag this project with a tweeter.</div>' +
    '<form>' +
      '<input type="text" value="<%- d.handle %>" placeholder="@twitterhandle" />' +
    '</form>' +
    '<div class="spaced-projectlet-handles">' +
      '<% _.each(d.handles, function (handle) { %>' +
        '<div><a class="spaced-projectlet-handle" href="' + HOST + '/people/<%- handle %>">@<%- handle %></a></div>' +
      '<% }); %>' +
    '</div>' +
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
      url: 'http://' + HOST + path,
      data: data,
    }, options));
  };
});

$(function () {
  var projectlet = new Projectlet({
    el: $('main')
  }).render();

  getCurrentTabUrl(function (url) {
    ajax.post('/projects', {
      uri: url
    }).then(function (result) {
      projectlet.setData(result);
    });
  });
});


})(document);

