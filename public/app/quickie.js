
define( 
[
"text!../app/templates/tag-list.htm",
"text!../app/templates/bookmark-list.htm",
"jquery", 
"jquery-ui"
],

function(tagTpl, bookmarkTpl) {
	console.log("Quickie -- load starting");
	initialize();

	function initialize() {
  		$('input.tags').on('click', function(event, ui) {
			getTagsForUser();
  		});

  		$('div.usertags').on('click', 'div.tagx', function(event, ui) {
			tagBlockClicked(event);
  		});

		if (! supports_html5_storage) {
	  		console.log("No html5 local storage support");
	  		return;
		}

		var $savedUser = localStorage["userId"];
		console.log("saved user: " + $savedUser);
		if ( $savedUser != undefined ) {
			$('input#userid').val($savedUser);
			getTagsForUser();
		}
	}

	function getTagsForUser() {
		var $userid = $('input#userid').val();
		if ($userid === '' ) {
	  		return;
		}
		var $useCache = $('input#cacheopt').prop('checked');
		console.log ('get tags for ' + $userid + '  cache?: ' + $useCache);
	
		var data = {'userid': $userid , 'usecache': $useCache};
		$.ajax({
			type: "post",
			url: "tags",
			dataType: "json",
			data: data,
			success: function(userTags) {
		  	if (userTags.code == 0 ) {
				var xxx = Mustache.to_html(tagTpl, userTags);
				$('div.usertags').html(xxx);
				if (supports_html5_storage) {
					localStorage["userId"] = $userid;
				}
		  	}
		  	else {
				alert("Error unable " + userTags.results) 
		  	}
			},
			error: function(message) {
				// TODO ** response is always error; even when success
		  	console.log("getTags ERROR: " + message);
		  	alert("Errors getting tags for user");
		}});
	} //getTagsForUser

	function tagBlockClicked(event) {
  		if ( $(event.target).hasClass("taglink") ) {
			return;
  		}
		var tagName = event.target.id;

		if(event.target.className === "tagtitle"){
	  		//clicked in 'title' area, get parents id
	  		tagName = event.target.parentElement.id;
		}

		var div = $("#" + event.currentTarget.id);
		if (div.hasClass("expanded")){
	  	closeAllBlocks();
	  	return;
		}

		showBookmarksForTag(tagName, div);
	}

	function showBookmarksForTag(tagName, targetDiv) {
		console.log("Show bookmarks for " + tagName);

		closeAllBlocks();
		targetDiv.addClass("expanded");
		targetDiv.find("div.fooarea").html("<div class='busyicon'></div>");

		var data = {'tag': tagName };
		$.ajax({
			type: "post",
			url: "getBookmarks",
			dataType: "json",
			data: data,
			success: function(bookmarks) {
				var xxx = Mustache.to_html(bookmarkTpl, bookmarks);
				var yyyDiv = targetDiv.find("div.fooarea");
				targetDiv.find("div.fooarea").html(xxx);
			},
			error: function() {
				// TODO ** response is always error; even when success
		  	console.log("getBookmarks ERROR");
		  	alert("Errors getting bookmarks");
		}});
	} //end function
	
	function closeAllBlocks() {
  		var expandedDivs = $(".expanded");
  		expandedDivs.removeClass("expanded");
  		expandedDivs.find(".fooarea").html("");
	}

	function supports_html5_storage() {
  		try {
    		return 'localStorage' in window && window['localStorage'] !== null;
  		} catch (e) {
    		return false;
  		}
	}
});
