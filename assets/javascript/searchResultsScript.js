
var form = document.querySelector('#form')
var searchBarInput = document.querySelector("#searchBarInput");
var resultCardContainer= document.querySelector("#resultCardContainer");




// function to get the user input. Displays an alert if no input
var formSumbitHandler = function(event){
    // prevent the form form autosubmitting
    event.preventDefault(); 

    var searchBarInput = document.querySelector('#searchBarInput').value.trim()
    console.log(searchBarInput);

    fetchMovies(searchBarInput);
}

form.addEventListener('submit', formSumbitHandler);







// let url = 'https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&language=en-US&page=1&include_adult=false'
// fetch func 
let ApiKey = '1288fee4b00de870e735f788ed6723bc'

function fetchMovies (movie) {
 let url = `https://cors-anywhere.herokuapp.com/https://api.themoviedb.org/3/movie/550?api_key=1288fee4b00de870e735f788ed6723bc`



 
//   fetch functionality to pull the API info
fetch(url)
.then(function (response) {
    if (response.ok) {
      response.json()
      .then(function (movieData) {
        console.log(movieData);
      })
    } else {
        console.log("404 error");
// need to inform user that there's a 404 error if they get to this else
    }
  });
}

// function for each movie or each section. for each move, do the following before displaying
function movies (movie) {
    let li = document.creatElement('li'),
         img = document.createElement('img'),
         span = document.createElement('span');
            
         img.src = movie.picture.small;

         span.innerHTML = `${movie.name} ${movie.cast}`;


        document.body.appendChild(li)
        document.body.appendChild(img)
        document.body.appendChild(span)
}



// .catch(function(error){
//     console.log(JSON.stringify(error));
// })



