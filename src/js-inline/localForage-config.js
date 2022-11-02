(() => {
  'use Strict';

  localforage.config({
    name: 'disckeeper',
    storeName: 'disckeeperStorage',
    description: 'IndexedDB Storage of scores and stuff'
  });

})();