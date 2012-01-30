function foo() {
  console.log("Hello");
}

$(document).ready(function() {

   $("#bmarea").dialog({
	 autoOpen: false, width: 400, height: 330, 
     modal: true, resizable: true, draggable: true, title: "Bookmarks"
   });

  $('div.tagx').on('click', function(event, ui) {
	var x = jQuery(this).position().left + jQuery(this).outerWidth();
	var y = $(this).position().top - $(".tagarea").scrollTop();
	var foo = - $(".tagarea").position().top;
	//var y = $(this).position().top - $(".tagarea").scrollTop();
	//var x = $(this).position().left;
	//var y = jQuery(this).position().top - foo;
	//getBookmarks(event.target.id, x, y);
	var tagName = event.target.id;
	//debugger;
	//if ($(event.target).hasClass("tagx")){
	if(event.target.className === "tagtitle"){
	  tagName = event.target.parentElement.id;
	  console.log("get parent id: " + tagName);
	}
	//debugger;
	getBookmarks(tagName, event, x, y);
  });
});

function getBookmarks(tagName, event, x, y) {
  console.log("get bookmarks for " + tagName);
  var template = getTmpl();

  var data = {'tag': tagName };
  $.ajax({
	type: "post",
	url: "getBookmarks",
	dataType: "json",
	data: data,
	success: function(bookmarks) {
	  var xxx = Mustache.to_html(template, bookmarks);
	  $("#bmarea .bmlist").html(xxx);
	  //console.log("using x = " + x + " y: " + y);

	  //$("#bmarea").dialog( "option", "position", { my: "left", at: "right", of: event, offset: "20 40"});
	  $("#bmarea").dialog( "option", "position", { my: "left", at: "right", of: event });
	  $("#bmarea").dialog("open");
	},
	error: function() {
		// TODO ** response is always error; even when success
	  console.log("getBookmarks ERROR");
	}});
}

function getTmpl(){

  return "<div><ul>{{#results}} <li><a href='{{u}}' target='new'>{{d}}</a> </li>{{/results}}</ul></div>";
//	$.get('views/foo.htm', 
//		function(d){
			//tmpl = d
//			debugger;
//			return d;
//		}
//	);	
}

