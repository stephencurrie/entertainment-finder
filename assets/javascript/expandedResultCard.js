const mainCardEl = document.querySelector("#expandedInfoCard");

const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get("imdbID");

const today = moment();

function getMovieData() {
  // Just using the github fetch url to make sure it works
  var requestUrl =
    `http://www.omdbapi.com/?i=` + imdbID + `&plot=full&apikey=cf7767a2`;

  fetch(requestUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (movieData) {
        console.log(movieData);
        createCard(movieData);
      });
    } else {
      // need to inform user that there's a 404 error if they get to this else
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
  }else{
    ratingsHTML = "<p>Ratings: N/A</p>"
  }
  newCard.innerHTML =
    `<h2>` +
    movieData.Title +
    `</h2><button class="rmvFavBtn" data-imdbid="` +
    movieData.imdbID +
    `">Remove</button><p>Runtime: ` +
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
}
getMovieData();
