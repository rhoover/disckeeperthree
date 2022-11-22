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
        // Highcharts.chart('holeData', {
        //   chart: {
        //     type: 'bar'
        //   },
        //   title: {
        //     text: 'Historic World Population by Region'
        //   },
        //   subtitle: {
        //     text: 'Source: <a ' +
        //       'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
        //       'target="_blank">Wikipedia.org</a>'
        //   },
        //   xAxis: {
        //    rh: holes array will go here
        //     categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'], 
        //
        //     title: {
        //       text: null
        //     }
        //   },
        //   yAxis: {
        //     min: -700,
        //     title: {
        //       text: 'Population (millions)',
        //       align: 'high'
        //     },
        //     labels: {
        //       overflow: 'justify'
        //     }
        //   },
        //   tooltip: {
        //     valueSuffix: ' millions'
        //   },
        //   plotOptions: {
        //     bar: {
        //       dataLabels: {
        //         enabled: true
        //       }
        //     }
        //   },
        //   legend: {
        //     layout: 'vertical',
        //     align: 'right',
        //     verticalAlign: 'top',
        //     x: -40,
        //     y: 80,
        //     floating: true,
        //     borderWidth: 1,
        //     backgroundColor:
        //       Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        //     shadow: true
        //   },
        //   credits: {
        //     enabled: false
        //   },
        //   series: [{
        //      name, which displays in legend, will be high or low or average
        //     name: 'Year 1990',
        //      3 data numbers in each array will be hi, low, average for each hole, aka 18 objects to correspond to 18 holes from categories
        //     data: [-631, 727, 3202, 721, 26]
        //   }, {
        //     name: 'Year 2000',
        //     data: [814, 841, 3714, 726, 31]
        //   }, {
        //     name: 'Year 2010',
        //     data: [1044, -644, 4170, 735, 40]
        //   }, {
        //     name: 'Year 2018',
        //     data: [1276, 1007, 4561, 746, 42]
        //   }]
        // });
    }, // end init

    buildCourseData(incomingRoundsData) {
      let courseData = [];
      incomingRoundsData.forEach(round => {
        if (round.course == 'Waterbury') {
          courseData.push(round);
        }
      });
      console.log('courseData:', courseData);
      statistics.filterPlayerData(courseData);
    },

    filterPlayerData(courseData) {
      let courseName = courseData[0].course;
      let roundDates = [];
      let playerHoles = [];
      courseData.forEach(course => {
        course.players.forEach(player => {
          if (player.primary) {
            playerHoles.push(player.holes);
            // roundDates.push(player.coursePlayedDate);
          }
        });
      });
      statistics.buildPlayerChartData(playerHoles, courseName); //roundDates
    },

    buildPlayerChartData(incomingPlayerHoles, incomingCourseName) { //incomingRoundDates
      console.log('player data:', incomingPlayerHoles);
      // console.log('round dates:', incomingRoundDates);
      console.log('course name:', incomingCourseName);
      let holeNumber = [];
      let holeThrows = [];
      let eachRound;
      let seriesArray = [];
      let seriesObj = {};
      seriesObj.name = '';
      seriesObj.data = [];

      incomingPlayerHoles[0].forEach(round => {
        let holeName = 'Hole' + '-' + round.holeNumber;
        holeNumber.push(holeName);
      });
      incomingPlayerHoles.forEach((round, index) => {
        eachRound = round.map((currentRound, i) => currentRound.throws);
        holeThrows.push(eachRound);
      });
      
      console.table(holeThrows);
      console.log('hole throws:', holeThrows);
      console.log('hole numbers:', holeNumber);

      //https://stackoverflow.com/questions/7848004/get-column-from-a-two-dimensional-array


      for (let i = 0; i < holeThrows.length; i++) {
        for (let j = 0; j < holeThrows[i].length; j++) {
          console.log('holeThrows index', i);
          if (i == 0) {
            let eachHoleThrows = holeThrows.map(d => d[j]);
            console.log('eachHoleThrows:', eachHoleThrows);
            console.log('Hole Number: ', holeNumber[j]);
            let hiThrow = Math.max(...eachHoleThrows);
            let loThrow = Math.min(...eachHoleThrows);
            let sum = eachHoleThrows.reduce((partialSum, a) => partialSum + a, 0);
            let average = sum / eachHoleThrows.length;
            average = parseInt(average.toFixed(2));
            console.log('hi', hiThrow, 'low', loThrow, 'average', average);
            seriesObj.name = 'Avg';
            seriesObj.data.push(hiThrow, loThrow, average);
            console.log('series obj:', seriesObj);
          } else {return};// end if
        };// end inner for loop
      };// end initial for loop
    } // end buildPlayerChartData



  } // end statistics


  statistics.init();
})();