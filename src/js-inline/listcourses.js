(function() {
'use strict';

const listcourses = {

  init() {

    // get course list
    async function getCourses() {
      const coursesFetch = await localforage.getItem('courseList');
      const roundsFetch = await localforage.getItem('savedRounds');
      return [coursesFetch, roundsFetch];
    };
    getCourses()
      .then(fetchedData => {
        listcourses.buildListForDOM(fetchedData[0], fetchedData[1]);
      });

    // fix to stop modals displaying on page load
    let modals = document.querySelectorAll('[style="visibility:hidden;"]');
      setTimeout(() => {
        modals.forEach(function(modal) {
          modal.removeAttribute('style');
        });
      }, 2000);
    },//end init

    buildListForDOM(fetchedCourses, fetchedRounds) {
      let coursesList = document.querySelector('.list-courses-items');
      let coursesOutput = "";

      fetchedCourses.forEach(course => {
        
        coursesOutput += `
          <div class="list-courses-item" data-courseID="${course.courseID}">
            <p class="list-courses-item-name">${course.name}</p>
            <svg xmlns="http://www.w3.org/2000/svg" class="delete-me" viewbox="0 0 875 1000" width="27" height="50" >
              <path d="M0 281.296v-68.355q1.953-37.107 29.295-62.496t64.449-25.389h93.744V93.808q0-39.06 27.342-66.402T281.232.064h312.48q39.06 0 66.402 27.342t27.342 66.402v31.248H781.2q37.107 0 64.449 25.389t29.295 62.496v68.355q0 25.389-18.553 43.943t-43.943 18.553v531.216q0 52.731-36.13 88.862T687.456 1000H187.488q-52.731 0-88.862-36.13t-36.13-88.862V343.792q-25.389 0-43.943-18.553T0 281.296zm62.496 0h749.952V218.8q0-13.671-8.789-22.46t-22.46-8.789H93.743q-13.671 0-22.46 8.789t-8.789 22.46v62.496zm62.496 593.712q0 25.389 18.553 43.943t43.943 18.553h499.968q25.389 0 43.943-18.553t18.553-43.943V343.792h-624.96v531.216zm62.496-31.248V437.536q0-13.671 8.789-22.46t22.46-8.789h62.496q13.671 0 22.46 8.789t8.789 22.46V843.76q0 13.671-8.789 22.46t-22.46 8.789h-62.496q-13.671 0-22.46-8.789t-8.789-22.46zm31.248 0h62.496V437.536h-62.496V843.76zm31.248-718.704H624.96V93.808q0-13.671-8.789-22.46t-22.46-8.789h-312.48q-13.671 0-22.46 8.789t-8.789 22.46v31.248zM374.976 843.76V437.536q0-13.671 8.789-22.46t22.46-8.789h62.496q13.671 0 22.46 8.789t8.789 22.46V843.76q0 13.671-8.789 22.46t-22.46 8.789h-62.496q-13.671 0-22.46-8.789t-8.789-22.46zm31.248 0h62.496V437.536h-62.496V843.76zm156.24 0V437.536q0-13.671 8.789-22.46t22.46-8.789h62.496q13.671 0 22.46 8.789t8.789 22.46V843.76q0 13.671-8.789 22.46t-22.46 8.789h-62.496q-13.671 0-22.46-8.789t-8.789-22.46zm31.248 0h62.496V437.536h-62.496V843.76z"/>
            </svg>
            <p class="list-courses-item-delete">Delete Course</p>
          </div>
        `
      });

      coursesList.innerHTML = coursesOutput;

      listcourses.deleteCourse(fetchedCourses, fetchedRounds);
    
    }, //end buildListForDOM

    deleteCourse(fetchedCourses, fetchedRounds) {
      console.log(fetchedRounds);
      //declare all the things
      let courseList = document.querySelector('.list-courses');
      let clickedCourseID = "";

      //clicking the trashcan
      courseList.addEventListener('click', event => {
        let target = event.target.closest('.list-courses-item');
        //which course was clicked
        clickedCourseID = target.getAttribute('data-courseid');

        //are there saved rounds?
        if (fetchedRounds == null) { //if there aren't
          //remove course from DOM
          target.remove();
  
          //remove from courses array
          let indexOfCourse = fetchedCourses.findIndex(course => {
            return course.courseID === clickedCourseID;
          });
          fetchedCourses.splice(indexOfCourse, 1);
  
          //save modifued courses array
          localforage.setItem('courseList', fetchedCourses);
          
        } else { //if there are
          document.querySelector('.list-courses-modal').classList.add('list-courses-modal-open');
          let clickedCourseObj = fetchedCourses.find(x => x.courseID === clickedCourseID);
          let insertCourseName = document.querySelector('.list-courses-modal-warning-name');
          insertCourseName.innerHTML = clickedCourseObj.name;
        }
      });
    }// end deleteCourse

}

listcourses.init()
})();