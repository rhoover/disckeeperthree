(function() {
'use strict';

var close = document.querySelector('.nav-close');
var menuText = document.querySelector('.menu-button-text');
var menuButtonWrap = document.querySelector('.menu-toggle');
var navMenu = document.querySelector('.nav');

close.onclick = function() {
  navMenu.classList.toggle('nav-open');

  menuButtonWrap.classList.toggle('opened');
  
  menuText.classList.toggle('menu-button-text-red');

  if (menuText.innerHTML === 'Menu') {
    menuText.innerHTML = 'Close'
  } else {
    menuText.innerHTML = 'Menu'
  };
};
})();