(() => {
  'use strict';

  const createNewPlayer = {

    init() {

      let formEl = document.querySelector('.createplayer-form');

      // get player list
      async function getPlayerList() {
        const idbData = await localforage.getItem('playerList');
        return idbData;
      };
      getPlayerList()
        .then(playerList => {
          createNewPlayer.setUp(playerList, formEl);
        });

    },

    setUp(list, incomingFormEl) {
      let nameObject = {};
      incomingFormEl.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(incomingFormEl);
        nameObject = {
          firstName: formData.get('playerNameFirst'),
          lastName: formData.get('playerNameLast')
        }
        createNewPlayer.addPlayerData(list, nameObject);
      });
    },

    addPlayerData(list, nameObject) {
      let playerMetaInfo = {
        nameFirst: nameObject.firstName,
        nameLast: nameObject.lastName,
        playerID: (+new Date).toString(36),
        created: new Date().toLocaleDateString('en-US')
      };
      createNewPlayer.primaryPlayer(list, playerMetaInfo);
    },

    primaryPlayer(list, incomingPlayerData) {
      // if the list doesn't exist, typically just on the first player creation
      if (list == null) {
        list = [];
        incomingPlayerData.primary = true;
        list.push(incomingPlayerData);
      } else { // how about the player list does exist
        // check if there's already a primary player
        let player = list.find(player => player.primary);
        //if there is a primary player
        if (player) {
          list.push(incomingPlayerData)
        } else { //otherwise there isn't
          incomingPlayerData.primary = true;
          list = [];
          list.push(incomingPlayerData);
        }        
      };
      createNewPlayer.storePlayer(list);
    },

    storePlayer(finishedList) {
      let success = document.querySelector('.createplayer-success');
      let form = document.querySelector('.createplayer-form');

      localforage.setItem('playerList', finishedList);
      //some UI assistance
      success.classList.add('createcourse-success-good');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };
  createNewPlayer.init();
})();