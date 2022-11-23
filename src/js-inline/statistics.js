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
      Highcharts.chart('holeData', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Waterbury'
      },
      subtitle: {
        text: '<p>High - Low - Average Throws By Hole</p>'
      },
      xAxis: {
        //rh: holes-name array will go here
        categories: incomingHoleName, 
    
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Throws',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: 'score'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: incomingSeriesData
      });// end Highcharts
    } //end renderChart



  } // end statistics


  statistics.init();
})();