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

var submitButton = document.getElementById("searchSubmitBtn");
var popularMovieContainer = document.getElementById('popularMovieContainer')
var baseUrl='https://api.themoviedb.org'
var apiKey='19a1fd696d217cbc89d9176a5b94e4e6'


var popularMovies = function () {
  var apiUrl = baseUrl+'/3/movie/popular?api_key='+apiKey+'&language=en-US&page=1'
  
  fetch(apiUrl).then(function(response){
    if (response.ok) {
      response.json().then(function(data){
        console.log(data)
        displayPopularMovies(data.results)
      })
    }
  })
}
popularMovies()

var displayPopularMovies = function(popular) {
  
  for (var i=0; i<5; i++){
    var popularTitle = popular[i].original_title;
    var popularMovieId=popular[i].id
    console.log()

    var popularEl=document.createElement('a');
   
    var popularTitleEl = document.createElement('span');
    popularTitleEl.textContent = popularTitle;
    popularTitleEl.style.fontWeight='bold'

    popularEl.appendChild(popularTitleEl);

    var plotEl = document.createElement('span');
    plotEl.style.display='block'
    
    plotEl.innerHTML=popular[i].overview;
  

    popularEl.appendChild(plotEl);

    popularMovieContainer.appendChild(popularEl)

  } 
}

function upcomingMoviesGenerator () {
  var upcomingUrl=baseUrl+'/3/discover/movie?api_key='+apiKey+'&language=en-US&page=1&region=US&release_date_gte=2022-4-11&release_date.desc&with_genres=35'

  console.log(upcomingUrl)
  fetch(upcomingUrl).then(function(response){
    response.json().then(function(data){
      console.log(data)
    })
  })
}

  upcomingMoviesGenerator()

  // var genreList = {"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]}

  // https://api.themoviedb.org/3/discover/movie?api_key=[MY_KEY]&language=en-US&page=1&primary_release_year=2019&with_genres=28,12,80