
$(document).ready(function() {
  $('input.tags').on('click', function(event, ui) {
	getTagsForUser();
  });

  //$('div.tagx').on('click', function(event, ui) {
  $('div.usertags').on('click', 'div.tagx', function(event, ui) {
	tagBlockClicked(event);
  });

  initialize();
});

function initialize(){
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

	var template = getTmplTags();

	var data = {'userid': $userid , 'usecache': $useCache};
	$.ajax({
		type: "post",
		url: "tags",
		dataType: "json",
		data: data,
		success: function(userTags) {
		  if (userTags.code == 0 ) {
			var xxx = Mustache.to_html(template, userTags);
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
}

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
	var template = getTmpl();
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
			var xxx = Mustache.to_html(template, bookmarks);
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

function getTmpl(){

  return "<div><ul>{{#results}} <li><a href='{{Url}}' class='taglink' target='new'>{{Description}}</a> </li>{{/results}}</ul></div>";
//	$.get('views/foo.htm', 
//		function(d){
			//tmpl = d
//			debugger;
//			return d;
//		}
//	);	
}

function getTmplTags() {
//return "<div class='tagarea'>{{#results}}<div id='{{Name}}' class='tagx'><div class='tagtitle'>{{Name}}<div class='fooarea'></div></div></div>{{/results}}</div><div id='bmarea'><div class='bmlist'></div></div>";
return "<div class='tagarea'>{{#results}}<div id='{{Name}}' class='tagx'><div class='tagtitle'>{{Name}}<div class='fooarea'></div></div></div>{{/results}}</div>";
}

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
