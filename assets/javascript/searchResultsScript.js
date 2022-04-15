
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

let imdbID;
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
const omdbBaseURL = " http://www.omdbapi.com/?";
const omdbAPIKey = "cf7767a2";
let genreListArray = [];
let searchParamsString = "";
let selectedGenreParam = "";
let peopleParam = "";

// Calls the tmdb API to generate a list of genres the user can select
function initGenreSelectCreation() {
  fetch(tmdbBaseURL + "genre/movie/list?api_key=" + tmdbApiKey).then(function (
    response
  ) {
    if (response.ok) {
      response.json().then(function (genreList) {
        genreListArray = genreList.genres;
        genreList.genres.forEach((element) => {
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
  console.log(searchParamsArray);
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
          console.log(actorIDData);
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
  console.log(tmdbURL);
  // this is the main API call, this will search by all of the user's parameters and return an array of the 20 most popular movies that fit the params
  fetch(tmdbURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (tmdbData) {
        console.log(tmdbData);
        // fetchImdbIDs doesn't do anything yet, see comment in fetchImdbIDs
        fetchImdbIDs(tmdbData);
      });
    } else {
      // Fill in later?
    }
  });
}
function fetchImdbIDs(tmdbData) {
  // Need a function here to iterate through the tmdbData to make calls to the tmdb API, using tmdb IDs to return the imdb ID of each movie.
  // We assemble an array of imdb IDs of each returned movie, then we iterate through that array, using the imdbIDs to make an OMDB API call to get the fleshed out details
}

// not implemented yet. This is the OMDB api call that will return the most info; the reults of this will be what is displayed on the cards
function getMovieData() {
  imdbID = "TBD ID, probably an index of an array from fetchImdbIDs";
  const omdbURL =
    omdbBaseURL + "i=" + imdbID + "&plot=full&apikey=" + omdbAPIKey;

  fetch(omdbURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (omdbData) {
        console.log(omdbData);
      });
    } else {
      // Fill in later?
    }
  });
}

searchBtnEl.addEventListener("click", function () {
  determineParameters();
});

initGenreSelectCreation();