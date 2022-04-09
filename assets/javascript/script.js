var submitButton = document.getElementById("searchSubmitBtn");

function getMovieData() {
  // Just using the github fetch url to make sure it works
  var requestUrl = 'http://www.omdbapi.com/?i=tt&apikey=cf7767a2';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      console.log(data);
    });
}

submitButton.addEventListener("click", getMovieData);
