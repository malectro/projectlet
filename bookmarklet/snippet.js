javascript: void(function (document, js) {
  js = document.createElement('script');
  js.src = '//localhost:3001/static/projectlet.js?' + Math.random() * 99999999;
  document.body.appendChild(js);
})(document);

