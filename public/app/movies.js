define( 
[
"text!../app/templates/movie-list.htm",
"jquery", 
"jquery-ui"
],

function(tpl ) {
	initialize();

	function initialize() {
		getMovies();

		$('.movielist').on('click', 'div.addmore span.action', function(event, ui) {
			event.preventDefault();
			addEditMovie();
		});

		$('.movielist').on('click', 'input.cancelbtn', function(event, ui) {
			event.preventDefault();
			closeAddSection();
		});

		$('.movielist').on('click', 'input.okbtn', function(event, ui) {
			event.preventDefault();
			saveUpdateMovie();
		});

		$('.movielist').on('keypress', 'div.addmore input', function(event, ui) {
		  var code = event.keyCode || event.which;
		  if (code == 13 ) {
			saveUpdateMovie();
		  }
		});

		$('.movielist').on('dblclick', 'div.row.data', function(event) {
		  editMovie(event);
		});

		$('.movielist').on('click', 'div.col.edit', function(event) {
		  editMovie(event);
		});

		//if (! supports_html5_storage) {
	  	//	console.log("No html5 local storage support");
	  	//	return;
		//}
	} //end init

	function editMovie(event) {
	  var $colmn = $(event.target);
	  var movieid = $colmn.closest('div.row').attr('movieid');
	  getMovieById(movieid);
	}

	function addEditMovie(movie) {
		var $addDiv = $('div.new-movie');
		if (! $addDiv.hasClass('expanded')) {
	  		$addDiv.show(500);
	  		$addDiv.addClass('expanded');
	  	}
		if (movie === undefined) {
		  $("#title").focus();
		  return;
		}

		//edit!
		$('div.addmore span.action').text('Edit movie');
		$('div.addmore input#title').val(movie.Title);
		$('div.addmore input#genre').val(movie.Genre);
		$('div.addmore input#notes').val(movie.Notes);
		$('div.addmore input#length').val(movie.Length);
		var stream = false;
		if ( movie.Streaming === 'true' ) {
		  stream = true;
		}
		$('div.addmore input#streaming').prop("checked", stream);
		$('div.addmore input#objectid').val(movie.id);
	}

	function closeAddSection() {
		$("#title").val('');
		$("#notes").val('');
		$("#genre").val('');
		$("#length").val('');
		$("#objectid").val('');
		//$("#streaming").val('');

		$('div.addmore span.action').text('Add a movie ....');
		var $addDiv = $('div.new-movie');
	  	$addDiv.hide(500);
	  	$addDiv.removeClass('expanded');
	}

	function saveUpdateMovie() {
		var title = $("#title").val().trim();
		var notes = $("#notes").val().trim();
		var genre = $("#genre").val().trim();
		var length = $("#length").val().trim();
		var streaming = $("#streaming").is(':checked');
		var id = $("#objectid").val();

		if ( title === '' ){
		  alert("title is required");
		  $("#title").focus();
		  return;
		}

		if ( id === undefined || id == '') {
		  id = 0;
		}

		saveMovie(id, title, notes, genre, length, streaming);
		closeAddSection();
		getMovies();
	}

	function saveMovie(movieid, title, notes, genre, length, streaming) {
		var data = { id: movieid, title: title, notes: notes, genre: genre, length: length, streaming: streaming}

		$.ajax({
			type: 'post',
			url: '/morelists/addmovie',
			dataType: 'json',
			data: data,
			success: function(results) {
		  		if (results.code == 0 ) {
				  console.log("Success on addmovie");
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

	function getMovies() {
		var data = ''
		$.ajax({
			type: 'post',
			url: '/morelists/movies',
			dataType: 'json',
			data: data,
			success: function(movieData) {
		  	if (movieData.code == 0 ) {
				var xxx = Mustache.to_html(tpl, movieData);
				$('div.movielist').html(xxx);
		  	}
		  	else {
				alert("Error unable " + movieData.results) 
		  	}
			},
			error: function(message) {
				// TODO ** response is always error; even when success
		  	console.log("getTags ERROR: " + message);
		  	alert("Errors getting movies");
		}});
	} //getMovies

	function getMovieById(movieid) {
		var data = {'movieid': movieid};
		$.ajax({
			type: 'get',
			url: '/morelists/movie',
			dataType: 'json',
			data: data,
			success: function(movieData) {
		  	if (movieData.code == 0 ) {
				console.log(" results: " + movieData.results);
	  			addEditMovie(movieData.results);
		  	}
		  	else {
				alert("Error unable " + movieData.results) 
		  	}
			},
			error: function(message) {
				// TODO ** response is always error; even when success
		  	console.log("getTags ERROR: " + message);
		  	alert("Errors getting movies");
		}});
	} //getMovieById

	function supports_html5_storage() {
  		try {
    		return 'localStorage' in window && window['localStorage'] !== null;
  		} catch (e) {
    		return false;
  		}
	}
});
