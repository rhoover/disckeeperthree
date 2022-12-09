(function() {
'use strict';

const listplayers = {

  init() {

    // get player list
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
    let playersList = document.querySelector('.list-players-items');
    let playerOutput = "";

    fetchedData.forEach(player => {

      playerOutput += `
        <div class="list-players-item" ${player.primary ? 'data-primary=true' : ''} data-playerID="${player.playerID}">
          <p class="list-players-item-header">${player.primary ? 'App Owner' : ''}</p>
          <div class="list-players-item-player" ">
            <p class="list-players-item-name">${player.nameFirst} ${player.nameLast}</p>
            <svg xmlns="http://www.w3.org/2000/svg" class="delete-me" viewbox="0 0 875 1000" width="27" height="50" >
              <path d="M0 281.296v-68.355q1.953-37.107 29.295-62.496t64.449-25.389h93.744V93.808q0-39.06 27.342-66.402T281.232.064h312.48q39.06 0 66.402 27.342t27.342 66.402v31.248H781.2q37.107 0 64.449 25.389t29.295 62.496v68.355q0 25.389-18.553 43.943t-43.943 18.553v531.216q0 52.731-36.13 88.862T687.456 1000H187.488q-52.731 0-88.862-36.13t-36.13-88.862V343.792q-25.389 0-43.943-18.553T0 281.296zm62.496 0h749.952V218.8q0-13.671-8.789-22.46t-22.46-8.789H93.743q-13.671 0-22.46 8.789t-8.789 22.46v62.496zm62.496 593.712q0 25.389 18.553 43.943t43.943 18.553h499.968q25.389 0 43.943-18.553t18.553-43.943V343.792h-624.96v531.216zm62.496-31.248V437.536q0-13.671 8.789-22.46t22.46-8.789h62.496q13.671 0 22.46 8.789t8.789 22.46V843.76q0 13.671-8.789 22.46t-22.46 8.789h-62.496q-13.671 0-22.46-8.789t-8.789-22.46zm31.248 0h62.496V437.536h-62.496V843.76zm31.248-718.704H624.96V93.808q0-13.671-8.789-22.46t-22.46-8.789h-312.48q-13.671 0-22.46 8.789t-8.789 22.46v31.248zM374.976 843.76V437.536q0-13.671 8.789-22.46t22.46-8.789h62.496q13.671 0 22.46 8.789t8.789 22.46V843.76q0 13.671-8.789 22.46t-22.46 8.789h-62.496q-13.671 0-22.46-8.789t-8.789-22.46zm31.248 0h62.496V437.536h-62.496V843.76zm156.24 0V437.536q0-13.671 8.789-22.46t22.46-8.789h62.496q13.671 0 22.46 8.789t8.789 22.46V843.76q0 13.671-8.789 22.46t-22.46 8.789h-62.496q-13.671 0-22.46-8.789t-8.789-22.46zm31.248 0h62.496V437.536h-62.496V843.76z"/>
            </svg>
            <p class="list-players-item-delete">Delete Player</p>
          </div>
        </div>`
    });

    playersList.innerHTML = playerOutput;

    listplayers.deletePlayer(fetchedData);
  },

  deletePlayer(fetchedData) {

    //declare all the things
    let playerList = document.querySelector('.list-players');
    let primaryItem = document.querySelector('[data-primary=true]');
    let ident = "";
    let indexOfPlayer;

    //remove deleting action elements from primary player
    primaryItem.querySelector(('.delete-me')).remove();
    primaryItem.querySelector(('.list-players-item-delete')).remove();

    //clicking the trashcan
    function playerListListener(event) {
      let target = event.target.closest('.list-players-item');
      //which player was clicked
      ident = target.getAttribute('data-playerid');
      //remove player from DOM
      target.remove();

      //remove from players array
      indexOfPlayer = fetchedData.findIndex(player => {
        return player.playerID === ident;
      });
      fetchedData.splice(indexOfPlayer, 1);

      //save modifued players array
      localforage.setItem('playerList', fetchedData);
    };

    playerList.addEventListener('click', playerListListener);

  }, //end deletePlayer
};


listplayers.init();
})();