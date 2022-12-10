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
          roundscoring.seedMeta(data[0]);

          // send down player data
          roundscoring.seedConfirm(data[1]);
          roundscoring.seedPlayerScores(data[1]);

          let padNumbers = document.querySelectorAll('.round-scoring-numpad-button');
          roundscoring.scoring(padNumbers, data[0], data[1]);
        });

        //fix to stop modal displaying on page load
        let modal = document.querySelector('[style="visibility:hidden;"]');
        setTimeout(() => {
          modal.removeAttribute('style');
        }, 2000);

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
      let scoringSection = document.querySelector('.round-scoring-players');
      let playersOutput = "";

      incomingPlayers.forEach(function(player, index) {
        playersOutput += `
        <div class="round-scoring-players-player">
        <p class="round-scoring-players-name" rh-player-name">${player.nameFirst}</p>
        <p class="round-scoring-players-score" rh-player-score></p>
        </div>
        `;
      });
      scoringSection.innerHTML = playersOutput;
    },

    scoring(numberPad, course, players) {

      // declare all the things

      // throws box display
      let throwsBox = document.querySelector('[rh-throws]');
      //clear button on numpad
      let clear = document.querySelector('[rh-clear]');
      // submit throws for hole
      let submitButton = document.querySelector('[rh-submit]');     
      // initialize indices for moving through players and holes 
      let activePlayerIndex = 0;
      let roundIndex = 0;
      // because
      let activePlayer;
      // elements, meta
      let holeNumber = document.querySelector('[rh-holenumber]');
      let holePar = document.querySelector('[rh-parnumber]');
      // elements, scores
      let activePlayerName = document.querySelectorAll('[rh-playerConfirmname]');
      let playerScoreCurrent = document.querySelectorAll('[rh-player-score]');
      let nextHoleIndex;
      // finishing up
      let finishedModal;

      throwsBox.innerHTML = "";

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

        
        if (roundIndex < course.holes.length -1) { // if not the last hole

          activePlayer.holes[roundIndex].throws = incomingThrows;

          activePlayer.holes[roundIndex].throwsRound += incomingThrows;

          activePlayer.holes[roundIndex].overUnder = (incomingThrows - activePlayer.holes[roundIndex].par);

          activePlayer.holes[roundIndex].overUnderRound += activePlayer.holes[roundIndex].overUnder;


          // write new score to displayed scores
          playerScoreCurrent[activePlayerIndex].innerHTML = activePlayer.holes[roundIndex].overUnderRound;

          // color co-ordinate displayed overall scores
          // over par:
          if (activePlayer.holes[roundIndex].overUnderRound > 0) {
            playerScoreCurrent[activePlayerIndex].classList.add('round-scoring-players-score-over');
            playerScoreCurrent[activePlayerIndex].classList.remove('round-scoring-players-score-under');  
          // par: 
          } else if (activePlayer.holes[roundIndex].overUnderRound == 0) {
            playerScoreCurrent[activePlayerIndex].classList.remove('round-scoring-players-score-over');
            playerScoreCurrent[activePlayerIndex].classList.remove('round-scoring-players-score-under');
            // under par:  
          } else {
            playerScoreCurrent[activePlayerIndex].classList.add('round-scoring-players-score-under');
            playerScoreCurrent[activePlayerIndex].classList.remove('round-scoring-players-score-over');
          };

          //seed next hole for active player
          nextHoleIndex = roundIndex + 1;
          activePlayer.holes[nextHoleIndex].throwsRound = activePlayer.holes[roundIndex].throwsRound;
          activePlayer.holes[nextHoleIndex].overUnderRound = activePlayer.holes[roundIndex].overUnderRound;

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

          activePlayer.holes[roundIndex].throwsRound += incomingThrows;

          activePlayer.holes[roundIndex].overUnder = (incomingThrows - activePlayer.holes[roundIndex].par);

          activePlayer.holes[roundIndex].overUnderRound += activePlayer.holes[roundIndex].overUnder;

          // deep copy necessary after modifying referenced object
          players[activePlayerIndex] = JSON.parse(JSON.stringify(activePlayer));

          // bump to next player to become activePlayer if multiple players
          if (activePlayerIndex < players.length - 1) { // is not the last player in the players list
            activePlayerIndex++;
            activePlayer = players[activePlayerIndex];
            
            // update UI confirm area player
            activePlayerName.forEach(function(name) {
              name.innerHTML = players[activePlayerIndex].nameFirst;
            });
          } else { // is the last player in the list, or is single player, on last hole
            activePlayerIndex = 0;

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
              finishedModal = document.querySelector('.round-scoring-modal');
              finishedModal.classList.toggle('round-scoring-modal-open');
            }, 300);
          }
        }; // end if-else for all holes, working and last
        // start all over again
        throwsBox.innerHTML = "";
      }; // end scores function

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
      let roundDataOutput = "";

      roundDataOutput = `
        <h5 class="round-scoring-modal-round-header">${course.name}</h5>
        <p class="round-scoring-modal-round-date">${course.roundDate}</p>`;

      players.forEach(function(player) {
        player.finalScore = player.holes[roundIndex].overUnderRound;
        player.finalThrows = player.holes[roundIndex].throwsRound;

        roundDataOutput += `
        <div class="round-scoring-modal-player">
        <p class="round-scoring-modal-player-name">${player.nameFirst}</p>
        <p class="round-scoring-modal-player-score">${player.finalScore}</p>
        <p class="round-scoring-modal-player-throws">From ${player.finalThrows} Throws</p>
        </div>
        `;
      });
      insertRoundDataHere.innerHTML = roundDataOutput;
      roundscoring.manageFinishedModal(course, players, roundIndex);
    }, // end seedFinishedModal

    manageFinishedModal(course, players, roundIndex) {
      let closeButton = document.querySelector('.round-scoring-modal-footer-close-icon');
      let saveButton = document.querySelector('.round-scoring-modal-footer-save-icon');
      let savedRound = {};
      let savedRoundsArray = [];

      savedRound = {
        players: players,
        course: course.name,
        courseID: course.courseID,
        roundID: course.roundID,
        roundDate: new Date().toLocaleDateString('en-US')
      };

      // footer actions
      function saveButtonListener(event) {

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
        document.querySelector('.round-scoring-modal').classList.remove('round-scoring-modal-open');
      };// end save button listener

      closeButton.addEventListener('click', event => {
        document.querySelector('.round-scoring-modal').classList.remove('round-scoring-modal-open');
      });

      saveButton.addEventListener('click', saveButtonListener); 
    }, // end manageFinishedModal

    storeage(incomingSavedRoundData) {
      localforage.setItem('savedRounds', incomingSavedRoundData);

      // remove chosen stuff for this round
      localforage.removeItem('chosenCourse');
      localforage.removeItem('chosenPlayers');
      
      // off to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    }

  };

  roundscoring.init();
})();