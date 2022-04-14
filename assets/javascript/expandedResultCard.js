const mainCardEl = document.querySelector("#expandedInfoCard");
// pulls the search parameter, which will be used to make an API call to the omdb API
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get("imdbID");
const today = moment();
// used to interact with the locally stored favorites list
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
let movieFaveIndex = null;
let currentMovieInfo;

// performs an API call using the URL parameter established earlier
function getMovieData() {
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
  let ratingsHTML = "";
  const newCard = document.createElement("div");

  // the ratings array is of variable length, so I had to build it using a for loop
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
    `<h2>` +
    movieData.Title +
    `</h2><button class="rmvFavBtn" data-imdbid="` +
    movieData.imdbID +
    `">Add to Favorites</button><p>Runtime: ` +
    movieData.Runtime +
    `</p><img src="` +
    movieData.Poster +
    `"></img><p>Release Date: ` +
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
    `</p>`;
  newCard.classList.add("favCard");

  // decides whether or not to add a button to make a calendar event
  if (today.isBefore(parsedReleaseDate)) {
    newCard.classList.add("upcomingCard");
    const calendarEvtBtn = document.createElement("button");
    calendarEvtBtn.innerText = "Create a Calendar Event";
    calendarEvtBtn.classList.add("calendarEvtBtn");
    newCard.append(calendarEvtBtn);
    mainCardEl.append(newCard);
  } else {
    newCard.classList.add("alreadyReleasedCard");
    mainCardEl.append(newCard);
  }
// determines the position of the currently displayed movie in the favorites, and if it's not present in the favorites it leave the button's innerText as "Add to favorites"
  for (let i = 0; i < faveList.length; i++) {
    const removeBtnEl = document.querySelector(".rmvFavBtn");
    if (faveList[i].imdbID === imdbID) {
      movieFaveIndex = i;
      removeBtnEl.innerText = "Remove from Favorites";
      break;
    }
  }
}
getMovieData();


function rmvBtnHandler() {
  const removeBtnEl = document.querySelector(".rmvFavBtn");
  // determines the current position of the selected movie in the faveList array, or leaves it as null if it's not in the array
  for (let i = 0; i < faveList.length; i++) {
    if (faveList[i].imdbID === imdbID) {
      movieFaveIndex = i;
      removeBtnEl.innerText = "Remove from Favorites";
      break;
    }
  }
  // decides whether the movie is in faveList and adds or removes it
  if (movieFaveIndex === null) {
    faveList.push(currentMovieInfo);
    localStorage.setItem("favorites", JSON.stringify(faveList));
    removeBtnEl.innerText = "Remove from Favorites";
  } else if (movieFaveIndex !== null) {
    faveList.splice(movieFaveIndex, 1);
    localStorage.setItem("favorites", JSON.stringify(faveList));
    removeBtnEl.innerText = "Add to Favorites";
    movieFaveIndex = null;
  }
}

mainCardEl.addEventListener("click", function (event) {
  event.stopPropagation;
  const target = event.target;
  //   determines if the target has the rmvFavBtn class and runs the rmvBtnHandler function if so
  if (target.classList.contains("rmvFavBtn")) {
    rmvBtnHandler();
  }
  //   need to add an if function into this listener that references the "create calendar event" classes
});

// this eventListener will reload the page when the user navigates back to it; this accounts for the user adding the movie as a favorite and then
// tabbing back to this page. If it's not reloaded after adding favorites from the search page
// the present variables on this page could reset the localstorage to an earlier state
window.addEventListener("focus", function () {
  document.location.reload(true);
});
