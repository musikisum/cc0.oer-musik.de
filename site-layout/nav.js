(function () {
  var id, elem, anchors, currentpath;
  anchors =  document.getElementsByClassName('navAnchor');
  for(var i = 0; i < anchors.length; i++)
  {
     anchors.item(i).classList.remove('active');
  }
  currentPath = window.location.pathname.substr(1);
  if (currentPath) {
  /* id = currentPath.slice(0, currentPath.length - 1); */
    id = currentPath.replace('.html', '');
  }

  elem = document.getElementById(id);
  elem.classList.add('active');
})();
