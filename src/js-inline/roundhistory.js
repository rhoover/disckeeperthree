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
            // return
            roundhistory.noRounds(data);
          } else {
            data.sort((a,b) => {
              return new Date(b.date) - new Date(a.date);
            });
            roundhistory.buildRoundsList(data);
          }
        });
    },

    noRounds(roundsData) {
      if (roundsData == null) {
        let roundsWarning = document.querySelector('.round-history-items');
        let warningOutput = "";
        warningOutput += `
          <p class="round-history-warning">You don't have any rounds saved yet,</p>
          <a href="roundsetup.html" class="round-history-warning-link">Go ahead and start one!  ➤</a>
        `;
        roundsWarning.innerHTML += warningOutput;
      } else {
        roundhistory.buildRoundsList(roundsData);
      }
    },

    buildRoundsList(roundsData) {
      let roundsList = document.querySelector('.round-history-items');
      let roundsOutput = "";

      roundsData.forEach(function(round) {

        roundsOutput += 
          `<div class="round-history-round">
            <p class="round-history-round-header">${round.course} <span>${round.roundDate}</span></p>
            <div class="round-history-round-data">
              ${round.players.map(player => 
              `<p class="round-history-round-data-name">${player.nameFirst} ${player.nameLast}</p>
              <p class="round-history-round-data-score"><span>${player.finalScore}</span> from ${player.finalThrows} throws</p>`).join('\n').replaceAll('"', '')}
            </div>
          </div>`;
      });

      roundsList.innerHTML += roundsOutput;

    }


  };

  roundhistory.init();
})();