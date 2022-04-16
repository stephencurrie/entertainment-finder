const upcomingCardContainerEl = document.querySelector(
  "#upcomingCardContainer"
);
const alreadyReleasedCardContainerEl = document.querySelector(
  "#alreadyReleasedCardContainer"
);
const mainEl = document.querySelector("main");
const tmdbBaseURL = "https://api.themoviedb.org/3/movie/";
const tmdbApiKey = "1288fee4b00de870e735f788ed6723bc";

// This pulls the favorites list from local storage, or if no favelist exists yet it sets it to an empty array
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
let faveListDataArray = [];

function fetchFaveData() {
  faveListDataArray = [];
  faveList.forEach((element) => {
    fetch(tmdbBaseURL + element + "?api_key=" + tmdbApiKey).then(function (
      response
    ) {
      if (response.ok) {
        response.json().then(function (faveData) {
          faveListDataArray.push(faveData);
          if (faveList.length === faveListDataArray.length) {
            faveListDataArray.sort((a, b) => {
              return moment(a.release_date) - moment(b.release_date);
            });

            populateAllCards();
          }
        });
      } else {
        //   if we use this in the final code we'll need to change this, as the ACs say we can't use alerts
        alert("Connection Error while generating genres");
      }
    });
  });
}

// this sorts the movies in ascending order to assist the user in their main goal: viewing the closest upcoming favorites
// moment is used to convert the date into a sequential format, so they can be compared and sorted

const today = moment();
// this function does the heavy lifting of the page, clearing the HTML and using faveList to create all the cards
function populateAllCards() {
  upcomingCardContainerEl.innerHTML = "";
  alreadyReleasedCardContainerEl.innerHTML = "";

  // iterates through all movie IDs in the faveList array and does an API call using those movie IDs in the URL,
  // then uses the displayCard function to build and append the cards
  faveListDataArray.forEach((element) => {
    const parsedReleaseDate = moment(
      element.release_date,
      "DD MMM YYYY"
    ).format("MM/DD/YYYY");
    let releaseDateDisplayString = "";
    if (today.isBefore(parsedReleaseDate)) {
      releaseDateDisplayString =
        parsedReleaseDate +
        ` - Days Remaining: ` +
        (-today.diff(parsedReleaseDate, "days") + 1);
    } else {
      releaseDateDisplayString = parsedReleaseDate;
    }
    let genresHTMLString = element.genres[0].name;
    for (let i = 1; i < element.genres.length; i++) {
      genresHTMLString += ", " + element.genres[i].name;
    }
    let newCard = document.createElement("div");
    newCard.innerHTML =
      // Movie Info
      `<div><a class="title is-large" href = "expandedResultCard.html?tmdbID=` +
      element.id +
      `">` +
      element.title +
      `</a>
      <p>Release Date: ` +
      releaseDateDisplayString +
      `</p>
      <p>Genre(s): ` +
      genresHTMLString +
      `</p>
      <p>Plot: ` +
      element.overview +
      `</p>
      <button class="rmvFavBtn" data-tmdbid="` +
      element.id +
      `">Remove</button></div>` +
      // Poster
      // find the row class in the framework and use it for these two
      `<section class="imgClass"> <img class="" src="http://image.tmdb.org/t/p/w185` +
      element.poster_path +
      `"></img></section>`;

    newCard.classList.add("favCard");
    newCard.dataset.tmdbid = element.id;

    if (today.isBefore(parsedReleaseDate)) {
      newCard.classList.add("upcomingCard");
      const calendarEvtBtn = document.createElement("button");
      calendarEvtBtn.innerText = "Create a Calendar Event";
      calendarEvtBtn.classList.add("calendarEvtBtn");
      newCard.append(calendarEvtBtn);
      upcomingCardContainerEl.append(newCard);
    } else {
      newCard.classList.add("alreadyReleasedCard");
      alreadyReleasedCardContainerEl.append(newCard);
    }
  });
}

function initialize() {
  if (faveList.length > 0) {
    fetchFaveData();
  } else {
    upcomingCardContainerEl.innerText =
      "Nothing here yet! Try searching for new favorites using the search tool!";
    alreadyReleasedCardContainerEl.innerText =
      "Nothing here yet! Try searching for new favorites using the search tool!";
  }
}
function rmvBtnHandler(target) {
  if (faveList.indexOf(target.dataset.tmdbid) !== -1)
    faveList.splice(faveList.indexOf(target.dataset.tmdbid), 1);
  localStorage.setItem("favorites", JSON.stringify(faveList));
  initialize();
}

// event listener on main to help us handle the buttons that were created in the displayCard function
mainEl.addEventListener("click", function (event) {
  event.stopPropagation;
  const target = event.target;
  //   determines if the target has the rmvFavBtn class and runs the appropriate function if so
  if (target.classList.contains("rmvFavBtn")) {
    rmvBtnHandler(target);
  }
  //   need to add an if function into this listener that references the "create calendar event" classes
});

// this eventListener will rerun the initializing functions when the user navigates back to it; this accounts for the user adding more favorites and
// coming back to this page.
window.addEventListener("focus", function () {
  faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
  initialize();
});

// var test1El = document.querySelector("#test1");
// var test2El = document.querySelector("#test2");
// var test3El = document.querySelector("#test3");
// var test4El = document.querySelector("#test4");

// test1El.textContent = Release;
// test2El.textContent = ;
// test3El.textContent = ;
// test4El.textContent = ;
