let imdbID;
const resultCardContainerEl = document.querySelector("#resultCardContainer");
const genreSelectEl = document.querySelector("#genreSelect");
const searchBtnEl = document.querySelector("#searchBtn");
const yearInputEl = document.querySelector("#yearInput");
const ratingInputEl = document.querySelector("#ratingInput");
const peopleInputEl = document.querySelector("#peopleInput");
var burgerIcon = document.querySelector("#burger");
var navbarMenu = document.querySelector("#nav-links");
const runtimeInputMinEl = document.querySelector("#runtimeInputMin");
const runtimeInputMaxEl = document.querySelector("#runtimeInputMax");
const searchParamSelectorsEls = document.querySelectorAll(
  ".searchParamSelectors"
);

// Creates Hamburger Menu
burgerIcon.addEventListener('click', () => {

  navbarMenu.classList.toggle('is-active');
});




const tmdbBaseURL = "https://api.themoviedb.org/3/";
const tmdbApiKey = "1288fee4b00de870e735f788ed6723bc";
// const omdbBaseURL = " http://www.omdbapi.com/?";
// const omdbAPIKey = "cf7767a2";
let genreListArray = [];
let searchParamsString = "";
let selectedGenreParam = "";
let peopleParam = "";
var imdbIDList = [];
const today = moment();
let parsedReleaseDate;

let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
// Calls the tmdb API to generate a list of genres the user can select
function initGenreSelectCreation() {
  fetch(tmdbBaseURL + "genre/movie/list?api_key=" + tmdbApiKey).then(function (
    response
  ) {
    if (response.ok) {
      response.json().then(function (genreList) {
        genreListArray = genreList.genres;
        genreListArray.forEach((element) => {
          const newGenreOption = document.createElement("option");
          newGenreOption.innerText = element.name;
          // adds a data attribute equal to the number of the genre, this is what will actually get fed into the query, not the genre name
          newGenreOption.dataset.genreNumber = element.id;
          genreSelectEl.append(newGenreOption);
        });
      });
    } else {
      //   if we use this in the final code we'll need to change this, as the ACs say we can't use alerts
      alert("Connection Error while generating genres");
    }
  });
}

// goes through all inputs and selects to generate query strings for our main API call that will return the user's search results
function determineParameters() {
  // resets all necessary strings
  searchParamsString = "";
  selectedGenreParam = "";
  peopleParam = "";
  let searchParamsArray = [];
  // this forEach decides if each input (aside from actor) has a value entered, then creates a combined query string for all of them
  searchParamSelectorsEls.forEach((element) => {
    if (element.value !== "") {
      const newArrayValue = [element.dataset.parameter, element.value];
      searchParamsArray.push(newArrayValue);
    }
  });

  searchParamsString = "&" + new URLSearchParams(searchParamsArray).toString();
  // decides if a genre is selected, then creates a parameter for it
  if (genreSelectEl.value !== "") {
    genreListArray.forEach((element) => {
      if (element.name === genreSelectEl.value) {
        selectedGenreParam = "&with_genres=" + element.id;
      }
    });
  }

  // decides if the user typed an actor name, then calls the API to find that actor's ID, then creates a parameter for it in the main fetch
  if (peopleInputEl.value !== "") {
    const peopleQueryParam = new URLSearchParams([
      ["query", peopleInputEl.value],
    ]).toString();

    // this fetch will call the TMDB API to request the people IDs of the name the user typed
    fetch(
      tmdbBaseURL +
        "search/person?api_key=" +
        tmdbApiKey +
        "&" +
        peopleQueryParam
    ).then(function (response) {
      if (response.ok) {
        response.json().then(function (actorIDData) {
          // currently this only returns the first actor in the list; we should probably iterate through it and include all values, separated by commas. Read docs on searching by actor to be sure
          peopleParam = "&with_people=" + actorIDData.results[0].id;
          fetchMovies();
        });
      } else {
        // Fill in later?
      }
    });
  } else {
    fetchMovies();
  }
}

function fetchMovies() {
  let tmdbURL =
    tmdbBaseURL +
    "discover/movie?api_key=" +
    tmdbApiKey +
    // need to change this later to account for user-selected sorting
    "&sort_by=popularity.desc&include_adult=false" +
    searchParamsString +
    selectedGenreParam +
    peopleParam;
  // this is the main API call, this will search by all of the user's parameters and return an array of the 20 most popular movies that fit the params
  fetch(tmdbURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (tmdbData) {
        displayCards(tmdbData);
      });
    } else {
      // Fill in later?
    }
  });
}

function displayCards(tmdbData) {
  resultCardContainerEl.innerHTML = "";
  tmdbData.results.forEach((element) => {
    parsedReleaseDate = moment(element.release_date, "YYYY-MM-DD").format(
      "MM/DD/YYYY"
    );
    // this creates a new card and fills it with the desired information
    const newCard = document.createElement("div");
    newCard.innerHTML =
      `<div><a href = "expandedResultCard.html?tmdbID=` +
      element.id +
      `">` +
      element.title +
      `  </a><button class="rmvFavBtn" data-state=0 data-tmdbid="` +
      element.id +
      `">Add to Favorites</button><p>Release Date: ` +
      parsedReleaseDate +
      `</p><p>Plot: ` +
      element.overview +
      `</p><p>TMDB Rating: ` +
      element.vote_average +
      `</p></div><figure><img src="http://image.tmdb.org/t/p/w185` +
      element.poster_path +
      `"></img></figure>`;
    newCard.classList.add("favCard");
    resultCardContainerEl.append(newCard);
  });

  // determines the position of the movies in favorites, and if it's not present in the favorites it leaves the button's innerText as "Add to favorites"
  const removeBtnEl = document.querySelectorAll(".rmvFavBtn");
  removeBtnEl.forEach((element) => {
    if (faveList.indexOf(element.dataset.tmdbid) !== -1) {
      element.dataset.state = 1;
      element.innerText = "Remove from Favorites";
    }
  });
}

function rmvBtnHandler(target) {
  if (target.dataset.state === "0") {
    target.innerText = "Remove from Favorites";
    target.dataset.state = 1;
    faveList.push(target.dataset.tmdbid);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  } else if (target.dataset.state === "1") {
    target.innerText = "Add to Favorites";
    target.dataset.state = 0;
    faveList.splice(faveList.indexOf(target.dataset.tmdbid), 1);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  }
}

resultCardContainerEl.addEventListener("click", function (event) {
  event.stopPropagation();
  const target = event.target;
  //   determines if the target has the rmvFavBtn class and runs the rmvBtnHandler function if so
  if (target.classList.contains("rmvFavBtn")) {
    rmvBtnHandler(target);
  }
  //   need to add an if function into this listener that references the "create calendar event" classes
});

// this eventListener will reload the page when the user navigates back to it; this accounts for the user adding the movie as a favorite and then
// tabbing back to this page. If it's not reloaded after adding favorites from the search page
// the present variables on this page could reset the localstorage to an earlier state

window.addEventListener("focus", function () {
  faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
  const removeBtnEl = document.querySelectorAll(".rmvFavBtn");
  removeBtnEl.forEach((element) => {
    if (faveList.indexOf(element.dataset.tmdbid) !== -1) {
      console.log("we here 3");
      element.dataset.state = 1;
      element.innerText = "Remove from Favorites";
    } else {
      console.log("we here 4");
      element.dataset.state = 0;
      element.innerHTML = "Add to Favorites";
    }
  });
});

searchBtnEl.addEventListener("click", function () {
  determineParameters();
});

initGenreSelectCreation();
