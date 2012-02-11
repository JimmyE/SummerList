
$(document).ready(function() {

  $('div.tagx').on('click', function(event, ui) {

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
  });
});

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

  return "<div><ul>{{#results}} <li><a href='{{Url}}' target='new'>{{Description}}</a> </li>{{/results}}</ul></div>";
//	$.get('views/foo.htm', 
//		function(d){
			//tmpl = d
//			debugger;
//			return d;
//		}
//	);	
}

