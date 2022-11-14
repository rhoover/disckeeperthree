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
            data.sort((a,b) => {
              return new Date(b.date) - new Date(a.date);
            });
            roundhistory.buildRoundsList(data);
          }
        });
    },

    buildRoundsList(roundsData) {
      let roundsList = document.querySelector('.round-history');
      let roundsOutput = "";

      roundsData.forEach(function(round) {

        roundsOutput += 
          `<div class="round-history-round">
            <p class="round-history-round-header">${round.course} <span>${round.date}</span></p>
            <div class="round-history-round-data">
              ${round.players.map(player => 
              `<p class="round-history-round-data-name">${player.nameFirst} ${player.nameLast}</p>
              <p class="round-history-round-data-score"><span>${player.holes[17].overUnderRound}</span> from ${player.holes[17].throwsRound} throws</p>`).join('\n').replaceAll('"', '')}
            </div>
          </div>`;
      });

      roundsList.innerHTML = roundsOutput;

    }


  };

  roundhistory.init();
})();