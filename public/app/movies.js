define( 
[
"text!../app/templates/movie-list.htm",
"text!../app/templates/movie-info.htm",
"jquery", 
"jquery-ui"
],
function(tpl, detailTpl) {
	initialize();

	function initialize() {
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

		$('.movielist').on('click', 'div.closebox', function(event, ui) {
			event.preventDefault();
	  		var $openInfo = $('.movie-info:visible');
	  		$openInfo.hide("slide", {}, 800);
		});

		$('.movielist').on('click', 'span.sortable', function(event, ui) {
			event.preventDefault();
			sortMovies(event);
		});

		$('.movielist').on('keypress', 'div.addmore input', function(event, ui) {
		  var code = event.keyCode || event.which;
		  if (code == 13 ) {
			saveUpdateMovie();
		  }
		});

		$('.movielist').on('dblclick', 'div.row.data', function(event) {
			if ($('.movie-info').is(':visible')) {
			  return;  //ignore dbl-clicks while details are shown
			}
			detailsClicked(event);
		});

		$('.movielist').on('click', 'div.col.edit', function(event) {
		  editMovie(event);
		});

		$('.movielist').on('click', 'div.col.detail', function(event) {
		  detailsClicked(event);
		});

		$('.movielist').on('click', 'div.col.votes', function(event) {
		  voteClicked(event);
		});

		$('.movielist').on('click', 'a.loginlink', function(event) {
		  showLogin();
		});

		if (! supports_html5_storage) {
			alert("A browser with html5 support required");
	  		return;
		}

		//var savedUser = undefined;
		var savedUser = getMovieUserId();
		if ( savedUser == undefined ) {
			showLogin();	
		}
		else {
			getMovies();
		}
	} //end init

	function showLogin() {
	  $("div#login #ok").click( function() { userLogin(); });

	  $("div#login").dialog(
		  {
			draggable: false,
			closeOnEscape: false,
	  		title: 'Signin -- Movie list'
		  }).show();
	}

	function userLogin() {
		var userid = $("div#login #username").val();
		var pwd = $("div#login #password").val();

		if (userid == '' || pwd == '' ) {
			console.log("userid and password required");
			return false;
		}

		var data = { user: userid, password: pwd }
		$.ajax({
			type: 'post',
			url: '/morelists/login',
			dataType: 'json',
			data: data,
			success: function(result) {
		  		if (result.code == 0 ) {
		  			getMovies();
					setMovieUserId(userid);
	  				$("div#login").dialog('close');
		  		}
		  		else {
					alert("invalid userid/password");
		  		}
			},
			error: function(message) {
				alert("System error, unable to login");
			}
		});
	}

	function editMovie(event) {
	  var $column = $(event.target);
	  var movieid = $column.closest('div.row').attr('movieid');
	  getMovieById(movieid, addEditMovie);
	}

	function detailsClicked(event) {
	  var $column = $(event.target);
	  if ($column.hasClass('movie-info') ){
		console.log("popup-clicked while it was opened");
		return;
	  }

	  var $openInfo = $('.movie-info:visible');
	  $openInfo.hide("slide", {}, 800);

	  var movieid = $column.closest('div.row').attr('movieid');
	  var $info = $column.closest('div.row').find('.movie-info');
	  //$info.show("slide", {}, 800);

	  getMovieById(movieid, displayDetails, $info);
	}

	function voteClicked(event) {
	  var $column = $(event.target);
	  var movieid = $column.closest('div.row').attr('movieid');
	  var addVote = true;

	  if ($column.hasClass('selected')) {
	  	$column.removeClass('selected');
		addVote = false;
	  }
	  else {
	  	var currentCnt = $('.votes span.selected').length;
	  	if (currentCnt >= 3) {
			alert("Only allowed 3 votes!");
			return;
	  	}
	  	$column.addClass('selected');
	  }

	  addRemoveVote(movieid, addVote, $column.next('span.voter-roll'));
	}

	function sortMovies(event) {
	  var $column = $(event.target);
	  getMovies($column.attr('sortkey'));
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
		$('div.addmore #moviefor').val(movie.WhoFor);
		$('div.addmore #media').val(movie.Media);

		$('div.addmore input#objectid').val(movie.id);
	}

	function closeAddSection() {
		$("#title").val('');
		$("#notes").val('');
		$("#genre").val('');
		$("#length").val('');
		$("#moviefor").val('both');
		$("#objectid").val('');

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
		var media = $("#media").val();
		var whofor = $("#moviefor").val();
		var id = $("#objectid").val();
		var currentuser = getMovieUserId();

		if ( title === '' ){
		  alert("title is required");
		  $("#title").focus();
		  return;
		}

		if ( id === undefined || id == '') {
		  id = 0;
		}

		saveMovie(id, title, notes, genre, length, media, whofor, currentuser);
		closeAddSection();
	}

	function saveMovie(movieid, title, notes, genre, length, media, whofor, currentuser) {
		var data = { id: movieid, title: title, notes: notes, 
		  			genre: genre, length: length, media: media,
					whofor: whofor, user: currentuser }

		$.ajax({
			type: 'post',
			url: '/morelists/addmovie',
			dataType: 'json',
			data: data,
			success: function(results) {
		  		if (results.code == 0 ) {
					getMovies();
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

	function addRemoveVote( movieid, addVote, $voterRoll ) {
		var currentuser = getMovieUserId();
		var data = { movieid: movieid, user: currentuser }
		url = '/morelists/removevote';
		if (addVote) {
		  url = '/morelists/addvote';
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
					$voterRoll.html(votes);
				}
			},
			error: function(message) {
				console.log("error on changing vote " + message);
				alert("Error unable change vote for movie");
			}
		});
	}

	function getMovies(sortBy) {
	  if (sortBy == undefined) {
		sortBy = "Title";
	  }
		var data = {orderby : sortBy}
		$.ajax({
			type: 'post',
			url: '/morelists/movies',
			dataType: 'json',
			data: data,
			success: function(movieData) {
		  		if (movieData.code == 0 ) {
					movieData.movieuserid = getMovieUserId();

					movieData.results.map( function (mv) {
				  		mv.myvote = false;
						mv.voteshort = '';
						if ($.inArray(movieData.movieuserid, mv.Votes) >= 0) {
						  mv.myvote = true;
						}

						mv.voteshort = convertToShortNames(mv.Votes);
				  	});

					var templateBuild = Handlebars.compile(tpl);
					$('div.movielist').html(templateBuild(movieData));
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

	function convertToShortNames(voteList) {
	  var results = '';
		for (var i = 0; i < voteList.length; i++) {
		  results = results + voteList[i].charAt(0) + " ";
		}
		return results;
	}

	function getMovieById(movieid, successFunction, successArg1) {
	  if (movieid === undefined) {
		console.log ("getMovieById() error, movieid is 'undefined'");
		return;
	  }

		var data = {'movieid': movieid};
		$.ajax({
			type: 'get',
			url: '/morelists/movie',
			dataType: 'json',
			data: data,
			success: function(movieData) {
		  	if (movieData.code == 0 ) {
				//console.log(" results: " + movieData.results);
	  			//addEditMovie(movieData.results);
	  			successFunction(movieData.results, successArg1);
		  	}
		  	else {
				alert("Error unable " + movieData.results) 
		  	}
			},
			error: function(message) {
				// TODO ** response is always error; even when success
		  	console.log("getMovieById failed: " + message + " movieid: " + movieid);
		  	alert("Errors getting movies by id");
		}});
	} //getMovieById

	function displayDetails(movieData, $detailDiv) {
		$detailDiv.show("slide", {}, 800);

		var templateBuild = Handlebars.compile(detailTpl);
		$detailDiv.html(templateBuild(movieData));
	}

	function supports_html5_storage() {
  		try {
    		return 'localStorage' in window && window['localStorage'] !== null;
  		} catch (e) {
    		return false;
  		}
	}
	function setMovieUserId(userid) {
		localStorage["movieUserId"] = userid.toLowerCase();
	}
	function getMovieUserId() {
		var id = localStorage["movieUserId"];
		if ( id != undefined ) {
		  id = id.toLowerCase();
		}
		return id;
	}
});

