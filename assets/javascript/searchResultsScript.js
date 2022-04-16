// var form = document.querySelector('#form')
// var searchBarInput = document.querySelector("#searchBarInput");
// var resultCardContainer= document.querySelector("#resultCardContainer");

// // function to get the user input. Displays an alert if no input
// var formSumbitHandler = function(event){
//     // prevent the form form autosubmitting
//     event.preventDefault();

//     var searchBarInput = document.querySelector('#searchBarInput').value.trim()
//     console.log(searchBarInput);

//     fetchMovies(searchBarInput);
// }

// form.addEventListener('submit', formSumbitHandler);

// // let url = 'https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&language=en-US&page=1&include_adult=false'
// // fetch func
// let ApiKey = '1288fee4b00de870e735f788ed6723bc'

// function fetchMovies (movie) {
//  let url = `https://cors-anywhere.herokuapp.com/https://api.themoviedb.org/3/movie/550?api_key=1288fee4b00de870e735f788ed6723bc`

// //   fetch functionality to pull the API info
// fetch(url)
// .then(function (response) {
//     if (response.ok) {
//       response.json()
//       .then(function (movieData) {
//         console.log(movieData);
//       })
//     } else {
//         console.log("404 error");
// // need to inform user that there's a 404 error if they get to this else
//     }
//   });
// }

// // function for each movie or each section. for each move, do the following before displaying
// function movies (movie) {
//     let li = document.creatElement('li'),
//          img = document.createElement('img'),
//          span = document.createElement('span');

//          img.src = movie.picture.small;

//          span.innerHTML = `${movie.name} ${movie.cast}`;

//         document.body.appendChild(li)
//         document.body.appendChild(img)
//         document.body.appendChild(span)
// }

// .catch(function(error){
//     console.log(JSON.stringify(error));
// })

// this was scrapped due to time concerns
// function fetchImdbIDs(tmdbData) {
//   var tmdbIDList = [];
// console.log(tmdbData)
//   //for each function to make an array of tmdbID from the result
//   for (var i = 0; i < tmdbData.results.length; i++) {
//     tmdbIDList.push(tmdbData.results[i].id);
//   }
//   imdbIDList = [];
//   //for each function to convert tmdb ID to imdb ID and collect in an array
//   for (var i = 0; i < tmdbIDList.length; i++) {
//     url =
//       "https://api.themoviedb.org/3/movie/" +
//       tmdbIDList[i] +
//       "?api_key=" +
//       tmdbApiKey;
//     fetch(url).then(function (response) {
//       if (response.ok) {
//         response.json().then(function (data) {
//           imdbIDList.push(data.imdb_id);
//           if (imdbIDList.length === tmdbIDList.length) {
//             getMovieData();
//           }
//         });
//       }
//     });
//   }
// }

// This was scrapped due to time concerns
// function getMovieData() {
//   let omdbDataArray = [];
//   imdbIDList.forEach((element) => {
//     console.log(imdbIDList.length);
//     const omdbURL = omdbBaseURL + "i=" + element + "&apikey=" + omdbAPIKey;

//     fetch(omdbURL).then(function (response) {
//       if (response.ok) {
//         response.json().then(function (omdbData) {
//           omdbDataArray.push(omdbData);
//           if (omdbDataArray.length === imdbIDList.length) {
//             console.log(omdbDataArray);
//             displayCards(omdbDataArray);
//           }
//         });
//       } else {
//         // Fill in later?
//       }
//     });
//   });
// }

let imdbID;
const resultCardContainerEl = document.querySelector("#resultCardContainer");
const genreSelectEl = document.querySelector("#genreSelect");
const searchBtnEl = document.querySelector("#searchBtn");
const yearInputEl = document.querySelector("#yearInput");
const ratingInputEl = document.querySelector("#ratingInput");
const peopleInputEl = document.querySelector("#peopleInput");
const runtimeInputMinEl = document.querySelector("#runtimeInputMin");
const runtimeInputMaxEl = document.querySelector("#runtimeInputMax");
const searchParamSelectorsEls = document.querySelectorAll(
  ".searchParamSelectors"
);
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
  console.log(tmdbData);
  resultCardContainerEl.innerHTML = "";
  tmdbData.results.forEach((element) => {
    parsedReleaseDate = moment(element.release_date, "YYYY-MM-DD").format(
      "MM/DD/YYYY"
    );
    // this creates a new card and fills it with the desired information
    const newCard = document.createElement("div");

    newCard.innerHTML =
      `<h3 class="card-header-title">` +
      element.title +
      `</h3><button class="rmvFavBtn" data-state=0 data-tmdbid="` +
      element.id +
      `">Add to Favorites</button><img src="http://image.tmdb.org/t/p/w185` +
      element.poster_path +
      `"></img><p>Release Date: ` +
      parsedReleaseDate +
      `</p><p>Plot: ` +
      element.overview +
      `</p><p>TMDB Rating: ` +
      element.vote_average +
      `</p>`;
    newCard.classList.add("favCard");
    resultCardContainerEl.append(newCard);
    // decides whether or not to add a button to make a calendar event. commented out for now
    // if (today.isBefore(parsedReleaseDate)) {
    //   newCard.classList.add("upcomingCard");
    //   const calendarEvtBtn = document.createElement("button");
    //   calendarEvtBtn.innerText = "Create a Calendar Event";
    //   calendarEvtBtn.classList.add("calendarEvtBtn");
    //   newCard.append(calendarEvtBtn);
    //   resultCardContainerEl.append(newCard);
    // } else {
    //   newCard.classList.add("alreadyReleasedCard");
    //   resultCardContainerEl.append(newCard);
    // }
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
  const removeBtnEl = document.querySelector(".rmvFavBtn");
  // determines the current position of the selected movie in the faveList array, or leaves it as null if it's not in the array
  if (target.dataset.state === "0") {
    console.log("We here");
    target.innerText = "Remove from Favorites";
    target.dataset.state = 1;
    faveList.push(target.dataset.tmdbid);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  }
  // decides whether the movie is in faveList and adds or removes it
  else if (target.dataset.state === "1") {
    removeBtnEl.innerText = "Add to Favorites";
    target.dataset.state = 0;
    faveList.splice(faveList.indexOf(target.dataset.tmdbid), 1);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  }
}

resultCardContainerEl.addEventListener("click", function (event) {
  event.stopPropagation;
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
  document.location.reload(true);
});

searchBtnEl.addEventListener("click", function () {
  determineParameters();
});

initGenreSelectCreation();
