// JavaScript Document
var percentSales = [];
var labelProduct = [];
var colorSegment = [];
var totalSales = 0;
var segmentSalesPercent;
var maxSales;
var minSales;
var canvas1, canvas2, context1, context2;
var radius;

document.addEventListener("DOMContentLoaded", function(){
  //set global vars for canvas and context
  canvas1 = document.querySelector("#canvas1");
  context1 = canvas1.getContext("2d");
  canvas2 = document.querySelector("#canvas2");
  context2 = canvas2.getContext("2d"); 
  //default action when it first loads
  ajax();

});

function ajax(){
	$.ajax({
		url: "data/cheese.json",
		type: "post",
		dataType: "json",
		jsonp: false,
      	jsonpCallback: fred
		}).done( gotData ).fail( badStuff );
};

function gotData( data ){
// first get the data figured out
	for (i=0;i<data.segments.length;i++) {	
		percentSales[i] = data.segments[i].value / 100;
		labelProduct[i] = data.segments[i].label;
		colorSegment[i] = data.segments[i].color;	
	}
		// find max and min percent sales
	maxSales = findmax(percentSales);
	minSales = findmin(percentSales);
	$.each(percentSales,function() {
  		totalSales += this;
	});
	
	// prepare the first graph
	pieChart();
	// prepare the second graph
	funnelChart();
	
}

function badStuff(  jqxhr, status, err){
	console.log("Oh Oh Broken!");
	console.log("fail", status);
  	console.log("fail", err.message);
  	console.log( jqxhr.responseText );
}

function fred(data){
  console.log("fred");
}

function findmax(array) {
	var max = 0;
	var a = array.length;
	for (counter=0;counter<a;counter++) {
		if (array[counter] > max) {
			max = array[counter];
		}
	}
	return max;
}

function findmin(array) {
	var min = array[0];
    var a = array.length;
    for (counter=0;counter<a;counter++) {
         if (array[counter] < min) {
           min = array[counter];
         }
      }
    return min;
}

function pieChart(){
  //clear the canvas
  context1.clearRect(0, 0, canvas1.width, canvas1.height);

  var cx = canvas1.width/2;
  var cy = canvas1.height/2;
  var currentAngle = 0;
  
  for(var i=0; i<percentSales.length; i++){
	//radius can be variable  
	// radius amount is determined by numeric value.  largest is 110.  
	//smallest is 90%.  the others are 100%.  minSales and maxSales are
    //the variable names to test against the array.		
	if (percentSales[i] === maxSales) { 
		radius = 110; 
	} else if (percentSales[i] === minSales) {
		radius = 90;
	} else {
		radius = 100; 
	}
	
	// colours are pulled from the data and converted directly into
	// rgb.
	var colour = colorSegment[i];
	// calculate the actual percentage for each pie piece
	segmentSalesPercent = (percentSales[i] / totalSales);
	// figures out the ending angle of the pie piece based on PI
    var endAngle = currentAngle + (segmentSalesPercent * (Math.PI * 2));
    //draw the arc
    context1.moveTo(cx, cy);
    context1.beginPath();
    context1.fillStyle = colour;
    context1.arc(cx, cy, radius, currentAngle, endAngle, false);  
    context1.lineTo(cx, cy);
    context1.fill();
    
    //Now draw the lines that will point to the values
    context1.save();
    context1.translate(cx, cy);//make the middle of the circle the (0,0) point
    context1.strokeStyle = "#000";
    context1.lineWidth = 1;
    context1.beginPath();
	
    //angle to be used for the lines
    var midAngle = (currentAngle + endAngle)/2;//middle of two angles
    context1.moveTo(0,0);//this value is to start at the middle of the circle
    
	//to start further out...
    var dx = Math.cos(midAngle) * (0.8 * radius);
    var dy = Math.sin(midAngle) * (0.8 * radius);
    context1.moveTo(dx, dy);
    
	//ending points for the lines
    var dx = Math.cos(midAngle) * (radius + 20); //30px beyond radius
    var dy = Math.sin(midAngle) * (radius + 20);
    context1.lineTo(dx, dy);
    context1.stroke();
	context1.moveTo(dx, dy);
	
	// Put labels for the Pie Chart - first the names
	var lbl = labelProduct[i]
    var dx = Math.cos(midAngle) * (radius + 40); //35px beyond radius
    var dy = Math.sin(midAngle) * (radius + 40);
	context1.fillText(lbl, dx, dy);
	// then the percentages
 	var lbl2 = Math.round(segmentSalesPercent * 100).toString() + "%";
    var dx1 = Math.cos(midAngle) * (radius - 45); //35px beyond radius
    var dy1 = Math.sin(midAngle) * (radius - 45);
	context1.fillStyle = "#000";
	context1.fillText(lbl2, dx1, dy1);   
     
    //put the canvas back to the original position
    context1.restore();
    //update the currentAngle
    currentAngle = endAngle;
  }
}

function funnelChart(){
  context2.clearRect(0, 0, canvas2.width, canvas2.height);
  //the percentage of each value will be used to determine the height of the bars.
 	var arcRad = 25;  //arc radius
 	var arcLen = 0; //arc length
 	var xArcAxis = 100;  //x axis
 	var yArcAxis = 23;  //y axis
	
 	for (i=0; i<percentSales.length;i++) {
		var colour = colorSegment[i];
		segmentSalesPercent = (percentSales[i] / totalSales);
		arcLen = segmentSalesPercent;
	 	context2.beginPath();
	 	context2.arc(200, 200, arcRad, 1.5 * Math.PI, arcLen * Math.PI, false);
	 	context2.lineWidth = 20;
	 	context2.strokeStyle = colour;
	 	context2.stroke();
	 	context2.shadowColor = 'hsla(0, 0%, 0%, .4)';
	 	context2.shadowBlur = 15;
	 	context2.shadowOffsetX = 10;
	 	context2.shadowOffsetY = 2;
	 	arcLen = 0;  //go back to 0	 
	 	arcRad += 25;  //increase radius
	 	yArcAxis += 25;  //move outward
	}
	for (i=(percentSales.length-1);i>=0;i--) {
		 // Put labels for the Pie Chart - first the names
		 yArcAxis += 25;
		segmentSalesPercent = (percentSales[i] / totalSales);
		var lbl = labelProduct[i] + " " + Math.round(segmentSalesPercent * 100).toString() + "%";
	 	var colour = colorSegment[i];
		context2.fillStyle = colour;
	 	context2.fillText(lbl,xArcAxis,yArcAxis-145);  //145 used to center label
	}
	
	
}