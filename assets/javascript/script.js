var submitButton = document.getElementById("searchSubmitBtn");
var resultContainer = document.getElementById("result-container");
var genreSelected = document.getElementById("genreid");
var timeFrameSelected = document.getElementById("timeframeid");
var burgerIcon = document.querySelector("#burger");
var navbarMenu = document.querySelector("#nav-links");
var todayDate = moment().format("YYYY-MM-DD");
var baseUrl = "https://api.themoviedb.org";
var apiKey = "19a1fd696d217cbc89d9176a5b94e4e6";
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
var popularMovieContainer = document.getElementById("popularMovieContainer");

// generates upcoming movies by concatenating a string together from a base URL, user input, and today's date
var getMovieData = function (e) {
  e.preventDefault();
  resultContainer.textContent = "";
  var genreID = genreSelected.value;
  var date = moment().add(timeFrameSelected.value, "day").format("YYYY-MM-DD");
  var apiUrl =
    baseUrl +
    "/3/discover/movie/?api_key=" +
    apiKey +
    "&region=US&release_date.gte=" +
    todayDate +
    "&release_date.lte=" +
    date +
    "&with_release_type=3&with_genres=" +
    genreID +
    "&sort_by=popularity.desc&sort_by=release_date.asc";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.results.length == 0) {
          resultContainer.innerHTML =
            "<p>No result found. Please try again.</p>";
        } else {
          for (var i = 0; i < data.results.length; i++) {
            var resultTMDBId = data.results[i].id;
            var posterPath = data.results[i].poster_path;
            var posterUrl = "https://image.tmdb.org/t/p/w500/" + posterPath;
            var resultEl = document.createElement("article");

            resultEl.innerHTML =
              '<a href="expandedResultCard.html?tmdbID=' +
              data.results[i].id +
              '" target="_blank" rel="noopener noreferrer"><img alt = "' +
              data.results[i].title +
              ' Poster" src="' +
              posterUrl +
              '"/></a><section><a href = "expandedResultCard.html?tmdbID=' +
              resultTMDBId +
              '" target="_blank" rel="noopener noreferrer">' +
              data.results[i].original_title +
              "</a><p>Release Date:" +
              data.results[i].release_date +
              '</p><button class="rmvFavBtn" data-state=0 data-tmdbid="' +
              data.results[i].id +
              '">Add to Favorites</button></section>';
            resultEl.classList =
              "tile is-child notification is-warning resultCard";
            resultContainer.appendChild(resultEl);
          }
        }
        // determines whether the movie is in favorites,
        // and if it's not present in the favorites it leaves the button's innerText as "Add to favorites"
        const removeBtnEl = document.querySelectorAll(".rmvFavBtn");
        removeBtnEl.forEach((element) => {
          if (faveList.indexOf(element.dataset.tmdbid) !== -1) {
            element.dataset.state = 1;
            element.innerText = "Remove from Favorites";
          }
        });
      });
    }
  });
};

// determines the remove from favorites button's state and toggles it while removing/adding the movite from/to favorites
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

// uses event delegation to put an event listner on our dynamically generate buttons
resultContainer.addEventListener("click", function (event) {
  event.stopPropagation();
  const target = event.target;
  //   determines if the target has the rmvFavBtn class and runs the rmvBtnHandler function if so
  if (target.classList.contains("rmvFavBtn")) {
    rmvBtnHandler(target);
  }
});

submitButton.addEventListener("click", getMovieData);

var popularMovies = function () {
  var apiUrl =
    baseUrl +
    "/3/movie/now_playing?api_key=" +
    apiKey +
    "&language=en-US&page=1/3/movie/now_playing?api_key=";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayPopularMovies(data.results);
      });
    }
  });
};
popularMovies();

var displayPopularMovies = function (popular) {
  for (var i = 0; i < 5; i++) {
    var popularTMDBId = popular[i].id;
    var posterPath = popular[i].poster_path;
    var posterUrl = "https://image.tmdb.org/t/p/original/" + posterPath;
    var popularEl = document.createElement("figure");
    popularEl.innerHTML =
      '<a href="expandedResultCard.html?tmdbID=' +
      popularTMDBId +
      '" target="_blank" rel="noopener noreferrer"><img alt = "' +
      popular[i].title +
      ' Poster" src="' +
      posterUrl +
      '"/></a>';
    popularEl.classList = "";
    popularMovieContainer.appendChild(popularEl);
  }
};

// resets the value of faveList to the current value of local storage, then checks the state of all buttons and toggles them if necessary
// this prevents the user from leaving this tab open, changing their favorites on another page, then coming back here and
// setting their local storage to an earlier state
window.addEventListener("focus", function () {
  faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
  const removeBtnEl = document.querySelectorAll(".rmvFavBtn");
  removeBtnEl.forEach((element) => {
    if (faveList.indexOf(element.dataset.tmdbid) !== -1) {
      element.dataset.state = 1;
      element.innerText = "Remove from Favorites";
    } else {
      element.dataset.state = 0;
      element.innerText = "Add to Favorites";
    }
  });
});

// Creates Hamburger Menu
burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});
