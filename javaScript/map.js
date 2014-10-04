var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var step=50;
var tick=360;
var map;



var marker=[];
var polyline=[];
var poly2=[];


var poly=[];
var startLocation=[];
var endLocation=[];


var speed=0.00005,wait=1;

var startLoc=new Array();
var endLoc = new Array();
var IdS;
var IdE;
var IdDriver;
var clickIndex;


function RoadControl(controlDiv){
	controlDiv.style.padding='5px';
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor='white';
	controlUI.style.borderStyle='solid';
	controlUI.style.borderWidth='2px';
	controlDiv.appendChild(controlUI);

	controlText = document.createElement('div');
	controlText.style.width='263px';
	controlText.style.height = '25px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.style.background = 'url(image/road.jpg) no-repeat';
	controlUI.appendChild(controlText);
}

function initialize(){
	console.log("enter initialize function");
	infowindow = new google.maps.InfoWindow({
		size: new google.maps.Size(150,50)
	});

	var myLatlng = new google.maps.LatLng(1.352083, 103.819836);
	var mapOptions = {
		center:myLatlng,
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scaleControl:true,
		scaleControlOptions:{
			position: google.maps.ControlPosition.LEFT_BOTTOM,
		}
	};

	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	 var RoadControlDiv = document.createElement('div');
    var roadControl = new RoadControl(RoadControlDiv);
    RoadControlDiv.index = 1;
  	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(RoadControlDiv);

  	// initialize right click to set the starting and ending
	var ContextMenuControlDiv = document.createElement('DIV');   
	var ContextMenuControl = new createContextMenu(ContextMenuControlDiv, map);   
	ContextMenuControlDiv.index = 1;   
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(ContextMenuControlDiv);

  	IdS=0;
  	IdE=0;
  	clickIndex=0; //user click index
  	directionsDisplay = new Array();    
}  /////// end of initialize function


unction createContextMenu(controlUI,map){
	var contextmenu = document.createElement("div");   
	contextmenu.style.display = "none";   
	contextmenu.style.background = "#ffffff";   
	contextmenu.style.border = "10px solid #FFFFFF";
	contextmenu.style.border = 
	contextmenu.innerHTML =    
	"<a href='javascript:choosestart()'><div class='context' style='margin-bottom:0px'><b> start point</b> </div></a>"
	+ "<a href='#' onclick='javascript:chooseend()'><div class='context'><b> end point</b> </div></a>";
	controlUI.appendChild(contextmenu);   

	google.maps.event.addDomListener(map, 'rightclick', function (event) {   
		right_para1=event.latLng.lat();
		right_para2=event.latLng.lng();

		document.getElementById("pointhide").value = event.latLng.lat() + "," + event.latLng.lng();

		contextmenu.style.position="relative";   
		contextmenu.style.left=(event.pixel.x-80)+"px";   
		contextmenu.style.top=event.pixel.y+"px";   
		contextmenu.style.display = "block"; 
	});   

	google.maps.event.addDomListener(controlUI, 'click', function () {   
		contextmenu.style.display = "none";   
	});   

	google.maps.event.addDomListener(map, 'click', function () {   
		contextmenu.style.display = "none";   
	});   
	google.maps.event.addDomListener(map, 'drag', function () {   
		contextmenu.style.display = "none";   
	});   

}/////// end of right click sent address function

function choosestart()
{ 
	var startId=IdS++;
	document.getElementById("start").value = document.getElementById("pointhide").value;
	var startq=document.getElementById('start').value;
	//console.log("the start value and format is "+startq);
  //var temp1 = startq.split(",");
  //marker1.set('position',new google.maps.LatLng(parseFloat(temp1[0]), parseFloat(temp1[1])));
  //marker1.setMap(map);
  createMarker(startq,startId);
  startLoc[startId]=startq;
  console.log("startLoc index "+startId+", with value of "+startq);

}

function chooseend(lat,lng)
{ 
	var endId=IdE++;
	document.getElementById("end").value = document.getElementById("pointhide").value;
	var endq=document.getElementById('end').value;
  //var temp2 = endq.split(",");
  //marker2.set('position',new google.maps.LatLng(parseFloat(temp2[0]), parseFloat(temp2[1])));
  //marker2.setMap(map);
  createMarker(endq,endId);
  endLoc[endId]=endq;
  console.log("endLoc index "+endId+", with value of "+endq);
}


function createMarker(latlng,lable,image){
	var html=' ';
	//console.log("createMarker ("+latlng+", "+lable+", "+html+" )");
	var place = String(latlng);
	var temp1=place.split(",");
	//console.log("place for the marker is "+new google.maps.LatLng(parseFloat(temp1[0]),parseFloat(temp1[1])));
	var contentString = '<b>'+'User'+lable+'</b><br>'+html;
	var marker = new google.maps.Marker({
		position:new google.maps.LatLng(parseFloat(temp1[0]),parseFloat(temp1[1])),
		map:map,
		icon: image,
		title:String(lable),
		//zIndex:Math.round(latlng.lat()*-100000)<<5
		zIndex:100

	});
	var infowindow = new google.maps.InfoWindow();
	
	marker.myname = String(lable);
	google.maps.event.addListener(marker,'click',function(){
		infowindow.setContent(contentString);
		infowindow.open(map,marker);
	});
	return marker;
}///////////////////////////// end of create marker function

function myFunction(){
	directionService = new google.maps.DirectionsService();
	calcRoute(clickIndex,directionService);	
	clickIndex++;
}

function calcRoute(id,directionService){
	console.log("calculate route id is "+id);
	var infowindow1;
	var infowindow2;
	//var travel_mode;
	var movingIcon;
	var movingMarker;
	var altInfowindow;
	// var alarmIcon='image/bell.gif';

	var rendererOptions = {
		map:map,
		suppressMarkers: true,
		preserveViewport: true
	}

	var start;
	var end;
	
	if(document.getElementById('starttext').value=="From")
		start=startLoc[id];
	else{

		start=document.getElementById('starttext').value;
		IdS++;
		startLoc[IdS]=start;
	}

	if(document.getElementById('endtext').value=="To")
		end=endLoc[id];
	else{
		end=document.getElementById('endtext').value;
		IdE++;
		endLoc[IdE]=end;
	}
	console.log("")
	console.log("the start and end for this route is "+start+", "+end);
	console.log("");
	var temp1 = start.split(",");
	var temp2 = end.split(",");
	map.setCenter(new google.maps.LatLng((parseFloat(temp1[0])+parseFloat(temp2[0]))/2, (parseFloat(temp1[1])+parseFloat(temp2[1]))/2));
	map.setZoom(16);

	speed = document.getElementById('speed').value;
	step=parseFloat(tick)/3600.0*speed;

	console.log(" speed chosen is "+speed+" step is "+step);
	movingIcon='image/car1.png';

	//directionService = new google.maps.DirectionsService();
	var request = {
		origin:new google.maps.LatLng(parseFloat(temp1[0]), parseFloat(temp1[1])),
		destination:new google.maps.LatLng(parseFloat(temp2[0]), parseFloat(temp2[1])),
		travelMode:"DRIVING"
	};

	directionService.route(request,makeRouteCallback(id,directionsDisplay[id]));

   

    function makeRouteCallback(routeNum,disp){
    	if(polyline[routeNum] && (polyline[routeNum].getMap()!=null)){
    		startAnimation(routeNum);
    		return;
    	}
    	return function(response,status){
    		if(status==google.maps.DirectionsStatus.OK){
    			var bounds= new google.maps.LatLngBounds();
    			var route = response.routes[0];
    			startLocation[routeNum] = new Object();
    			endLocation[routeNum]=new Object();
    			

    			polyline[routeNum]= new google.maps.Polyline({
    				path:[],
    				strokeColor: "#272727",
    				strokeOpacity: 0.7,
    				strokeWeight: 5,
    				
    			});


    			poly2[routeNum]= new google.maps.Polyline({
    				path:[],
    				strokeColor: "#272727",
    				strokeOpacity: 0.7,
    				strokeWeight: 5
    			});


    			var path = response.routes[0].overview_path;
    			var legs = response.routes[0].legs;
    			disp = new google.maps.DirectionsRenderer(rendererOptions);
    			disp.setMap(map);
    			disp.setDirections(response);



    			for(i=0;i<legs.length;i++){
    				if(i==0){
    					startLocation[routeNum].latlng = legs[i].start_location;
						var a = String(startLocation[routeNum].latlng);  ///replace the parenthese
						a=a.replace(/[{()} ]/g, ''); 					
						startLocation[routeNum].address = legs[i].start_address;						
						marker[routeNum]=createMarker(a,id,movingIcon);   ////////////////////////// create moving marker
						//AlarmMarker[routeNum]=createAlarmMarker(a);
						//createSafeRegionOption(id);////////////////////craete safe region ooptin for this marker
						//on.push(0);  ///set the default false for displaying safe region
						//subjectRange.bindTo('center',marker[routeNum],'position');
					}
					endLocation[routeNum].latlng = legs[i].end_location;
					endLocation[routeNum].address = legs[i].end_address;
					var steps=legs[i].steps;

					for(j=0;j<steps.length;j++){
						var nextSegment = steps[j].path;
						for(k=0;k<nextSegment.length;k++){
							polyline[routeNum].getPath().push(nextSegment[k]);
						}
					}
				}
			}/// end of if service status is ok 
			polyline[routeNum].setMap(map);
			startAnimation(routeNum);
		}//// end of return function
	}// end of makePoint function

}//////////////////////////////// end of calculate route function


function updatePoly(i,d){
	if(poly2[i].getPath().getLength()>20){
		poly2[i] = new google.maps.Polyline([polyline[i].getPath().getAt(lastVertex-1)]);
	}

	if(polyline[i].GetIndexAtDistance(d)<lastVertex+2){
		if(poly2[i].getPath().getLength()>1){
			poly2[i].getPath().removeAt(poly2[i].getPath().getLength()-1)
		}
		poly2[i].getPath().insertAt(poly2[i].getPath().getLength(),polyline[i].GetPointAtDistance(d));
	}else{
		poly2[i].getPath().insertAt(poly2[i].getPath().getLength(),endLocation[i].latlng);
	}
}////////////////////// end of update poly function

function animate(index,d){
	if(d>eol[index]){
		marker[index].setPosition(endLocation[index].latlng);
		//AlarmMarker[index].setPosition(endLocation[index].latlng);
		//subjectPoint.setPoint="endLocation[index].latlng";
		return;
	}
	//console.log("the route distance is "+eol[index]+" the d step is "+d);
	//if(eol[index]-d<1.000){
	//	AlarmMarker[index].setVisible(false);
	//}
	var p = polyline[index].GetPointAtDistance(d);
	marker[index].setPosition(p);
	//AlarmMarker[index].setPosition(p);
	//subjectPoint.setPoint="p";
	updatePoly(index,d);
	timerHandle[index]=setTimeout("animate("+index+","+(d+step)+")",tick);
}///////////////////////// end of animate function

function startAnimation(index){
	if(timerHandle[index]) clearTimeout(timerHandle[index]);
	eol[index]=polyline[index].Distance();
	map.setCenter(polyline[index].getPath().getAt(0));
	poly2[index] = new google.maps.Polyline({path: [polyline[index].getPath().getAt(0)],strokeColor:"#272727",strokeWeight:5});
	timerHandle[index]=setTimeout("animate("+index+",50)",2000);

}/////////////// end of startAnimation




