(function (document) {

//var HOST = 'localhost:3001';
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
      '<input type="text" name="handle" placeholder="@twitterhandle">' +
      '<input type="text" name="role" placeholder="role">' +
      '<input type="submit">' +
    '</form>' +
    '<div class="spaced-projectlet-handles">' +
      '<% _.each(d.people, function (person) { %>' +
          '<div>' +
            '<a class="spaced-projectlet-handle" href="http://' + HOST + '/people/<%- person.handle %>">@<%- person.handle %></a>' +
            ' &middot; <span><%- person.role %></span>' +
          '</div>' +
      '<% }); %>' +
    '</div>' +
  '</div>';

var Projectlet = Backbone.View.extend({
  template: _.template(template, {variable: 'd'}),

  state: {
    people: {},
  },

  events: {
    'submit form': function (event) {
      event.preventDefault();
      var form = this.$('form')[0];
      var handle = form.handle.value;
      var person = {
        projectId: this.state.id,
        handle: handle,
        role: form.role.value
      };
      var people = this.state.people;
      people[handle] = person;
      this.setState({people: people}).render();
      ajax.post('/people', person);
    },
    'click .spaced-projectlet-close': function () {
      var self = this;
      this.$el.fadeOut(200, function () {
        self.remove();
      });
    },
    'click a': function (event) {
      event.preventDefault();
      chrome.tabs.create({url: event.target.href});
    }
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
    data.people = _.keyBy(data.people, 'handle');
    this.setState(data).render();
    return this;
  },
});

_.keyBy = function (collection, property) {
  var object = {};
  _.each(collection, function (element) {
    object[element[property]] = element;
  });
  return object;
};


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

