(function() {
  'use strict';

  const roundhistory = {
    
    init() {
      async function getRounds() {
        const roundsFetch = await localforage.getItem('savedRounds');
        return roundsFetch;
      };
      getRounds()
        .then(data => {
          if (!data) {
            return
          } else {
            console.log(data);
          }
        });
    }


  };

  roundhistory.init();
})();