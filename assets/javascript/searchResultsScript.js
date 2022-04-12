
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
 let url = `https://api.themoviedb.org/3/movie/550?api_key=1288fee4b00de870e735f788ed6723bc`


    fetch(url)
    .then(function(response) {
        console.log(response);
        return response.json();
    })
}





// // function for each movie or each section. for each move, do the following before displaying
function movies (movie) {
    let li = document.creatElement('li'),
         img = document.createElement('img'),
         span = document.createElement('span');
            
         img.src = movie.picture.small;

         span.innerHTML = `${movie.name} ${movie.cast}`;


         
         append (li, img);
         append (li, span);
         append (resultCardContainer, li);
}



// .catch(function(error){
//     console.log(JSON.stringify(error));
// })




//     if(movie){
//         fetchFunc(movie);
//         getMovieInfo(movie);
