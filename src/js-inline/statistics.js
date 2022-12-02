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
          if (!data) {
            statistics.noRounds(data);
          } else {
            statistics.selectBox(data);
          }
        });
    }, // end init

    noRounds(roundsData) {
      if (roundsData == null) {
        let roundsWarning = document.querySelector('.statistics');
        let selectBox = document.getElementById('courses');
        let holeChart = document.getElementById('holeData');
        let roundChart = document.getElementById('roundData');

        selectBox.remove();
        holeChart.remove();
        roundChart.remove();

        let warningOutput = "";

        warningOutput += `
          <p class="statistics-warning">You don't have any rounds saved yet,</p>
          <a href="roundsetup.html" class="statistics-warning-link">Go ahead and start one!  ➤</a>
        `;
        roundsWarning.innerHTML += warningOutput;
      }
    },

    selectBox(incomingRoundsData) {

      //build remaining selectbox of round courses
      let selectedCourseName = "";
      let selectElement = document.querySelector('#courses');
      let selectOutput = "";
      //remove duplicate courses merely for selectbox purposes
      let uniqueArray = [...new Map(incomingRoundsData.map(v => [v.courseID, v])).values()];
      //build options
      uniqueArray.forEach(function(round) {
        selectOutput += `<option value=${round.courseID}>${round.course}</option>`;
      });
      selectElement.innerHTML += selectOutput;

      selectElement.addEventListener('change', function(event) {
        let option = event.target.options[event.target.selectedIndex];
        selectedCourseName = option.text;
        statistics.buildCourseData(incomingRoundsData, selectedCourseName);
      });

    },// end selectBox

    buildCourseData(incomingRoundsData, selectedCourseName) {
      let courseData = [];
      incomingRoundsData.forEach(round => {
        if (round.course == selectedCourseName) {
          courseData.push(round);
        }
      });
      statistics.filterThrowsData(courseData, selectedCourseName);
      statistics.buildRoundsChartData(courseData, selectedCourseName);
    },// end buildCourseData

    filterThrowsData(courseData, selectedCourseName) {
      let playerHoles = [];
      let numberOfRounds = courseData.length;
      courseData.forEach(course => {
        course.players.forEach(player => {
          if (player.primary) {
            playerHoles.push(player.holes);
          }
        });
      });
      statistics.buildThrowsChartData(playerHoles, selectedCourseName, numberOfRounds); 
    },// end filterThrowsData

    buildThrowsChartData(incomingPlayerHoles, selectedCourseName, numberOfRounds) {

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

      //filtering out just the throws for each hole for each round
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
      seriesArray.push(loScoreObj, hiScoreObj, avgScoreObj);

      statistics.renderThrowsChart(holeNumber, seriesArray, selectedCourseName, numberOfRounds);
    }, // end buildThrowsChartData

    buildRoundsChartData(courseData, selectedCourseName) {
      console.table(courseData);
      //declaring all the things
      let roundLength = courseData.length;
      let roundDate = [];
      let scoresObj = {};
      let throwsObj = {};
      scoresObj.name = 'Round Score';
      throwsObj.name = 'Round Throws';
      scoresObj.data = [];
      throwsObj.data = [];
      let seriesArray = [];

      //creating the "categories" array which is the dates down the left side of the chart
      courseData.forEach(round => {
        roundDate.push(round.roundDate);
      });

      //bunging into each opject for the highcharts series array
      for (let i = 0; i < courseData.length; i++) {
          scoresObj.data.push(courseData[i].players[0].finalScore);
          throwsObj.data.push(courseData[i].players[0].finalThrows);
      };
      seriesArray.push(scoresObj, throwsObj);

      statistics.renderRoundScoresChart(seriesArray, roundDate, selectedCourseName, roundLength);
    },

    renderThrowsChart(incomingHoleName, incomingSeriesData, selectedCourseName, numberOfRounds) {

      //https://www.highcharts.com/demo/bar-basic/grid-light
      Highcharts.chart('holeData', {
      chart: {
        type: 'bar',
        height: 800,
        style: {
          fontFamily: 'Quicksand'
        }
      },
      title: {
        text: selectedCourseName,
        align: 'left'
      },
      subtitle: {
        text: `<p>Hi/Low/Avg Throws By Hole over ${numberOfRounds} Rounds</p>`,
        align: 'left'
      },
      xAxis: {
        //rh: holes-name array will go here
        categories: incomingHoleName,
        gridLineWidth: 1,
    
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        gridLineWidth: 1,
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
        x: 0,
        y: 0,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false
      },
      series: incomingSeriesData
      });// end Highcharts
    }, //end renderThrowsChart

    renderRoundScoresChart (seriesArray, roundDate, selectedCourseName, roundLength) {
      Highcharts.chart('roundData', {
      chart: {
        type: 'bar',
        height: 800,
        style: {
          fontFamily: 'Quicksand'
        }
      },
      title: {
        text: selectedCourseName,
        align: 'left'
      },
      subtitle: {
        text: `<p>Final Scores And Throws over ${roundLength} Rounds</p>`,
        align: 'left'
      },
      xAxis: {
        //rh: holes-name array will go here
        categories: roundDate,
        gridLineWidth: 1,
    
        title: {
          text: null
        }
      },
      yAxis: {
        min: -20,
        gridLineWidth: 1,
        title: {
          text: 'Round Results',
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
        x: 0,
        y: 0,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false
      },
      series: seriesArray
      });// end Highcharts}
    }



  } // end statistics


  statistics.init();
})();