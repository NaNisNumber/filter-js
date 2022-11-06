"use strict";

const jobsEl = document.querySelector(".jobs");
const challengeEl = document.createElement("div");
const content = `Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank" >Frontend Mentor</a >. Coded by <a href="#">Sergiu</a>.`;
challengeEl.innerHTML = content;
challengeEl.classList.add("attribution");
jobsEl.insertAdjacentElement("afterend", challengeEl);

const DisplayData = async function (url) {
  const result = await fetch(url);
  return result;
};

DisplayData("/data.json")
  .then((res) => res.json())
  .then((jobsArr) => {
    const languagesArrays = [];

    jobsArr.forEach((job, j) => {
      const {
        id,
        company,
        logo,
        new: newJob,
        featured,
        position,
        role,
        level,
        postedAt,
        contract,
        location,
        languages,
      } = job;
      const el = document.createElement("div");
      el.setAttribute("class", "jobs__infos-container");
      const jobHtmlContent = `<div class="jobs__infos">
            <img class="jobs__img" alt="job img" src=${logo.slice(1)} />
            <div class="jobs__infos-inner-container">
              <div class="jobs__infos-details-row">
                <p class="jobs__infos-company">${company}</p>
              </div>
              <div class="jobs__infos-subdetails-container">
                <p class="jobs__postion">${position}</p>
                <div class="job__infos-subdetails">
                  <p class="job__infos-subdetail">${postedAt}</p>
                  <span></span>
                  <p class="job__infos-subdetail">${contract}</p>
                  <span></span>
                  <p class="job__infos-subdetail">${location}</p>
                </div> 
                <hr> 
              </div>
            </div>
          </div>
          <div id=${id} class="jobs__skills">
            <p class="jobs__skill">${role}</p>
            <p class="jobs__skill">${level}</p>
            
          </div>
          `;

      el.innerHTML = jobHtmlContent;

      jobsEl.append(el);

      const languageArray = [];

      languagesArrays.push(languageArray);

      for (let i = 0; i < languages.length; i++) {
        const languageEl = document.createElement("p");
        languageEl.setAttribute("class", "jobs__skill");
        languageEl.innerHTML = languages[i];
        languagesArrays[j].push(languageEl);
      }
    });
    return languagesArrays;
  })
  .then((languagesArrays) => {
    const jobSkillsElArr = document.querySelectorAll(".jobs__skills");
    for (let i = 0; i < jobSkillsElArr.length; i++) {
      const languageArray = languagesArrays[i];

      for (let j = 0; j < languageArray.length; j++) {
        jobSkillsElArr[i].append(languageArray[j]); // add language elements to every jobSkillsEl
      }
    }
    return jobSkillsElArr;
  })
  .then((jobSkillsElArr) => {
    let filterSettings = [];
    const skillElArr = [];
    let corespondentElementsToBeRemoved = [];
    let removeButtonsArr = [];

    const displayOnThisElement = document.querySelector(
      ".jobs__displayed-filters-container"
    );

    const displayClearBtnOnThis = document.querySelector(
      ".jobs__display-chosen-filters"
    );
    const clearBtnEl = document.createElement("btn");

    clearBtnEl.innerHTML = "Clear";
    clearBtnEl.classList.add("jobs__clear-btn");
    displayClearBtnOnThis.classList.add(
      "hide-displayed-filterSettings-container"
    );

    jobSkillsElArr.forEach((jobSkillElArr, i) => {
      const skillEl = jobSkillsElArr[i].children;
      skillElArr.push(skillEl);

      jobSkillElArr.addEventListener("click", function (e) {
        const filterSetting = e.target.innerHTML;
        displayOnThisElement.style.display = "flex";
        if (e.target.id) return;
        if (filterSettings.includes(filterSetting)) return;

        filterSettings.push(filterSetting);

        const displayFilterSetting = function () {
          displayClearBtnOnThis.classList.add(
            "show-displayed-filterSettings-container"
          );
          displayClearBtnOnThis.append(clearBtnEl);
          clearBtnEl.style.display = "inline-block";
          const elementToDisplay = document.createElement("li");
          elementToDisplay.setAttribute("class", "jobs__displayed-filter");
          elementToDisplay.innerHTML = `${filterSetting}<button><img src="/images/icon-remove.svg"></button> `;
          displayOnThisElement.append(elementToDisplay);
          corespondentElementsToBeRemoved.push(elementToDisplay);
          removeButtonsArr.push(elementToDisplay.children[0]);
        };

        displayFilterSetting();

        let filterSettingsWithoutNull = filterSettings.filter(
          (el) => el != null
        );

        let mediaQuery = window.matchMedia("(max-width: 1000px)");
        console.log(mediaQuery);

        const restoreToNormal = function () {
          clearBtnEl.addEventListener("click", () => {
            displayClearBtnOnThis.classList.remove(
              "show-displayed-filterSettings-container"
            );
            clearBtnEl.style.display = "none";
            corespondentElementsToBeRemoved.forEach((el) => el.remove());
            filterSettings = [];
            filterSettingsWithoutNull = [];
            removeButtonsArr = [];
            corespondentElementsToBeRemoved = [];
            hideOrDisplayTheElements("flex", true, filterSettingsWithoutNull);
            if (mediaQuery.matches) {
              hideOrDisplayTheElements(
                "block",
                true,
                filterSettingsWithoutNull
              );
            }
          });
        };
        restoreToNormal();
        hideOrDisplayTheElements("none", false, filterSettingsWithoutNull);

        const removeDisplayedFilterSetting = function () {
          for (let i = 0; i < removeButtonsArr.length; i++) {
            removeButtonsArr[i].addEventListener("click", function () {
              console.log(i);
              corespondentElementsToBeRemoved[i].remove();
              filterSettings.splice(i, 1, null);
              const filterSettingsWithoutNull = filterSettings.filter(
                (el) => el != null
              );

              hideOrDisplayTheElements("flex", true, filterSettingsWithoutNull);
              // it should display only the elements that are left on the filterSettings;
              if (mediaQuery.matches) {
                hideOrDisplayTheElements(
                  "block",
                  true,
                  filterSettingsWithoutNull
                );
              }
              if (filterSettingsWithoutNull.length === 0) {
                displayClearBtnOnThis.classList.remove(
                  "show-displayed-filterSettings-container"
                );

                clearBtnEl.style.display = "none";
              }
            });
          }
        };

        removeDisplayedFilterSetting();
      });
    });

    // Hide elements that don t correspond with the filter settings
    const jobsContainer = document.querySelectorAll(".jobs__infos-container");

    function hideOrDisplayTheElements(display, bool, cleanSettings) {
      for (let i = 0; i < skillElArr.length; i++) {
        const skillEl = skillElArr[i];
        let JobsSkillContentArray = [];

        for (let j = 0; j < skillEl.length; j++) {
          // check if all the values from the filterSettings array is not present on the jobs skills array, and if they do not exist remove the container element of all
          JobsSkillContentArray.push(skillEl[j].innerHTML);
        }

        const settingsExistInJobsSkillContentArray = cleanSettings.every(
          (jobSkill) => JobsSkillContentArray.includes(jobSkill)
        );

        // if settings don t exist in jobs elements then hide those elements
        // else let them be visible`
        if (settingsExistInJobsSkillContentArray === bool) {
          jobsContainer[i].style.display = display;
        }
      }
    }
  })

  .then(() => DisplayData("/data.json"))
  .then((res) => res.json())
  .then((jobsArr) => {
    const jobSkillsElArr = document.querySelectorAll(".jobs__skills"); // here you should append the tools Elements;

    jobsArr.forEach((jobObj, j) => {
      const { tools, featured, new: newJob } = jobObj;
      // itterate in tools and add every value of the array on the corespondent jobSkillSElArr;
      for (let i = 0; i < tools.length; i++) {
        const toolEl = document.createElement("p");
        toolEl.setAttribute("class", "jobs__skill");
        toolEl.innerHTML = tools[i];
        jobSkillsElArr[j].append(toolEl); // add tool elements to every jobSkillsEl
      }

      const displayNewOrFeaturedJob = function (
        content,
        featuredOrNewJob,
        styleClass
      ) {
        if (featuredOrNewJob) {
          const featuredOrNewEl = document.createElement("p");
          featuredOrNewEl.setAttribute("class", styleClass);
          featuredOrNewEl.innerHTML = content;
          document
            .querySelectorAll(".jobs__infos-details-row")
            [j].append(featuredOrNewEl);
        }
      };

      displayNewOrFeaturedJob("NEW", newJob, "jobs__infos-new");
      displayNewOrFeaturedJob("FEATURED", featured, "jobs__infos-featured");
    });
  });
