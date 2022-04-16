var submitButton = document.getElementById("searchSubmitBtn");
var resultContainer = document.getElementById("result-container");
var genreSelected=document.getElementById("genreid");
var timeFrameSelected=document.getElementById("timeframeid")
var todayDate=moment().format('YYYY-MM-DD')
var baseUrl='https://api.themoviedb.org'
var apiKey='19a1fd696d217cbc89d9176a5b94e4e6'

// var newDate1 = moment().add(1, "day").format("ddd, MMM Do");

var getMovieData = function (e) {
  e.preventDefault();
  resultContainer.textContent=''
  var genreID=genreSelected.value
  var date=moment().add(timeFrameSelected.value, "day").format("YYYY-MM-DD");
  console.log(date)
  console.log(todayDate)
  var apiUrl = baseUrl+'/3/discover/movie/?api_key='+apiKey+'&region=US&release_date.gte='+todayDate+'&release_date.lte='+date+'&with_release_type=3&with_genres='+genreID+'&sort_by=popularity.desc&sort_by=release_date.asc'
  console.log(apiUrl)
  fetch(apiUrl).then(function(response){
    if (response.ok) {
      response.json().then(function(data){
        console.log(data)

        for (var i=0; i<15; i++){
        
          var resultTMDBId=data.results[i].id
          var posterPath=data.results[i].poster_path
          var posterUrl='https://image.tmdb.org/t/p/original/'+posterPath
          var resultEl=document.createElement('article');
         
          resultEl.innerHTML='<img src="'+posterUrl+'"/><a>'+data.results[i].original_title+'</a><p>Release Date:'+data.results[i].release_date+'</p>'
          resultEl.classList='tile is-child notification is-warning'
          
          //add to favorite button
          //poster
          resultContainer.appendChild(resultEl)

          //if there is no movie
      
        } 
        
      })
    }
  })

  
}


submitButton.addEventListener("click", getMovieData);

// Da Eun code here
var submitButton = document.getElementById("searchSubmitBtn");
var popularMovieContainer = document.getElementById('popularMovieContainer')

var popularMovies = function () {
  var apiUrl = baseUrl+'/3/movie/now_playing?api_key='+apiKey+'&language=en-US&page=1/3/movie/now_playing?api_key='
  
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
  console.log(popular)
  for (var i=0; i<5; i++){
        
    var popularTMDBId=popular[i].id
    var posterPath=popular[i].poster_path
    var posterUrl='https://image.tmdb.org/t/p/original/'+posterPath
    var popularEl=document.createElement('div');
    popularEl.innerHTML='<a><img src="'+posterUrl+'"/></a>'
    popularEl.classList=''
    popularMovieContainer.appendChild(popularEl)
  } 
}

// function upcomingMoviesGenerator () {
//   var upcomingUrl=baseUrl+'/3/discover/movie?api_key='+apiKey+'&language=en-US&page=1&region=US&release_date_gte=2022-4-11&release_date.desc&with_genres=35'

//   console.log(upcomingUrl)
//   fetch(upcomingUrl).then(function(response){
//     response.json().then(function(data){
//       console.log(data)
//     })
//   })
// }

//   upcomingMoviesGenerator()

