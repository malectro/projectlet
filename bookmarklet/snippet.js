(function (document, js) {
  js = document.createElement('script');
  js.src = '//localhost:3001/media/projectlet.bundle.min.js?' + Math.random() * 99999999;
  document.body.appendChild(js);
})(document);

