define( 
function() {

  var moviesLoadSuccess = 'movies/load/success';
  var moviesSaveSuccess = 'movies/save/success';
  var moviesGetSuccess = 'movies/get/success';
  var moviesAddRemoveVoteSuccess = 'movies/vote/success';

	function getMovies(userId, sortBy) {
	  if (sortBy == undefined) {
		sortBy = "Title";
	  }
		var data = {orderby : sortBy}
		$.ajax({
			type: 'post',
			url: '/movies/movies',
			dataType: 'json',
			data: data,
			success: function(movieData) {
		  		if (movieData.code == 0 ) {
					movieData.movieuserid = userId;

					displayMovieList = [];

					var includeWatch = $('div.filters #include-watched').prop('checked')

					movieData.results.map( function (mv) {
				  		mv.myvote = false;
						mv.voteshort = '';
						if ($.inArray(movieData.movieuserid, mv.Votes) >= 0) {
						  mv.myvote = true;
						}

						mv.voteshort = convertToShortNames(mv.Votes);

						if (includeWatch || mv.Watched == false || mv.Watched == undefined) { 
						  displayMovieList.push(mv);
						}

						// convert 2012/03/01 to 2012-03-01
						var dateAdded = new Date(mv.DateAdded.replace(/-/g, "/"));
						var today = new Date();
						var cutOffDate = new Date();
						cutOffDate.setDate( today.getDate() - 10 ); // 10 days get 'new' flag
						
						mv.newmovie = 0;
						if ( cutOffDate < dateAdded ) {
						  mv.newmovie = 1;
						  console.log(" new movie: " + mv.Title);
						}

				  	});

					$.publish( moviesLoadSuccess, [displayMovieList, includeWatch ] );

					//var data = {};
					//data.results = displayMovieList;
					//var templateBuild = Handlebars.compile(tpl);
					//$('div.movielist').html(templateBuild(movieData));
					//$('div.movielist').html(templateBuild(data));

					//$('div.filters #include-watched').prop('checked', includeWatch);
		  		}
		  		else {
					alert("Error unable " + movieData.results) 
		  		}
			},
			error: function(message) {
				// TODO ** response is always error; even when success
		  		console.log("getMovies ERROR: " + message);
		  		alert("Errors getting movies"); 
			}
		});
	} //getMovies

	function addRemoveVote( currentuser, movieid, addVote, $voterRoll ) {
		//var currentuser = getMovieUserId();
		var data = { movieid: movieid, user: currentuser }
		url = '/movies/removevote';
		if (addVote) {
		  url = '/movies/addvote';
		}

		$.ajax({
			type: 'post',
			url: url,
			dataType: 'json',
			data: data,
			success: function(response) {
		  		if (response.code != 0 ) {
					alert("Error unable change vote for movie" + response.code) 
		  		}
				else {
					var votes = convertToShortNames(response.results);
					//$voterRoll.html(votes);
					$.publish( moviesAddRemoveVoteSuccess, [votes, $voterRoll] );
				}
			},
			error: function(message) {
				console.log("error on changing vote " + message);
				alert("Error unable change vote for movie");
			}
		});
	}

	function saveMovie(movieid, title, notes, genre, 
					length, media, whofor, currentuser,
					watched, watcheddate) {

		var data = { id: movieid, title: title, notes: notes, 
		  			genre: genre, length: length, media: media,
					whofor: whofor, user: currentuser,
					watched: watched, watcheddate: watcheddate }

		$.ajax({
			type: 'post',
			url: '/movies/addmovie',
			dataType: 'json',
			data: data,
			success: function(results) {
		  		if (results.code == 0 ) {
					//movieSvc.getMovies(getMovieUserId());
					$.publish( moviesSaveSuccess );
		  		}
		  		else {
					alert("Error unable add movie" + results.code) 
		  		}
			},
			error: function(message) {
				console.log("error on addmovie " + message);
				alert("Errors saving the movie");
			}
		});
	}

	function getMovieById(movieid, successFunction, successArg1) {
	  if (movieid === undefined) {
		console.log ("getMovieById() error, movieid is 'undefined'");
		return;
	  }

		var data = {'movieid': movieid};
		$.ajax({
			type: 'get',
			url: '/movies/movie',
			dataType: 'json',
			data: data,
			success: function(movieData) {
		  		if (movieData.code == 0 ) {
	  				successFunction(movieData.results, successArg1);  // Callback ** temp **
					//$.publish( moviesSaveSuccess, movieData.results, successArg1 );
		  		}
		  		else {
					alert("Error unable " + movieData.results) 
		  		}
			},
			error: function(message) {
				// TODO ** response is always error; even when success
		  		console.log("getMovieById failed: " + message + " movieid: " + movieid);
		  		alert("Errors getting movies by id"); 
			}
		});
	} //getMovieById

	function convertToShortNames(voteList) {
	  var results = '';
		for (var i = 0; i < voteList.length; i++) {
		  results = results + voteList[i].charAt(0) + " ";
		}
		return results;
	}

	return {
	  getMovies: getMovies,
	  addRemoveVote: addRemoveVote,
	  saveMovie: saveMovie,
	  getMovieById: getMovieById,
	  events: {
		moviesLoadSuccess: moviesLoadSuccess,
		moviesSaveSuccess: moviesSaveSuccess,
		moviesGetSuccess: moviesGetSuccess,
		moviesAddRemoveVoteSuccess: moviesAddRemoveVoteSuccess 
	  }
	}
});
