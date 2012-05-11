require.config({
  paths: {
	"jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min",
  	"jquery-ui" : "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min",
	"jquery-mask" : "jquery.maskedinput-1.3.min"
  }
});

//require(["jquery", "jquery-ui", "mustache" ], 
require(["jquery", "jquery-ui", "handlebars", "pubsub" ], 
	function($) {
		require(['../app/movies.js']); // required by Opera
});

