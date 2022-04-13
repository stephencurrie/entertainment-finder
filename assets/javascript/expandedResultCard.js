const mainCardEl = document.querySelector("#expandedInfoCard");
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get("imdbID");
const today = moment();
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
let movieFaveIndex = null;
let currentMovieInfo;

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

function createCard(movieData) {
  const parsedReleaseDate = moment(movieData.Released, "DD MMM YYYY").format(
    "MM/DD/YYYY"
  );
  let ratingsHTML = "";
  const newCard = document.createElement("div");
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
    ratingsHTML = "<p>Ratings: N/A</p>";
  }
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
  newCard.classList.add("favCard", "TBDclass");
  newCard.dataset.imdbid = movieData.imdbID;

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
  for (let i = 0; i < faveList.length; i++) {
    if (faveList[i].imdbID === imdbID) {
      movieFaveIndex = i;
      removeBtnEl.innerText = "Remove from Favorites";
      break;
    }
  }
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
  //   determines if the target has the rmvFavBtn class and runs the appropriate function if so
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
