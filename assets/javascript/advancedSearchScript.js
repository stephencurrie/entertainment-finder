const resultCardContainerEl = document.querySelector("#resultCardContainer");
const genreSelectEl = document.querySelector("#genreSelect");
const searchBtnEl = document.querySelector("#searchBtn");
const peopleInputEl = document.querySelector("#peopleInput");
const sortingInputEl = document.querySelector("#sortSelect");
const searchParamSelectorsEls = document.querySelectorAll(
  ".searchParamSelectors"
);
const tmdbBaseURL = "https://api.themoviedb.org/3/";
const tmdbApiKey = "1288fee4b00de870e735f788ed6723bc";
let genreListArray = [];
let searchParamsString = "";
let selectedGenreParam = "";
let peopleParam = "";
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
var burgerIcon = document.querySelector("#burger");
var navbarMenu = document.querySelector("#nav-links");

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
      resultCardContainerEl.innerHTML = "<h4>Error loading resource.</h4>";
    }
  });
}

// goes through all inputs and selects to create query strings that will eventually get concatenated into a URL for our API call
function determineParameters() {
  // resets all necessary strings
  searchParamsString = "";
  selectedGenreParam = "";
  peopleParam = "";
  let searchParamsArray = [];
  // this forEach decides if each input (aside from actor) has a value entered, then a combined query string is created from that
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
      }
    });
  } else {
    fetchMovies();
  }
}

// this function concatenates the base URL, api key, and our search params into one URL, which we then call to get our array of movie info
function fetchMovies() {
  let sortingParam = "";
  if (sortingInputEl.value !== "") {
    sortingParam = "&sort_by=" + sortingInputEl.value;
  }
  const tmdbURL =
    tmdbBaseURL +
    "discover/movie?api_key=" +
    tmdbApiKey +
    sortingParam +
    "&include_adult=false" +
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
      resultCardContainerEl.innerHTML = "<h4>Error loading resource.</h4>";
    }
  });
}

// the information from the API call is passed into this function to create cards for each one
function displayCards(tmdbData) {
  console.log(tmdbData);
  resultCardContainerEl.innerHTML = "";
  tmdbData.results.forEach((element) => {
    const parsedReleaseDate = moment(element.release_date, "YYYY-MM-DD").format(
      "MM/DD/YYYY"
    );
    console.log(element);
    // these for loops will look up the genre ids given in the tmdb object, and display the genre name related to those ids
    let genresHTMLString = "";
    if (element.genre_ids.length > 0) {
      for (let i = 0; i < genreListArray.length; i++) {
        if (element.genre_ids[0] === genreListArray[i].id)
          genresHTMLString = genreListArray[i].name;
      }
      for (let i = 1; i < element.genre_ids.length; i++) {
        for (let k = 0; k < genreListArray.length; k++) {
          if (element.genre_ids[i] === genreListArray[k].id)
            genresHTMLString += ", " + genreListArray[k].name;
        }
      }
    } else {
      genresHTMLString = "None listed";
    }
    // this creates a new card and fills it with the desired information
    const newCard = document.createElement("section");
    console.log(element.overview);
    newCard.innerHTML =
      `<section><a href = "expandedResultCard.html?tmdbID=` +
      element.id +
      `" target="_blank" rel="noopener noreferrer">` +
      element.title +
      `  </a><br><button class="rmvFavBtn button is-success" data-state=0 data-tmdbid="` +
      element.id +
      `">Add to Favorites</button><p>Release Date: ` +
      parsedReleaseDate +
      `</p><p>Genre(s): ` +
      genresHTMLString +
      `</p><p>Plot: ` +
      element.overview +
      `</p><p>TMDB Rating: ` +
      element.vote_average +
      `/10</p></section><figure><a href = "expandedResultCard.html?tmdbID=` +
      element.id +
      `" target="_blank" rel="noopener noreferrer"><img alt = "` +
      element.title +
      ` Poster" src="https://image.tmdb.org/t/p/w500` +
      element.poster_path +
      `" onerror="this.onerror=null;this.src='./assets/images/errorImage.jpg';"></img></a></figure>`;
    newCard.classList = "tile is-child notification is-warning resultCard";
    resultCardContainerEl.append(newCard);
  });

  // determines whether the TMDB ID is in favorites, and if it's not present in the favorites it leaves the button's innerText as "Add to favorites"
  const removeBtnEl = document.querySelectorAll(".rmvFavBtn");
  removeBtnEl.forEach((element) => {
    if (faveList.indexOf(element.dataset.tmdbid) !== -1) {
      element.dataset.state = 1;
      element.innerText = "Remove from Favorites";
      element.classList.remove("is-success")
      element.classList.add("is-danger")
    }
  });
}

// determines what state the button is in and reacts accordingly
function rmvBtnHandler(target) {
  if (target.dataset.state === "0") {
    target.innerText = "Remove from Favorites";
    target.classList.remove("is-success");
    target.classList.add("is-danger");
    target.dataset.state = 1;
    faveList.push(target.dataset.tmdbid);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  } else if (target.dataset.state === "1") {
    target.innerText = "Add to Favorites";
    target.classList.remove("is-danger");
    target.classList.add("is-success");
    target.dataset.state = 0;
    faveList.splice(faveList.indexOf(target.dataset.tmdbid), 1);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  }
}

// uses event delegation to add an eventlistener to the dynamically produced buttons
resultCardContainerEl.addEventListener("click", function (event) {
  event.stopPropagation();
  const target = event.target;
  //   determines if the target has the rmvFavBtn class and runs the rmvBtnHandler function if so
  if (target.classList.contains("rmvFavBtn")) {
    rmvBtnHandler(target);
  }
});

// this eventListener will reset favorites and favorite buttons; this accounts for the user adding the movie as a favorite and then
// tabbing back to this page. If this isn't done after adding favorites from another page
// the faveList array on this page could reset the localstorage to an earlier state
window.addEventListener("focus", function () {
  faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
  const removeBtnEl = document.querySelectorAll(".rmvFavBtn");
  removeBtnEl.forEach((element) => {
    if (faveList.indexOf(element.dataset.tmdbid) !== -1) {
      element.dataset.state = 1;
      element.innerText = "Remove from Favorites";
      element.classList.remove("is-success");
      element.classList.add("is-danger");
    } else {
      element.dataset.state = 0;
      element.innerText = "Add to Favorites";
      element.classList.remove("is-danger");
      element.classList.add("is-success");
    }
  });
});


searchBtnEl.addEventListener("click", function () {
  determineParameters();
});

// Creates Hamburger Menu
burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});

initGenreSelectCreation();
