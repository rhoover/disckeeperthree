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
        //     name: 'Hi Score',
        //      18 data numbers in each array will be hi, low, average for each hole, aka 18 objects to correspond to 18 holes from categories
        //     data: [-631, 727, 3202, 721, 26]
        //   }, {
        //     name: 'Lo Score',
        //     data: [814, 841, 3714, 726, 31]
        //   }, {
        //     name: 'Avg Score',
        //     data: [1044, -644, 4170, 735, 40]
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

      //declaring all the things
      let holeNumber = [];
      let holeThrows = [];
      let eachRound;
      let seriesArray = [];
      let hiScoreObj = {};
      let loScoreObj = {};
      let avgScoreObj = {};
      let hiThrow;
      let loThrow;
      let sum;
      let averageThrow
      hiScoreObj.name = 'Hi Score';
      loScoreObj.name = 'Lo Score';
      avgScoreObj.name = 'Average';
      hiScoreObj.data = [];
      loScoreObj.data = [];
      avgScoreObj.data = [];

      //creating the 'categories' data for highcharts, which is the hole name down the left of the chart containing the hi-lo-average for each hole
      incomingPlayerHoles[0].forEach(round => {
        let holeName = 'Hole' + '-' + round.holeNumber;
        holeNumber.push(holeName);
      });

      //filtereing out just the throws for each hole for each round
      incomingPlayerHoles.forEach((round, index) => {
        eachRound = round.map((currentRound, i) => currentRound.throws);
        holeThrows.push(eachRound);
      });

      //https://stackoverflow.com/questions/7848004/get-column-from-a-two-dimensional-array
      for (let i = 0; i < holeThrows.length; i++) {
        for (let j = 0; j < holeThrows[i].length; j++) {
          // limiting to just the first round as the table collects up all the rounds...
          if (i == 0) {
            //...and this collects the column containg all the rounds for each hole.
            let eachHoleThrows = holeThrows.map(d => d[j]);
            //filtering for hi-lo-average
            hiThrow = Math.max(...eachHoleThrows);
            loThrow = Math.min(...eachHoleThrows);
            sum = eachHoleThrows.reduce((partialSum, a) => partialSum + a, 0);
            averageThrow = sum / eachHoleThrows.length;
            averageThrow = Math.round( averageThrow * 1e2 ) / 1e2;;
            //bunging into each object for the highcharts series array
            hiScoreObj.data.push(hiThrow);
            loScoreObj.data.push(loThrow);
            avgScoreObj.data.push(averageThrow);
          };// end if
        };// end inner for loop
      };// end initial for loop
      //and finally bunging into the highcharts series data array
      seriesArray.push(hiScoreObj, loScoreObj, avgScoreObj);

      statistics.renderChart(holeNumber, seriesArray);
    }, // end buildPlayerChartData

    renderChart(incomingHoleName, incomingSeriesData) {
      console.log(incomingHoleName, incomingSeriesData);
    }



  } // end statistics


  statistics.init();
})();