(function() {
  'use strict';

  const statistics = {

    init() {
      async function getRounds() {
        const roundsFetch = await localforage.getItem('savedRounds');
        return roundsFetch;
      };
      getRounds()
        .then(data => {
          statistics.buildCourseData(data);
        });
    //   document.addEventListener('DOMContentLoaded', function () {
    //     Highcharts.chart('averages', {
    //         chart: {
    //             type: 'bar'
    //         },
    //         title: {
    //             text: 'Fruit Consumption'
    //         },
    //         xAxis: {
    //             categories: ['Apples', 'Bananas', 'Oranges']
    //         },
    //         yAxis: {
    //             title: {
    //                 text: 'Fruit eaten'
    //             }
    //         },
    //         series: [
    //           {
    //             name: 'Jane',
    //             data: [1, 5, 4]
    //           },
    //           {
    //             name: 'John',
    //             data: [5, 7, 3]
    //           },
    //           {
    //           name: 'Robin',
    //           data: [2, 5, 6]
    //           }
    //         ],
    //         accessibility: {
    //           enabled: false
    //         }
    //     });
    // });
    }, // end init

    buildCourseData(incomingRoundsData) {
      console.log(incomingRoundsData);
      incomingRoundsData.forEach(round => {
        if (round.course == 'Waterbury') {
          let courseData = [];
          courseData.push(round);
          statistics.buildPlayerData(courseData);
        }
      });
    },

    buildPlayerData(courseData) {
      console.log('chosen rounds', courseData);
    }
  } // end statistics


  statistics.init();
})();