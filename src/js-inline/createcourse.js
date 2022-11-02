(() => {
  'use strict'

  const createNewCourse = {

    init() {
      let formEl = document.querySelector('.createcourse-form');

      //get course list
      async function getCourseList() {
        const idbData = await localforage.getItem('courseList');
        return idbData;
      };
      getCourseList()
        .then(listArray => {
          createNewCourse.setup(listArray, formEl);
        });
    },

    setup(list, formEl) {

      formEl.addEventListener('submit', event => {
        event.preventDefault();
        let whichButton = event.submitter;        
        const formData = new FormData(formEl);
        let courseObject = {
          name: formData.get('courseName'),
          length: parseInt(formData.get('holeradio'), 10)
        }
        createNewCourse.addCourseData(list, courseObject, whichButton, formEl);
      });
    },

    addCourseData(list, courseObject, whichButton, formEl) {
      let holesArray = [];

      holesArray.length = courseObject.length;
      for (let i = 0; i < holesArray.length; i++) {
        holesArray[i] = {
          holeNumber: 1 + i,
          par: 3,
          throws: 0,
          overUnder: 0,
          overUnderRound: 0,
          throwsRound: 0
        }
      };
      courseObject.holes = holesArray;
      courseObject.courseID = (+new Date).toString(36);
      courseObject.created = new Date().toLocaleDateString('en-US');

      createNewCourse.sortOutSituation(list, courseObject, whichButton, formEl);
    },

    sortOutSituation(list, courseObject, whichButton, formEl) {
      let success = document.querySelector('.createcourse-success');

      // pressed top button all par three course
      if (whichButton.getAttribute('value') === 'samepar') {
        
        if (list == null) { //course list does not exist in idb
          list = [];
          list.push(courseObject);
        } else { // the list does in fact exist as pulled from idb
          list.push(courseObject);
        };

        //some UI assistance
        success.classList.add('createcourse-success-good');
        
        localforage.setItem('courseList', list);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);

      } else {// else pressed bottom button to adjust par settings, on a different page
        
        localforage.setItem('courseInProgress', courseObject);
        success.classList.add('createcourse-success-good');
        setTimeout(() => {
          window.location.href = 'adjustpars.html';
        }, 1000);
      };
    }
  };

  createNewCourse.init();
})();