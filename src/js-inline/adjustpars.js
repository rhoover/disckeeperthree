(() => {
  'use strict';

  const adjustPars = {

    init() { 
      //get course object
      async function getCourseObject() {
        const idbData = await localforage.getItem('courseInProgress');
        return idbData;
      };
      getCourseObject()
        .then(courseObject => {
          adjustPars.buildDOM(courseObject);
        });
      },
    
    buildDOM(courseObject) {
      let insertHere = document.querySelector('.adjustpars-list');
      let holesOutput = '';

      courseObject.holes.forEach(function(hole) {
        holesOutput += `
          <div class="adjustpars-item" rh-item="holeCard">
            <p class="adjustpars-item-hole">Hole: ${hole.holeNumber}</p>
            <p class="adjustpars-item-par">Par: <span rh-bind="par">${hole.par}</span></p>
            <p class="adjustpars-item-advice">Adjust Par:</p>
            <button class="adjustpars-item-increase" rh-model="increasePar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z"/></svg>
            </button>
            <button class="adjustpars-item-decrease" rh-model="decreasePar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"/></svg>
            </button>
          </div>
        ` //end template literal
      });

      insertHere.innerHTML = holesOutput;

      adjustPars.dataBinding(courseObject)
    },

    dataBinding(courseObject) { // so that clicking on a button adjusts the par number, both in the object and on the screen

      const holeCards = document.querySelectorAll('[rh-item]');
      const submitButton = document.querySelector('.adjustpars-submit');

      // it's all done in this loop so that the scope is confined to each item/hole
      for (let [index, hole] of holeCards.entries()) {
        const increaseButton = hole.querySelector('[rh-model="increasePar"]');
        const decreaseButton = hole.querySelector('[rh-model="decreasePar"]');
        const boundParNumber = hole.querySelector('[rh-bind]');

        // value is three as all holes have been assigned that figure for their par
        let cardScope = {
          value: 3
        };

        // modifying the par property number/value
        // nevermind that this is above the click events, it works
        // NB the new object created above, the button clicks modify the value property of that object, which is then applied to the displayed par figure for any given hole
        Object.defineProperty(cardScope, 'parNumber', {
          set: function(value) {
            //cardScope.value is incremented or decreased depending on the incoming value
            this.value += value;
            // this new number is changed to a string for display purposes
            boundParNumber.innerHTML = this.value.toString();
            // but left as a number to update the par property in the object
            courseObject.holes[index].par = this.value;
          }
        });

        increaseButton.addEventListener('click', event => {
          cardScope.parNumber = 1;
        });
        decreaseButton.addEventListener('click', event => {
          cardScope.parNumber = -1;
        });
      } // end for loop

      submitButton.addEventListener('click', event => {
        adjustPars.storage(courseObject);
      });
    }, // end databinding
    
    storage(courseObject) {
      let success = document.querySelector('.adjustpars-success');

      // get course list
      async function getCourselist() {
        const idbData = await localforage.getItem('courseList');
        return idbData;
      };
      getCourselist()
        .then(listArray => {
          if (listArray == null) { // if courselist does not exist
            listArray = [];
            listArray.push(courseObject);
          } else { // but if it does exist
            listArray.push(courseObject);
          }

          // and whatever the case, store the course in the iDB
          localforage.setItem('courseList', listArray);
          localforage.removeItem('courseInProgress');

          //some UI assistance on our way out the door
          success.classList.add('createcourse-success-good');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        });
    }

  };


  adjustPars.init();
})();