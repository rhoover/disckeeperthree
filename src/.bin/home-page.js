var nsg = require('node-sprite-generator');

nsg({
    src: ['src/home-images/*.jpg'],
    spritePath: 'src/img/sprites/homepage-sprite.png',
    stylesheetPath: 'src/sass/sprites/_homepage-sprite.scss',
    layout: 'packed',
    layoutOptions: {
      padding: 5
    },
    stylesheet: 'css',
    stylesheetOptions: {
      prefix: 'home-links-',
      spritePath: '/img/sprites/homepage-sprite.png'
    },
    compositor: "jimp"
});
