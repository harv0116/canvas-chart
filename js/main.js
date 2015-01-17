// JavaScript Document


$(document).ready(function(){
	$.ajax({
		url: "js/cheese.js",
		dataType: "json",
		}).done( gotData ).fail( badStuff );
});

function gotData( data ){
console.log("Made it here!");	
var percentSales = [];
var labelProduct = [];
var colorSegment = [];	
// first get the data figured out
for (i=0;i<data.segments.length;i++) {	
	percentSales[i] = (data.segments[i].value / 100);
	labelProduct[i] = data.segments[i].label;
	colorSegment[i] = data.segments[i].color;

	console.log(percentSales[i], labelProduct[i], colorSegment[i]);
}


// second prepare the first graph

// third prepare the second graph
}

function badStuff(  jqxhr, status, err){
	console.log("Oh Oh Broken!");
}