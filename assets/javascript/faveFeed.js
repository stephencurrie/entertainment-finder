const upcomingCardContainerEl = document.querySelector(
  "#upcomingCardContainer"
);
const alreadyReleasedCardContainerEl = document.querySelector(
  "#alreadyReleasedCardContainer"
);
const mainEl = document.querySelector("main")
// Need to modify these once we nail down the API calls
const baseURL = "TBD";
const APIkey = "TBD";
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];
function populateAllCards() {
  upcomingCardContainerEl.innerHTML = "";
  alreadyReleasedCardContainerEl.innerHTML = "";

  // iterates through all movie IDs in the faveList array and does an API call using those movie IDs in the URL,
  // then uses the displayCard function to build and append the cards
  faveList.foreach((element) => {
    const faveQueryURL =
      baseURL + element + `any other piece of the URL that's necessary`;
    fetch(faveQueryURL).then(function (response) {
      if (response.ok) {
        response.json().then(function (movieData) {
          //   VV might need to modifiy this line to properly determine when an invalid object is returned
          if (movieData === undefined) {
            //   need to determine how to handle it if the API call returns an invalid object for a specific movie
          } else {
            displayCard(movieData, element);
          }
        });
      } else {
        //  need to alert the user to a 404 error for a specific movie without an alert
        return;
      }
    });
  });
}

// this whole section needs an update based on the object that gets returned by the API call. anything that contains TBD will need to be updated
function displayCard(movieData, element) {
  let newCard = document.createElement("a");
  newCard.innerHTML =
    `<h3>` +
    movieData.TBDMovieNameRef +
    `</h3><button class="rmvFavBtn" data-movieID="` +
    element +
    `>Remove</button><img src="TBDPosterImageURLRef` +
    movieData.TBDPosterURLRef +
    `TBD rest of the poster img url"></img><p>Release Date: ` +
    movieData.TBD +
    `</p><p>Genre: ` +
    movieData.TBD +
    `</p><p>Description: ` +
    movieData.TBD +
    `</p><p>Director: ` +
    movieData.TBD;
  `</p><p>Top Billed Cast: ` + movieData.TBD;
  newCard.classList.add("favCard", "TBDclass");
  //   this would get used to delete the movieID from favorites when the unfavorite button is clicked
  newCard.href = "TBDexpandedresultcardURL q=" + element;
  const today = new Date();
  if (today > movieData.TBDreleaseDate) {
    newCard.classList.add("alreadyReleasedCard");
    alreadyReleasedCardContainerEl.append(newCard);
  } else {
    newCard.classList.add("upcomingCard");
    const calendarEvtBtn = document.createElement("button");
    calendarEvtBtn.innerText = "Create a Calendar Event";
    calendarEvtBtn.classList.add("calendarEvtBtn");
    newCard.append(calendarEvtBtn);
    upcomingCardContainerEl.append(newCard);
  }
}
if (faveList.length > 0) {
  populateAllCards();
} else {
  upcomingCardContainerEl.innerText =
    "Nothing here yet! Try searching for new favorites using the search tool!";
  alreadyReleasedCardContainerEl.innerText =
    "Nothing here yet! Try searching for new favorites using the search tool!";
}

function rmvBtnHandler (target){
  // this searches for and removes the movieID frome the faveList
  faveList.splice(faveList.indexOf(target.dataset.movieID), 1);
  //  resets the localStorage to match faveList
  localStorage.setItem("favorites", JSON.stringify(faveList));
  populateAllCards();
}

// event listener on main to help us handle the buttons that were created in the displayCard function
mainEl.addEventListener("click", function (event) {
  event.stopPropagation;
  const target = event.target;
//   determines if the target has the rmvFavBtn class and runs the appropriate function if so
  if (target.classList.contains("rmvFavBtn")) {
    rmvBtnHandler(target);
  }
  //   need to add an if function into this listener that references the "create calendar event" classes
});

// this eventListener will reload the page when the user navigates back to it; this accounts for the user adding more favorites and
// coming back to this page. If it's not reloaded after adding favorites from the search page
// the present variables on this page could reset the localstorage to an earlier state
window.addEventListener("focus", function () {
  document.location.reload(true);
});
