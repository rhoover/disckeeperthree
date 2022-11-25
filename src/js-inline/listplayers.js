(function() {
'use strict';

const listplayers = {

  init() {

    // get both lists
    async function getPlayers() {
      const playerFetch = await localforage.getItem('playerList');
      return playerFetch;
    };
    getPlayers()
      .then(fetchedData => {
        listplayers.buildListForDOM(fetchedData);
      });
  },

  buildListForDOM(fetchedData) {
    console.log(fetchedData);
    let playersList = document.querySelector('.list-players');
    let playerOutput = "";

    fetchedData.forEach(player => {

      playerOutput += `
        <div class="list-players-item">
          <p class="list-players-item-header">${player.primary ? 'App Owner' : ''}</p>
          <div></div>
          <p class="list-players-item-name">${player.nameFirst} ${player.nameLast}</p>
        </div>
      `
    });

    playersList.innerHTML = playerOutput;

  }
}


listplayers.init();
})();