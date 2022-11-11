(function() {
  'use strict';

  const roundscoring = {

    init() {
      async function getChosenCourse() {
        const courseFetch = await localforage.getItem('chosenCourse');
        const playersFetch = await localforage.getItem('chosenPlayers');
        return [courseFetch, playersFetch];
      };
      getChosenCourse()
        .then(data => {
          //send down course data
          roundscoring.buildHeader(data[0]);
          roundscoring.seedMeta(data[0]);

          // send down player data
          roundscoring.seedConfirm(data[1]);
          roundscoring.seedPlayerScores(data[1]);

          let padNumbers = document.querySelectorAll('.roundscoring-numpad-button');
          roundscoring.scoring(padNumbers, data[0], data[1]);
        });

        //fix to stop modal displaying on page load
        let modal = document.querySelector('[style="visibility:hidden;"]');
        setTimeout(() => {
          modal.removeAttribute('style');
        }, 2000);

    },

    buildHeader(incomingCourse) {
      document.querySelector('.roundscoring-header').innerHTML = incomingCourse.name;
    },

    seedMeta(incomingCourse) {
      document.querySelector('[rh-holeNumber]').innerHTML = incomingCourse.holes[0].holeNumber;
      document.querySelector('[rh-parNumber]').innerHTML = incomingCourse.holes[0].par;
    },

    seedConfirm(incomingPlayers) {
      let names = document.querySelectorAll('[rh-playerConfirmName]');
      names.forEach(function(name) {
        name.innerHTML = incomingPlayers[0].nameFirst;
      });
    },

    seedPlayerScores(incomingPlayers) {
      let scoringSection = document.querySelector('.roundscoring-players');
      let playersOutput = "";

      incomingPlayers.forEach(function(player, index) {
        playersOutput += `
        <div class="roundscoring-players-player">
        <p class="roundscoring-players-name" rh-player-name">${player.nameFirst}</p>
        <p class="roundscoring-players-score" rh-player-score></p>
        </div>
        `;
      });
      scoringSection.innerHTML = playersOutput;
    },

    scoring(numberPad, course, players) {
      // all declarations
      let throwsBox;
      let clear;
      let submitButton;      
      let activePlayerIndex;
      let roundIndex;
      let activePlayer;
      let holeNumber;
      let holePar;
      let activePlayerName;
      let playerScoreCurrent;
      let nextHoleIndex;
      let modalSelect;

      // throws display box
      throwsBox = document.querySelector('[rh-throws]');
      throwsBox.innerHTML = "";

      //clear button on numpad
      clear = document.querySelector('[rh-clear]');

      // submit throws for hole
      submitButton = document.querySelector('[rh-submit]');

      // elements, meta
      holeNumber = document.querySelector('[rh-holenumber]');
      holePar = document.querySelector('[rh-parnumber]');

      // elements, scores
      activePlayerName = document.querySelectorAll('[rh-playerConfirmname]');
      playerScoreCurrent = document.querySelectorAll('[rh-player-score]');

      // initialize indices for moving through players and holes
      activePlayerIndex = 0;
      roundIndex = 0;

      // punching the pad and showing it in the throws box
      numberPad.forEach(number => {
        number.addEventListener('click', event => {
          // a ternery in case there's a double digit throw for the hole
          throwsBox.innerHTML ? throwsBox.innerHTML += number.innerHTML : throwsBox.innerHTML = number.innerHTML;
        });
      });

      // Clear Button on NumPad
      clear.addEventListener('click', event => {
        throwsBox.innerHTML = "";
      });


      function scores(incomingThrows, activePlayer) {

        console.log('incoming throws:', incomingThrows, 'active player:', activePlayer, 'round Index:', roundIndex);
        
        if (roundIndex < course.holes.length -1) { // if not the last hole

          activePlayer.holes[roundIndex].throws = incomingThrows;

          activePlayer.holes[roundIndex].throwsRound += incomingThrows;

          activePlayer.holes[roundIndex].overUnder = (incomingThrows - activePlayer.holes[roundIndex].par);

          activePlayer.holes[roundIndex].overUnderRound += activePlayer.holes[roundIndex].overUnder;

          console.log('scored hole:', activePlayer.holes[roundIndex]);

          // write new score to displayed scores
          playerScoreCurrent[activePlayerIndex].innerHTML = activePlayer.holes[roundIndex].overUnderRound;

          //seed next hole for active player
          nextHoleIndex = roundIndex + 1;
          activePlayer.holes[nextHoleIndex].throwsRound = activePlayer.holes[roundIndex].throwsRound;
          activePlayer.holes[nextHoleIndex].overUnderRound = activePlayer.holes[roundIndex].overUnderRound;
          console.log('seeded next hole:', activePlayer.holes, 'for player:', activePlayer);

          // deep copy necessary after modifying referenced object
          players[activePlayerIndex] = JSON.parse(JSON.stringify(activePlayer));

          // bump to next player to become activePlayer
          if (activePlayerIndex < players.length - 1) { // not the last player in the players list

            activePlayerIndex++;
            activePlayer = players[activePlayerIndex];
            
            // update UI confirm area player
            activePlayerName.forEach(function(name) {
              name.innerHTML = players[activePlayerIndex].nameFirst;
            });
          } else { // is the last player in the list, or is single player
          
            activePlayerIndex = 0;
            roundIndex++;

            // update UI confirm area player
            activePlayerName.forEach(function(name) {
              name.innerHTML = players[activePlayerIndex].nameFirst;
            });

            // update displayed hole meta info
            holeNumber.innerHTML = course.holes[roundIndex].holeNumber;
            holePar.innerHTML = course.holes[roundIndex].par;
          }

        } else { // it is the last hole

          activePlayer.holes[roundIndex].throws = incomingThrows;

          // activePlayer.holes[roundIndex].throwsRound = activePlayer.holes[roundIndex].throwsRound + incomingThrows;
          activePlayer.holes[roundIndex].throwsRound += incomingThrows;

          activePlayer.holes[roundIndex].overUnder = (incomingThrows - activePlayer.holes[roundIndex].par);

          activePlayer.holes[roundIndex].overUnderRound += activePlayer.holes[roundIndex].overUnder;

          // deep copy necessary after modifying referenced object
          players[activePlayerIndex] = JSON.parse(JSON.stringify(activePlayer));

          // bump to next player to become activePlayer if multiple players
          if (activePlayerIndex < players.length - 1) { // not the last player in the players list
            activePlayerIndex++;
            activePlayer = players[activePlayerIndex];
            
            // update UI confirm area player
            activePlayerName.forEach(function(name) {
              name.innerHTML = players[activePlayerIndex].nameFirst;
            });
          } else { // is the last player in the list, or is single player, on last hole
            activePlayerIndex = 0;
            // roundIndex++;

            // update UI confirm area player
            activePlayerName.forEach(function(name) {
              name.innerHTML = players[activePlayerIndex].nameFirst;
            });

            // update displayed hole meta info
            holeNumber.innerHTML = course.holes[roundIndex].holeNumber;
            holePar.innerHTML = course.holes[roundIndex].par;

            // finishing up
            //seed the finishing modal
            roundscoring.seedFinishedModal(course, players, roundIndex);

            // bring the modal down
            setTimeout(() => {
              modalSelect = document.querySelector('.roundscoring-modal');
              modalSelect.classList.toggle('roundscoring-modal-open');
            }, 1000);
          }
        }; // end if-else for all holes, working and last
        // start all over again
        throwsBox.innerHTML = "";
      }; // end scores

      // and by submit we mean update both the DOM display and the js objects
      submitButton.addEventListener('click', event => {
        if (throwsBox.innerHTML) {
          // deep copy necessary
          activePlayer = JSON.parse(JSON.stringify(players[activePlayerIndex]));
          scores(parseInt(throwsBox.innerHTML, 10), activePlayer);
        };
      }); // end submit click

    }, // end scoring

    seedFinishedModal(course, players, roundIndex) {
      let insertRoundDataHere = document.querySelector('[rh-rounddata]');
      let roundDataOutput = `
      <h5 class="roundscoring-modal-round-header">${course.name}</h5>
      <p class="roundscoring-modal-round-date">${course.roundDate}</p>`;

      players.forEach(function(player) {
        roundDataOutput += `
        <div class="roundscoring-modal-player">
        <p class="roundscoring-modal-player-name">${player.nameFirst}</p>
        <p class="roundscoring-modal-player-score">${player.holes[roundIndex].overUnderRound}</p>
        <p class="roundscoring-modal-player-throws">From ${player.holes[roundIndex].throwsRound} Throws</p>
        </div>
        `;
      });
      insertRoundDataHere.innerHTML = roundDataOutput;
      roundscoring.manageFinishedModal(course, players, roundIndex);
    },

    manageFinishedModal(course, players, roundIndex) {
      let closeButton;
      let saveButton;
      let savedRound;
      let savedRoundsArray;

      closeButton = document.querySelector('.roundscoring-modal-footer-close-icon');
      saveButton = document.querySelector('.roundscoring-modal-footer-save-icon');

      savedRound = {
        players: players,
        course: course.name,
        courseID: course.courseID,
        roundID: course.roundID,
        date: new Date().toLocaleDateString('en-US')
      };

      savedRoundsArray = [];

      // footer actions
      closeButton.addEventListener('click', event => {
        document.querySelector('.roundscoring-modal').classList.remove('roundscoring-modal-open');
      });
      saveButton.addEventListener('click', event => {

        async function getSavedRounds() {
          const rounds = await localforage.getItem('savedRounds');
          return(rounds);
        };
        getSavedRounds()
        .then(data => {
          if (data) {
            data.splice(0, 0, savedRound);
            roundscoring.storeage(data);
          } else {
            savedRoundsArray.splice(0, 0, savedRound);
            roundscoring.storeage(savedRoundsArray);
          }
        }); // end .then
        document.querySelector('.roundscoring-modal').classList.remove('roundscoring-modal-open');
      }); // end save button
    },

    storeage(incomingSavedRoundData) {
      localforage.setItem('savedRounds', incomingSavedRoundData);

      // remove chosen stuff for this round
      localforage.removeItem('chosenCourse');
      localforage.removeItem('chosenPlayers');
      
      // off to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }

  };

  roundscoring.init();
})();