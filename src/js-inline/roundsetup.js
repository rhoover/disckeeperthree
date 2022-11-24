(function() {
  'use strict';

  const roundsetup = {

    init() {

      // get both lists
      async function getLists() {
        const playerFetch = await localforage.getItem('playerList');
        const courseFetch = await localforage.getItem('courseList');
        return [playerFetch, courseFetch];
      };
      getLists()
        .then(fetchedData => {
          roundsetup.dataChecks(fetchedData[0], fetchedData[1]);
        });

        localforage.setItem('chosenPlayers', []);

      // fix to stop modals displaying on page load
      let modals = document.querySelectorAll('[style="visibility:hidden;"]');
        setTimeout(() => {
          modals.forEach(function(modal) {
            modal.removeAttribute('style');
          });
        }, 2000)
    },

    dataChecks(playerList, courseList) {
      if (courseList == null && playerList == null) {
        document.querySelector('.setup-modal-noprimary').classList.add('setup-modal-noprimary-open');       
      } else {
        if (courseList && playerList == null) {
          document.querySelector('.setup-modal-noprimary').classList.add('setup-modal-noprimary-open');
        };
        if (courseList == null && playerList) {
          document.querySelector('.setup-modal-nocourse').classList.add('setup-modal-nocourse-open');
          // display primary player first name as it's always chosen
          let displayedPlayers = document.querySelector('.selections-players');
          playerList.forEach(function(player) {
            if (player.primary == true) {
              displayedPlayers.innerHTML = player.nameFirst;
              roundsetup.assembleFinalInfo(player);
            };
          });
        };
        if (courseList && playerList) {
          // display primary player first name as it's always chosen
          let displayedPlayers = document.querySelector('.selections-players');
          playerList.forEach(function(player) {
            if (player.primary == true) {
              displayedPlayers.innerHTML = player.nameFirst;
              roundsetup.assembleFinalInfo(player);
            };
          });

          roundsetup.buildCourseModal(courseList);
          roundsetup.buildPlayersModal(playerList);
        };
      };
    },

    buildCourseModal(courseList) {
      let insertCoursesHere = document.querySelector('.setup-modal-courses-list');
      let coursesButton = document.querySelector('[rh-button="courses"]');
      let coursesOutput = "";

      courseList.forEach(function(course) {
        coursesOutput += `
        <p class="setup-modal-courses-item">${course.name}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="setup-modal-players-item-checkmark"><path d="M170.718 216.482L141.6 245.6l93.6 93.6 208-208-29.118-29.118L235.2 279.918l-64.482-63.436zM422.4 256c0 91.518-74.883 166.4-166.4 166.4S89.6 347.518 89.6 256 164.482 89.6 256 89.6c15.6 0 31.2 2.082 45.764 6.241L334 63.6C310.082 53.2 284.082 48 256 48 141.6 48 48 141.6 48 256s93.6 208 208 208 208-93.6 208-208h-41.6z"/></svg>
        </p>
        `;
      }); // end for loop

      insertCoursesHere.innerHTML = coursesOutput;

      coursesButton.addEventListener('click', event => {
        document.querySelector('.setup-modal-courses').classList.add('setup-modal-courses-open');
        roundsetup.manageCoursesModal(courseList);
      });
    },

    manageCoursesModal(courseList) {
      let courseItems = document.querySelectorAll('.setup-modal-courses-item');
      let chosenCourse = [];
      let clickedCourse = {};
      let clicks = 0;
      let closeButton = document.querySelector('.setup-modal-courses-footer-close-icon');
      let closeSaveButton = document.querySelector('.setup-modal-courses-footer-save-icon');

      courseItems.forEach((course, index) => {
        course.addEventListener('click', event => {
          course.children[0].classList.toggle('setup-modal-courses-item-checkmark-good');

          clicks += 1;
          clickedCourse = courseList[index];
          // console.log('clicks count:', clicks);
          // console.log('clicked course:', clickedCourse);

          if (clicks == 1) { // first click, there's nothing in array
            chosenCourse.splice(0, 0, clickedCourse);
            // console.log('chosen course:', chosenCourse);
          } else { // subsequent clicks, must make tests so only one course is saved
            // find if the index of clicked course already exists
            let deleteCourse = chosenCourse.findIndex(course => {
                return course.id === clickedCourse.id;
              });
              // console.log('delete me index:', deleteCourse);
              // if it doesn't findIndex returns -1
              if (deleteCourse != -1) {
                // if clicked course already exists in array, like clicking on it twice to un-chcek
                if (clickedCourse.id == chosenCourse[deleteCourse].id) {
                  chosenCourse.splice(deleteCourse, 1);
                  // console.log('cleaned array:', chosenCourse);
                }
              } else {
                chosenCourse.splice(0,0,clickedCourse);
              } // end inner if else
            } // end if else
        }); // end listener
      }); // end foreach
      
      closeButton.addEventListener('click', event => {
        document.querySelector('.setup-modal-courses').classList.remove('setup-modal-courses-open');
      });
      closeSaveButton.addEventListener('click', event => {
        // some meta info of the round
        chosenCourse[0].roundID = (+new Date).toString(36);
        chosenCourse[0].roundDate = new Date().toLocaleDateString('en-US');

        roundsetup.displayCourseSelection(chosenCourse[0]);
        document.querySelector('.setup-modal-courses').classList.remove('setup-modal-courses-open');
        localforage.setItem('chosenCourse', chosenCourse[0]);
      });
    },

    buildPlayersModal(playerList) {
      let insertPlayersHere = document.querySelector('.setup-modal-players-list');
      let playersButton = document.querySelector('[rh-button="players"]');
      let playersOutput = "";
      let removeIndex;
      if (playerList.length > 1) {
        removeIndex = playerList.map(function(item) {return item.primary});
      }
      let noPrimaryPlayerList = [];

      // don't present primary player in modal to click
      noPrimaryPlayerList = [...playerList];
      noPrimaryPlayerList.splice(removeIndex, 1);

      // build the list of available player to click, minus the primary
      noPrimaryPlayerList.forEach(function(player) {
        playersOutput += `
          <p class="setup-modal-players-item">${player.nameFirst} ${player.nameLast}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="setup-modal-players-item-checkmark"><path d="M170.718 216.482L141.6 245.6l93.6 93.6 208-208-29.118-29.118L235.2 279.918l-64.482-63.436zM422.4 256c0 91.518-74.883 166.4-166.4 166.4S89.6 347.518 89.6 256 164.482 89.6 256 89.6c15.6 0 31.2 2.082 45.764 6.241L334 63.6C310.082 53.2 284.082 48 256 48 141.6 48 48 141.6 48 256s93.6 208 208 208 208-93.6 208-208h-41.6z"/></svg>
          </p>
        `;
      }); // end for loop

      insertPlayersHere.innerHTML = playersOutput;

      playersButton.addEventListener('click', event => {
        document.querySelector('.setup-modal-players').classList.add('setup-modal-players-open');
        roundsetup.managePlayersModal(noPrimaryPlayerList, playerList);
      });
    },

    managePlayersModal(noPrimaryPlayerList, playerList) {
      let playerItems = document.querySelectorAll('.setup-modal-players-item');
      let closeButton = document.querySelector('.setup-modal-players-footer-close-icon');
      let closeSaveButton = document.querySelector('.setup-modal-players-footer-save-icon');
      let clickedPlayer = {};
      let chosenPlayers = [];
      let clicks = 0;
      let primary = playerList.find(player => player = player.primary);

      playerItems.forEach(function(player, index) {
        player.addEventListener('click', event => {
          // see manageCoursesModal for code comments, this is a copy
          player.children[0].classList.toggle('setup-modal-players-item-checkmark-good');

          clicks += 1;
          clickedPlayer = noPrimaryPlayerList[index];

          function addPlayer(clickedPlayer) {
            const existingIDs = chosenPlayers.map((addedPlayer) => addedPlayer.playerID);

            if (!existingIDs.includes(clickedPlayer.playerID)) {
              chosenPlayers.splice(0, 0, clickedPlayer);
            } else {
              let index = chosenPlayers.findIndex(player => player.playerID === clickedPlayer.playerID);
              chosenPlayers.splice(index, 1);
            };
          };

          addPlayer(clickedPlayer);

        }); // end listener
      }); // end for loop

      closeButton.addEventListener('click', event => {
        document.querySelector('.setup-modal-players').classList.remove('setup-modal-players-open');
      });      
      closeSaveButton.addEventListener('click', event => {
        chosenPlayers.splice(0, 0, primary);
        document.querySelector('.setup-modal-players').classList.remove('setup-modal-players-open');


        roundsetup.displayPlayersSelection(chosenPlayers);
        localforage.setItem('chosenPlayers', chosenPlayers);
      });
    },

    //
    // UI Updates
    //
    displayCourseSelection(chosenCourse) {
      let displayedCourse = document.querySelector('.selections-course');
      let displayedCourseOutput = chosenCourse.name;
      displayedCourse.innerHTML = displayedCourseOutput;
    },

    displayPlayersSelection(chosenPlayers) {
      let displayedPlayers = document.querySelector('.selections-players');
      let displayedPlayersOutput = "";
      chosenPlayers.forEach(function(player) {
        displayedPlayersOutput += `${player.nameFirst}, `;
      });
      displayedPlayers.innerHTML = displayedPlayersOutput;
    },

    assembleFinalInfo(primaryPlayer) {
      let submitButton = document.querySelector('[rh-goscore]');

      submitButton.addEventListener('click', event => {

        async function getChosenData() {
          const players = await localforage.getItem('chosenPlayers');
          const course = await localforage.getItem('chosenCourse');
          return [players, course];
        };
        getChosenData()
        .then(data => {
          let players = data[0];
          let course = data[1];

          for (let i = 0; i < players.length; i++) {
            //add course meta for round saves
            players[i].courseScored = course.name;
            players[i].courseScoredID = course.courseID;
            players[i].coursePlayedDate = new Date().toLocaleDateString('en-US');
            //add course holes for scorekeeping purposes
            players[i].holes = course.holes;
          }; // end for loop

          // re-save players new data
          localforage.setItem('chosenPlayers', players);
        }); // end .then
        

        // off to the show
        setTimeout(() => {
          window.location.href = 'roundscoring.html';
        }, 1000);

      }); // end listener
    }

  };
  roundsetup.init();
})();