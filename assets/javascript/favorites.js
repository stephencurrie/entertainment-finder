var burgerIcon = document.querySelector("#burger");
var navbarMenu = document.querySelector("#nav-links");
const upcomingCardContainerEl = document.querySelector(
  "#upcomingCardContainer"
);
const alreadyReleasedCardContainerEl = document.querySelector(
  "#alreadyReleasedCardContainer"
);
const mainEl = document.querySelector("main");
const tmdbBaseURL = "https://api.themoviedb.org/3/movie/";
const tmdbApiKey = "1288fee4b00de870e735f788ed6723bc";
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
let faveListDataArray = [];
const today = moment();

function fetchFaveData() {
  faveListDataArray = [];
  faveList.forEach((element) => {
    fetch(tmdbBaseURL + element + "?api_key=" + tmdbApiKey).then(function (
      response
    ) {
      if (response.ok) {
        response.json().then(function (faveData) {
          // fills faveListDataArray with the results of several API calls, which is the omdb data about each movie
          faveListDataArray.push(faveData);
          if (faveList.length === faveListDataArray.length) {
            // this sorts the movies in ascending order to assist the user in their main goal: viewing the closest upcoming favorites
            // moment is used to convert the date into a sequential format, so they can be compared and sorted
            faveListDataArray.sort((a, b) => {
              return moment(a.release_date) - moment(b.release_date);
            });
            populateAllCards();
          }
        });
      } else {
        mainEl.innerHTML =
          "<h3>Error loading one or more movies; try reloading.</h3>";
      }
    });
  });
}

// this function clears the HTML and uses faveListDataArray to create all the cards
function populateAllCards() {
  upcomingCardContainerEl.innerHTML = "";
  alreadyReleasedCardContainerEl.innerHTML = "";
  faveListDataArray.forEach((element) => {
    const parsedReleaseDate = moment(element.release_date, "YYYY-MM-DD").format(
      "MM/DD/YYYY"
    );
    let releaseDateDisplayString = "";
    if (today.isBefore(parsedReleaseDate)) {
      releaseDateDisplayString =
        parsedReleaseDate +
        ` - Days Remaining: ` +
        (-today.diff(parsedReleaseDate, "days") + 1);
    } else {
      releaseDateDisplayString = parsedReleaseDate;
    }
    // this loop accounts for when there are multiple genres
    let genresHTMLString = "None specified";
    if (element.genres.length > 0) {
      genresHTMLString = element.genres[0].name;
      for (let i = 1; i < element.genres.length; i++) {
        genresHTMLString += ", " + element.genres[i].name;
      }
    }
    let newCard = document.createElement("section");
    newCard.innerHTML =
      // Movie Info
      `<section><a class="title is-large" href = "expandedResultCard.html?tmdbID=` +
      element.id +
      `" target="_blank" rel="noopener noreferrer">` +
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
      `">Remove</button></section>` +
      // Poster
      // find the row class in the framework and use it for these two
      `<figure class="imgClass"><a href="expandedResultCard.html?tmdbID=` +
      element.id +
      `" target="_blank" rel="noopener noreferrer"><img onerror="this.onerror=null;this.src='./assets/images/errorImage.jpg';" alt = "` +
      element.title +
      ` Poster" src="https://image.tmdb.org/t/p/w342` +
      element.poster_path +
      `"></img></a></figure>`;
    newCard.classList = "tile is-child notification is-warning resultCard";
    newCard.dataset.tmdbid = element.id;

    if (today.isBefore(parsedReleaseDate)) {
      newCard.classList.add("upcomingCard");
      upcomingCardContainerEl.append(newCard);
    } else {
      newCard.classList.add("alreadyReleasedCard");
      alreadyReleasedCardContainerEl.append(newCard);
    }
  });
}

// determines if there are no favorites and reacts accordingly
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

// if the remove from favorites button is clicked, removes the tmdbID from favorites
function rmvBtnHandler(target) {
  if (faveList.indexOf(target.dataset.tmdbid) !== -1)
    faveList.splice(faveList.indexOf(target.dataset.tmdbid), 1);
  localStorage.setItem("favorites", JSON.stringify(faveList));
  initialize();
}

// event listener on main to help us handle the buttons remove favorite buttons
mainEl.addEventListener("click", function (event) {
  event.stopPropagation;
  const target = event.target;
  //   determines if the target has the rmvFavBtn class and runs the appropriate function if so
  if (target.classList.contains("rmvFavBtn")) {
    rmvBtnHandler(target);
  }
});

// this eventListener will rerun the initializing functions when the user navigates back to it;
// this accounts for the user adding more favorites and coming back to this page.
window.addEventListener("focus", function () {
  faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
  initialize();
});

// Creates Hamburger Menu
burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});

initialize();
