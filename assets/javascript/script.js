  var submitButton = document.getElementById("searchSubmitBtn");
var resultContainer = document.getElementById("result-container");
var genreSelected=document.getElementById("genreid");
var timeFrameSelected=document.getElementById("timeframeid")
var todayDate=moment().format('YYYY-MM-DD')
var baseUrl='https://api.themoviedb.org'
var apiKey='19a1fd696d217cbc89d9176a5b94e4e6'
let faveList = JSON.parse(localStorage.getItem("favorites")) ?? [];

var getMovieData = function (e) {
  e.preventDefault(); 
  resultContainer.textContent=''
  var genreID=genreSelected.value
  var date=moment().add(timeFrameSelected.value, "day").format("YYYY-MM-DD");
  var apiUrl = baseUrl+'/3/discover/movie/?api_key='+apiKey+'&region=US&release_date.gte='+todayDate+'&release_date.lte='+date+'&with_release_type=3&with_genres='+genreID+'&sort_by=popularity.desc&sort_by=release_date.asc'
  
  fetch(apiUrl).then(function(response){
    if (response.ok) {
      response.json().then(function(data){
        console.log(data)
        console.log(data.results)
        if (data.results.length==0){
          resultContainer.innerHTML='<p>No result found. Please try again.</p>'
        } else {
        for (var i=0; i<data.results.length; i++){
        
          var resultTMDBId=data.results[i].id
          var posterPath=data.results[i].poster_path
          var posterUrl='https://image.tmdb.org/t/p/original/'+posterPath
          var resultEl=document.createElement('article');
         
          resultEl.innerHTML='<img src="'+posterUrl+'"/><div><a href = "expandedResultCard.html?imdbID=' +
      resultTMDBId +
      '">'+data.results[i].original_title+'</a><p>Release Date:'+data.results[i].release_date+'</p><button class="rmvFavBtn" data-state=0 data-tmdbid="' +data.results[i].id +
      '">Add to Favorites</button></div>'
          resultEl.classList='tile is-child notification is-warning resultCard'
          
          //if there is no movie
          resultContainer.appendChild(resultEl)

        } 
      }
         // determines the position of the movies in favorites, and if it's not present in the favorites it leaves the button's innerText as "Add to favorites"
  const removeBtnEl = document.querySelectorAll(".rmvFavBtn");
  removeBtnEl.forEach((element) => {
    if (faveList.indexOf(element.dataset.tmdbid) !== -1) {
      element.dataset.state = 1;
      element.innerText = "Remove from Favorites";
    }
  });
      })
    }
  })

  
}
function rmvBtnHandler(target) {
  const removeBtnEl = document.querySelector(".rmvFavBtn");
  // determines the current position of the selected movie in the faveList array, or leaves it as null if it's not in the array
  if (target.dataset.state === "0") {
    target.innerText = "Remove from Favorites";
    target.dataset.state = 1;
    faveList.push(target.dataset.tmdbid);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  }
  // decides whether the movie is in faveList and adds or removes it
  else if (target.dataset.state === "1") {
    removeBtnEl.innerText = "Add to Favorites";
    target.dataset.state = 0;
    faveList.splice(faveList.indexOf(target.dataset.tmdbid), 1);
    localStorage.setItem("favorites", JSON.stringify(faveList));
  }
}

resultContainer.addEventListener("click", function (event) {
  event.stopPropagation;
  const target = event.target;
  //   determines if the target has the rmvFavBtn class and runs the rmvBtnHandler function if so
  if (target.classList.contains("rmvFavBtn")) {
    rmvBtnHandler(target);
  }
  //   need to add an if function into this listener that references the "create calendar event" classes
});

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
    popularEl.innerHTML='<a href="expandedResultCard.html?imdbID='+popularTMDBId+'"><img src="'+posterUrl+'"/></a>'
    popularEl.classList=''
    popularMovieContainer.appendChild(popularEl)
  } 
}
