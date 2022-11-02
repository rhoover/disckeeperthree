	(() => {
    'use strict';
    var menuButton = document.querySelector('.menu-button');
    var menuText = document.querySelector('.menu-button-text');
    var menuButtonWrap = document.querySelector('.menu-toggle');
    var navMenu = document.querySelector('.nav');

    menuButton.onclick=function(){
      navMenu.classList.toggle('nav-open');

      menuButtonWrap.classList.toggle('opened');
      
      menuText.classList.toggle('menu-button-text-red');

      if (menuText.innerHTML === 'Menu') {
        menuText.innerHTML = 'Close'
      } else {
        menuText.innerHTML = 'Menu'}
      }
  })();