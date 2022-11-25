(function() {
  'use strict';
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      var navMainOpen = document.querySelector('.nav-main-open');
      var menuButtText = document.querySelector('.menu-button-text');
      var menuButtWrap = document.querySelector('.menu-toggle');

      if (navMainOpen) {
        navMainOpen.classList.remove('nav-main-open')
      }
      if (menuButtWrap) {
        menuButtWrap.classList.remove('opened');
        
      }
      if (menuButtText) {
        menuButtText.classList.remove('menu-button-text-red');
        menuButtText.innerHTML = 'Menu';
      }
      
    } else {
      return;
    }
  });
}())