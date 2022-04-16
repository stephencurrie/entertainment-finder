const mainCardEl = document.querySelector("#expandedInfoCard");
// pulls the search parameter, which will be used to make an API call to the omdb API
const urlParams = new URLSearchParams(window.location.search);
const tmdbID = urlParams.get("tmdbID");
let imdbID = "";
const today = moment();
// used to interact with the locally stored favorites list
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];

let currentMovieInfo;
const tmdbBaseURL = "https://api.themoviedb.org/3/movie/";
const tmdbApiKey = "1288fee4b00de870e735f788ed6723bc";

function getImdbID() {
  fetch(tmdbBaseURL + tmdbID + "?api_key=" + tmdbApiKey).then(function (
    response
  ) {
    if (response.ok) {
      response.json().then(function (tmdbMovieData) {
        getMovieData(tmdbMovieData);
      });
    } else {
      //   if we use this in the final code we'll need to change this, as the ACs say we can't use alerts
    }
  });
}
// performs an API call using the URL parameter established earlier
function getMovieData(tmdbMovieData) {
  imdbID = tmdbMovieData.imdb_id;
  var requestUrl =
    `http://www.omdbapi.com/?i=` + imdbID + `&plot=full&apikey=cf7767a2`;

  fetch(requestUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (movieData) {
        currentMovieInfo = movieData;
        createCard(movieData);
      });
    } else {
      mainCardEl.innerHTML = "<h1>Error loading resource.</h1>";
    }
  });
}

// creates card using info returned by the API call
function createCard(movieData) {
  const parsedReleaseDate = moment(movieData.Released, "DD MMM YYYY").format(
    "MM/DD/YYYY"
  );
  const newCard = document.createElement("div");

  // the ratings array is of variable length, so I had to build it using a loop
  let ratingsHTML = "";
  if (movieData.Ratings.length > 0) {
    for (let i = 0; i < movieData.Ratings.length; i++) {
      ratingsHTML +=
        `<p>` +
        movieData.Ratings[i].Source +
        ` Rating: ` +
        movieData.Ratings[i].Value +
        `</p>`;
    }
  } else {
    // default if there are no ratings yet, which is common for movies that haven't been released
    ratingsHTML = "<p>Ratings: N/A</p>";
  }
  // this creates a new card and fills it with the desired information
  newCard.innerHTML =
    `<div><h2 class="">` +
    movieData.Title +
    `</h2><button class="rmvFavBtn" data-state = 0 data-tmdbid="` +
    tmdbID +
    `">Add to Favorites</button><p>Runtime: ` +
    movieData.Runtime +
    `</p><p>Release Date: ` +
    parsedReleaseDate +
    `</p><p>Genre: ` +
    movieData.Genre +
    `</p><p>Rating (MPAA): ` +
    movieData.Rated +
    `</p><p>Country: ` +
    movieData.Country +
    `</p><p>Languages: ` +
    movieData.Language +
    `</p><p>Plot: ` +
    movieData.Plot +
    `</p><p>Top Billed Cast: ` +
    movieData.Actors +
    `</p><p>Director(s): ` +
    movieData.Director +
    `</p><p>Writer(s): ` +
    movieData.Writer +
    `</p><p>Awards: ` +
    movieData.Awards +
    `</p>` +
    ratingsHTML +
    `</p></div><section><img class="" src="` +
    movieData.Poster +
    `"></img></section>`;
  newCard.classList.add("favCard");
  mainCardEl.append(newCard);
  // decides whether or not to add a button to make a calendar event
  // if (today.isBefore(parsedReleaseDate)) {
  //   newCard.classList.add("upcomingCard");
  //   const calendarEvtBtn = document.createElement("button");
  //   calendarEvtBtn.innerText = "Create a Calendar Event";
  //   calendarEvtBtn.classList.add("calendarEvtBtn");
  //   newCard.append(calendarEvtBtn);
  //   mainCardEl.append(newCard);
  // } else {
  //   newCard.classList.add("alreadyReleasedCard");
  //   mainCardEl.append(newCard);
  // }
  // determines the position of the currently displayed movie in the favorites, and if it's not present in the favorites it leave the button's innerText as "Add to favorites"
  const removeBtnEl = document.querySelector(".rmvFavBtn");
  if (faveList.indexOf(removeBtnEl.dataset.tmdbid) !== -1) {
    removeBtnEl.dataset.state = 1;
    removeBtnEl.innerText = "Remove from Favorites";
  }
}
getImdbID();

function rmvBtnHandler(target) {
  if (target.dataset.state === "0") {
    target.innerText = "Remove from Favorites";
    target.dataset.state = 1;
    faveList.push(target.dataset.tmdbid);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  }
  // decides whether the movie is in faveList and adds or removes it
  else if (target.dataset.state === "1") {
     target.innerText = "Add to Favorites";
    target.dataset.state = 0;
    faveList.splice(faveList.indexOf(target.dataset.tmdbid), 1);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  }
}

mainCardEl.addEventListener("click", function (event) {
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
  const removeBtnEl = document.querySelectorAll(".rmvFavBtn");
  removeBtnEl.forEach((element) => {
    if (faveList.indexOf(element.dataset.tmdbid) !== -1) {
      console.log("we here in datastate 1");
      element.dataset.state = 1;
      element.innerText = "Remove from Favorites";
    } else {
      console.log("we here in datastate 1");
      element.dataset.state = 0;
      element.innerText = "Add to Favorites";
    }
  });
});
