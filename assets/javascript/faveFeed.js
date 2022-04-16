const upcomingCardContainerEl = document.querySelector(
  "#upcomingCardContainer"
);
const alreadyReleasedCardContainerEl = document.querySelector(
  "#alreadyReleasedCardContainer"
);
const mainEl = document.querySelector("main");
// this dummy data was pulled straight from OMDB's website, supposedly in the format the API would return. The real arrays won't be nearly as
// large, and won't be hard coded obviously. This is just for testing and debugging
const tempFaveList = [
  {
    Title: "Doctor Strange in the Multiverse of Madness",
    Year: "2022",
    Rated: "N/A",
    Released: "06 May 2022",
    Runtime: "N/A",
    Genre: "Action, Adventure, Fantasy",
    Director: "Sam Raimi",
    Writer: "Michael Waldron, Stan Lee, Steve Ditko",
    Actors: "Benedict Cumberbatch, Patrick Stewart, Rachel McAdams",
    Plot: "Dr. Stephen Strange casts a forbidden spell that opens the door to the multiverse, including an alternate version of himself, whose threat to humanity is too great for the combined forces of Strange, Wong, and Wanda Maximoff.",
    Language: "English",
    Country: "United States",
    Awards: "N/A",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZDg5ZDg2MWQtM2ExNi00ZjEzLTgzMDQtZmJlYWEwYmM4ODUxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
    Ratings: [],
    Metascore: "N/A",
    imdbRating: "N/A",
    imdbVotes: "N/A",
    imdbID: "tt9419884",
    Type: "movie",
    DVD: "N/A",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Thing",
    Year: "1982",
    Rated: "R",
    Released: "25 Jun 1982",
    Runtime: "109 min",
    Genre: "Horror, Mystery, Sci-Fi",
    Director: "John Carpenter",
    Writer: "Bill Lancaster, John W. Campbell Jr.",
    Actors: "Kurt Russell, Wilford Brimley, Keith David",
    Plot: "A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.",
    Language: "English, Norwegian",
    Country: "United States",
    Awards: "3 nominations",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNGViZWZmM2EtNGYzZi00ZDAyLTk3ODMtNzIyZTBjN2Y1NmM1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.2/10" },
      { Source: "Rotten Tomatoes", Value: "82%" },
      { Source: "Metacritic", Value: "57/100" },
    ],
    Metascore: "57",
    imdbRating: "8.2",
    imdbVotes: "406,823",
    imdbID: "tt0084787",
    Type: "movie",
    DVD: "14 Feb 2006",
    BoxOffice: "$19,629,760",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Notting Hill",
    Year: "1999",
    Rated: "PG-13",
    Released: "28 May 1999",
    Runtime: "124 min",
    Genre: "Comedy, Drama, Romance",
    Director: "Roger Michell",
    Writer: "Richard Curtis",
    Actors: "Hugh Grant, Julia Roberts, Richard McCabe",
    Plot: "The life of a simple bookshop owner changes when he meets the most famous film star in the world.",
    Language: "English, Spanish, French",
    Country: "United Kingdom, United States",
    Awards: "Won 1 BAFTA Film Award11 wins & 17 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMTE5OTkwYzYtNDhlNC00MzljLTk1YTktY2IxZjliZmNjMjUzL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.1/10" },
      { Source: "Rotten Tomatoes", Value: "83%" },
      { Source: "Metacritic", Value: "68/100" },
    ],
    Metascore: "68",
    imdbRating: "7.1",
    imdbVotes: "300,924",
    imdbID: "tt0125439",
    Type: "movie",
    DVD: "27 Apr 2004",
    BoxOffice: "$116,089,678",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Pitch Black",
    Year: "2000",
    Rated: "R",
    Released: "18 Feb 2000",
    Runtime: "109 min",
    Genre: "Action, Horror, Sci-Fi",
    Director: "David Twohy",
    Writer: "Jim Wheat, Ken Wheat, David Twohy",
    Actors: "Radha Mitchell, Cole Hauser, Vin Diesel",
    Plot: "A commercial transport ship and its crew are marooned on a planet full of bloodthirsty creatures that only come out to feast at night. But then, they learn that a month-long eclipse is about to occur.",
    Language: "English, Arabic",
    Country: "United States",
    Awards: "2 wins & 9 nominations",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNTNmYzE1OWYtZDdjNC00OTdhLTg1YjUtYWJlZTVkMzkzNmVkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.1/10" },
      { Source: "Rotten Tomatoes", Value: "59%" },
      { Source: "Metacritic", Value: "49/100" },
    ],
    Metascore: "49",
    imdbRating: "7.1",
    imdbVotes: "235,434",
    imdbID: "tt0134847",
    Type: "movie",
    DVD: "01 Jun 2004",
    BoxOffice: "$39,240,659",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Event Horizon",
    Year: "1997",
    Rated: "R",
    Released: "15 Aug 1997",
    Runtime: "96 min",
    Genre: "Horror, Sci-Fi, Thriller",
    Director: "Paul W.S. Anderson",
    Writer: "Philip Eisner",
    Actors: "Laurence Fishburne, Sam Neill, Kathleen Quinlan",
    Plot: "A rescue crew investigates a spaceship that disappeared into a black hole and has now returned...with someone or something new on-board.",
    Language: "English, Latin",
    Country: "United Kingdom, United States",
    Awards: "1 win & 2 nominations",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZGI0NDMwNjAtNGEzNC00MzA1LTlkMjQtYjBkYTZlZjAyZWEyXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "6.7/10" },
      { Source: "Rotten Tomatoes", Value: "29%" },
      { Source: "Metacritic", Value: "35/100" },
    ],
    Metascore: "35",
    imdbRating: "6.7",
    imdbVotes: "173,379",
    imdbID: "tt0119081",
    Type: "movie",
    DVD: "18 Apr 2006",
    BoxOffice: "$26,673,242",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Jurassic World Dominion",
    Year: "2022",
    Rated: "PG-13",
    Released: "10 Jun 2022",
    Runtime: "N/A",
    Genre: "Action, Adventure, Sci-Fi",
    Director: "Colin Trevorrow",
    Writer: "Colin Trevorrow, Emily Carmichael, Derek Connolly",
    Actors: "Dichen Lachman, Bryce Dallas Howard, Chris Pratt",
    Plot: "Four years after the destruction of Isla Nublar, dinosaurs now live--and hunt--alongside humans all over the world. This fragile balance will reshape the future and determine, once and for all, whether human beings are to remain the ",
    Language: "English",
    Country: "United States",
    Awards: "N/A",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjQzZTA2MmEtNDcwYy00ZWE0LWFlODMtOWQ2MzRjNTgyYmVkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
    Ratings: [],
    Metascore: "N/A",
    imdbRating: "N/A",
    imdbVotes: "N/A",
    imdbID: "tt8041270",
    Type: "movie",
    DVD: "N/A",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Northman",
    Year: "2022",
    Rated: "N/A",
    Released: "22 Apr 2022",
    Runtime: "N/A",
    Genre: "Action, Adventure, Drama",
    Director: "Robert Eggers",
    Writer: "Robert Eggers, Sjón",
    Actors: "Alexander Skarsgård, Nicole Kidman, Claes Bang",
    Plot: "From visionary director Robert Eggers comes The Northman, an action-filled epic that follows a young Viking prince on his quest to avenge his father's murder.",
    Language: "English, Norse, Old",
    Country: "United States",
    Awards: "N/A",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDNkMTVlODUtNjBlMi00ZTUyLWI5OTItZTFjMjVlMTA5MTkzXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    Ratings: [],
    Metascore: "N/A",
    imdbRating: "N/A",
    imdbVotes: "N/A",
    imdbID: "tt11138512",
    Type: "movie",
    DVD: "N/A",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Spirited Away",
    Year: "2001",
    Rated: "PG",
    Released: "28 Mar 2003",
    Runtime: "125 min",
    Genre: "Animation, Adventure, Family",
    Director: "Hayao Miyazaki",
    Writer: "Hayao Miyazaki",
    Actors: "Daveigh Chase, Suzanne Pleshette, Miyu Irino",
    Plot: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    Language: "Japanese, English",
    Country: "Japan",
    Awards: "Won 1 Oscar. 58 wins & 31 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.6/10" },
      { Source: "Rotten Tomatoes", Value: "97%" },
      { Source: "Metacritic", Value: "96/100" },
    ],
    Metascore: "96",
    imdbRating: "8.6",
    imdbVotes: "724,763",
    imdbID: "tt0245429",
    Type: "movie",
    DVD: "15 Apr 2003",
    BoxOffice: "$13,750,644",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Nosferatu",
    Year: "1922",
    Rated: "Not Rated",
    Released: "18 May 1922",
    Runtime: "94 min",
    Genre: "Fantasy, Horror",
    Director: "F.W. Murnau",
    Writer: "Henrik Galeen, Bram Stoker",
    Actors: "Max Schreck, Alexander Granach, Gustav von Wangenheim",
    Plot: "Vampire Count Orlok expresses interest in a new residence and real estate agent Hutter's wife.",
    Language: "German, English",
    Country: "Germany",
    Awards: "1 win & 2 nominations",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMTAxYjEyMTctZTg3Ni00MGZmLWIxMmMtOGM2NTFiY2U3MmExXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.9/10" },
      { Source: "Rotten Tomatoes", Value: "97%" },
    ],
    Metascore: "N/A",
    imdbRating: "7.9",
    imdbVotes: "94,626",
    imdbID: "tt0013442",
    Type: "movie",
    DVD: "02 Jan 2001",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
];
// This next line is temporary, intended to fill local storage with a fake dataset mimicing normal function, this can be deleted later
localStorage.setItem("favorites", JSON.stringify(tempFaveList));

// This pulls the favorites list from local storage, or if no favelist exists yet it sets it to an empty array
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];

// this sorts the movies in ascending order to assist the user in their main goal: viewing the closest upcoming favorites
// moment is used to convert the date into a sequential format, so they can be compared and sorted
faveList.sort((a, b) => {
  return moment(a.Released) - moment(b.Released);
});

const today = moment();    
// this function does the heavy lifting of the page, clearing the HTML and using faveList to create all the cards
function populateAllCards() {
  upcomingCardContainerEl.innerHTML = "";
  alreadyReleasedCardContainerEl.innerHTML = "";

  // iterates through all movie IDs in the faveList array and does an API call using those movie IDs in the URL,
  // then uses the displayCard function to build and append the cards
  faveList.forEach((element) => {
    const parsedReleaseDate = moment(element.Released, "DD MMM YYYY").format(
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
    let newCard = document.createElement("div");
    newCard.innerHTML =
    // Movie Info
      `<div><a class="title is-large" href = "expandedResultCard.html?imdbID=` +
      element.imdbID +
      `">` +
      element.Title +
      `</a>
      <p>Release Date: ` +
      releaseDateDisplayString +
      `</p>
      <p>Genre: ` +
      element.Genre +
      `</p>
      <p>Plot: ` +
      element.Plot +
      `</p>
      <p>Director: ` +
      element.Director +
      `</p>
      <p>Top Billed Cast: ` +
      element.Actors +
      `</p>
      <button class="rmvFavBtn" data-imdbid="` +
      element.imdbID +
      `">Remove</button></div>` +
      // Poster
      // find the row class in the framework and use it for these two 
      `<section class="imgClass"> <img class="" src="` +
      element.Poster +
      `"></img> </section>`;


    newCard.classList.add("favCard", "TBDclass");
    newCard.dataset.imdbid = element.imdbID;

    if (today.isBefore(parsedReleaseDate)) {
      newCard.classList.add("upcomingCard");
      const calendarEvtBtn = document.createElement("button");
      calendarEvtBtn.innerText = "Create a Calendar Event";
      calendarEvtBtn.classList.add("calendarEvtBtn");
      newCard.append(calendarEvtBtn);
      upcomingCardContainerEl.append(newCard);
    } else {
      newCard.classList.add("alreadyReleasedCard");
      alreadyReleasedCardContainerEl.append(newCard);
    }
  });
}

if (faveList.length > 0) {
  populateAllCards();
} else {
  upcomingCardContainerEl.innerText =
    "Nothing here yet! Try searching for new favorites using the search tool!";
  alreadyReleasedCardContainerEl.innerText =
    "Nothing here yet! Try searching for new favorites using the search tool!";
}

function rmvBtnHandler(target) {
  // this searches for and removes the imdbID frome the faveList

  for (let i = 0; i < faveList.length; i++) {
    if (faveList[i].imdbID === target.dataset.imdbid) {
      faveList.splice(i, 1);
      //  resets the localStorage to match faveList
      localStorage.setItem("favorites", JSON.stringify(faveList));
      populateAllCards();
      break;
    }
  }
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

// var test1El = document.querySelector("#test1");
// var test2El = document.querySelector("#test2");
// var test3El = document.querySelector("#test3");
// var test4El = document.querySelector("#test4");

// test1El.textContent = Release;
// test2El.textContent = ;
// test3El.textContent = ;
// test4El.textContent = ;
