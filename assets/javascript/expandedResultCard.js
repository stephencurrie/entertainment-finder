const mainCardEl = document.querySelector("#expandedInfoCard");
// pulls the search parameter, which will be used to make an API call to the omdb API
const urlParams = new URLSearchParams(window.location.search);
const tmdbID = urlParams.get("tmdbID");
const today = moment();
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
const tmdbBaseURL = "https://api.themoviedb.org/3/movie/";
const tmdbApiKey = "1288fee4b00de870e735f788ed6723bc";
let posterPath = "";
var burgerIcon = document.querySelector("#burger");
var navbarMenu = document.querySelector("#nav-links");

// plugs the tmdbID we got from the tmdbID URL param into an api call to to get the imdb ID, which we then use for the next API call
function getImdbID() {
  fetch(tmdbBaseURL + tmdbID + "?api_key=" + tmdbApiKey).then(function (
    response
  ) {
    if (response.ok) {
      response.json().then(function (tmdbMovieData) {
        getMovieData(tmdbMovieData);
      });
    } else {
      mainCardEl.innerHTML = "<h2>Error loading resource.</h2>";
    }
  });
}

// performs an API call using the imdb ID we just obtained
function getMovieData(tmdbMovieData) {
  posterPath = tmdbMovieData.poster_path;
  const imdbID = tmdbMovieData.imdb_id;
  var requestUrl =
    `https://www.omdbapi.com/?i=` + imdbID + `&plot=full&apikey=cf7767a2`;
  // this calls the omdb API. the omdb api is preferable because it outputs quite a bit more information, which is
  // preferable for the expanded view
  fetch(requestUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (movieData) {
        createCard(movieData);
      });
    } else {
      mainCardEl.innerHTML = "<h2>Error loading resource.</h2>";
    }
  });
}

// creates card using info returned by the API call
function createCard(movieData) {
  if(movieData.Title ===undefined){
    mainCardEl.innerHTML = "<h2>Movie not found in expanded database.</h2>"
    return;
  }
  const parsedReleaseDate = moment(movieData.Released, "DD MMM YYYY").format(
    "MM/DD/YYYY"
  );
  const newCard = document.createElement("section");
  let genreHTML = "";
  console.log(movieData)
  if (movieData.Genres) {
    if (movieData.Genre.length > 0) {
      genreHTML = movieData.Genre;
    } else {
      genreHTML = "None listed.";
    }
  } else {
    genreHTML = "None listed.";
  }
  // the ratings array is of variable length and contents, so the html gets built with a loop
  let ratingsHTML = "";
  if (movieData.Ratings) {
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
  } else {
    // default if there are no ratings yet, which is common for movies that haven't been released
    ratingsHTML = "<p>Ratings: N/A</p>";
  }
  // this creates a new card and fills it with the desired information
  newCard.innerHTML =
    `<section><h2>` +
    movieData.Title +
    `</h2><button class="rmvFavBtn button is-success" data-state = 0 data-tmdbid="` +
    tmdbID +
    `">Add to Favorites</button><p><strong>Runtime:</strong> ` +
    movieData.Runtime +
    `</p><p><strong>Release Date:</strong> ` +
    parsedReleaseDate +
    `</p><p><strong>Genre:</strong> ` +
    genreHTML +
    `</p><p><stong>Rating (MPAA):</strong> ` +
    movieData.Rated +
    `</p><p><strong>Country:</strong> ` +
    movieData.Country +
    `</p><p><strong>Languages: </strong>` +
    movieData.Language +
    `</p><br><p><strong>Plot:</strong> ` +
    movieData.Plot +
    `</p><br><p><strong>Top Billed Cast: </strong>` +
    movieData.Actors +
    `</p><br><p><strong>Writer(s):</strong>` +
    movieData.Writer +
    `</p><br><p><strong>Director(s):</strong> ` +
    movieData.Director +
    `</p><p><strong>Awards: </strong> ` +
    movieData.Awards +
    `</p>` +
    ratingsHTML +
    `</p></section><figure><img onerror="this.onerror=null;this.src='./assets/images/errorImage.jpg';" alt = "` +
    movieData.Title +
    ` Poster" src="https://image.tmdb.org/t/p/w780` +
    posterPath +
    `"></img></figure>`;
  newCard.classList =
    "notification has-background-info resultCard has-text-white";
  mainCardEl.append(newCard);
  // determines if the movie is in the locally stored favorites and if so, it toggles the button to the correct state
  const removeBtnEl = document.querySelector(".rmvFavBtn");
  if (faveList.indexOf(removeBtnEl.dataset.tmdbid) !== -1) {
    removeBtnEl.dataset.state = 1;
    removeBtnEl.innerText = "Remove from Favorites";
    removeBtnEl.classList.remove("is-success");
    removeBtnEl.classList.add("is-danger");
  }
}

getImdbID();

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
//   using event delegation, determines if the target has the rmvFavBtn class and runs the rmvBtnHandler function if so
mainCardEl.addEventListener("click", function (event) {
  event.stopPropagation();
  const target = event.target;
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

// Hamburger menu

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});
