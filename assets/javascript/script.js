var submitButton = document.getElementById("searchSubmitBtn");

function getMovieData() {
  // Just using the github fetch url to make sure it works
  var requestUrl = "https://api.github.com/orgs/nodejs/repos";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

submitButton.addEventListener("click", MovieData);
