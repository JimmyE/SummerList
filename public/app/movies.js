define( 
[
"text!../app/templates/movie-list.htm",
"text!../app/templates/movie-info.htm",
"./services/movieService.js",
"jquery", 
"jquery-ui",
"jquery-mask"
],
function(tpl, detailTpl, movieSvc) {
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

		$('.movielist').on('click', 'div.addmore #watched', function(event, ui) {
		  showHideWatchDate();
		});

		$('.movielist').on('click', 'div.filters #include-watched', function(event, ui) {
			movieSvc.getMovies(getMovieUserId());
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
			movieSvc.getMovies(getMovieUserId());
		}
	} //end init

	$.subscribe(movieSvc.events.moviesLoadSuccess, function(result, includeWatch) {
		var data = {};
		data.results = result;
		var templateBuild = Handlebars.compile(tpl);
		$('div.movielist').html(templateBuild(data));

		$('div.filters #include-watched').prop('checked', includeWatch);
	});

	$.subscribe(movieSvc.events.moviesAddRemoveVoteSuccess , function(votes, $votesColumn) {
		$votesColumn.html(votes);
	});

	$.subscribe(movieSvc.events.moviesSaveSuccess , function() {
		movieSvc.getMovies(getMovieUserId());
	});

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
			console.log("userid and password required new");
			return false;
		}

		var data = { user: userid, password: pwd }
		$.ajax({
			type: 'post',
			url: '/movies/login',
			dataType: 'json',
			data: data,
			success: function(result) {
		  		if (result.code == 0 ) {
					movieSvc.getMovies(getMovieUserId());
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
	  movieSvc.getMovieById(movieid, addEditMovie);
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

	  movieSvc.getMovieById(movieid, displayDetails, $info);
	}

	function showHideWatchDate(){
		if ( $('#watched').prop('checked')) {
			$('#watched-date').show();
		}
		else {
			$('#watched-date').hide();
		}
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

	  movieSvc.addRemoveVote(getMovieUserId(), movieid, addVote, $column.next('span.voter-roll'));
	}

	function sortMovies(event) {
	  var $column = $(event.target);
	  movieSvc.getMovies( getMovieUserId(), $column.attr('sortkey') );
	}

	function addEditMovie(movie) {
		var $addDiv = $('div.new-movie');
		if (! $addDiv.hasClass('expanded')) {
	  		$addDiv.show(500);
	  		$addDiv.addClass('expanded');
	  	}

		$('div.new-movie input#length').mask('9?99');
		if (movie === undefined) { 
		  $('div.addmore .edit-only').hide();
		  $("#title").focus();
		  return;
		}

		//edit!
		$('div.addmore span.action').text('Edit movie');
		$('div.addmore input#title').val(movie.Title);
		$('div.addmore input#genre').val(movie.Genre);
		$('div.addmore textarea#notes').val(movie.Notes);
		$('div.addmore input#length').val(movie.Length);
		$('div.addmore #moviefor').val(movie.WhoFor);
		$('div.addmore #media').val(movie.Media);

		$('div.addmore input#objectid').val(movie.id);
		$('div.addmore .edit-only').show();
		showHideWatchDate();
		$('div.new-movie #watched-date').mask('99/99/9999');
		$('div.new-movie #watched').prop("checked", movie.Watched);
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
		var watched = $("#watched").prop('checked');
		var watcheddate = $("#watched-date").val();
		var currentuser = getMovieUserId();

		if ( title === '' ){
		  alert("title is required");
		  $("#title").focus();
		  return;
		}

		if ( id === undefined || id == '') {
		  id = 0;
		}

		movieSvc.saveMovie(id, title, notes, genre, length, 
				media, whofor, currentuser,
				watched, watcheddate);

		closeAddSection();
	}


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
