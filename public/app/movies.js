define( 
[
"text!../app/templates/movie-list.htm",
"jquery", 
"jquery-ui"
],

function(tpl ) {
	console.log("Movie list -- load starting");
	initialize();

	function initialize() {
		getMovies();

		$('.movielist').on('click', 'div.addmore', function(event, ui) {
		  console.log("add a movie");
		  $('div.new-movie').toggle(500);
		});

		//if (! supports_html5_storage) {
	  	//	console.log("No html5 local storage support");
	  	//	return;
		//}
	}

	function getMovies() {
		
		//var data = {'userid': $userid , 'usecache': $useCache};
		var data = ''
		$.ajax({
			type: 'post',
			url: '/morelists/movies',
			dataType: 'json',
			data: data,
			success: function(userTags) {
		  	if (userTags.code == 0 ) {
				var xxx = Mustache.to_html(tpl, userTags);
				$('div.movielist').html(xxx);
		  	}
		  	else {
				alert("Error unable " + userTags.results) 
		  	}
			},
			error: function(message) {
				// TODO ** response is always error; even when success
		  	console.log("getTags ERROR: " + message);
		  	alert("Errors getting movies");
		}});
	} //getMovies

	function supports_html5_storage() {
  		try {
    		return 'localStorage' in window && window['localStorage'] !== null;
  		} catch (e) {
    		return false;
  		}
	}
});
