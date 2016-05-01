
function getOrderedDate(d) {
	return new Date(d.ordered);
}

function getLaidDownDate(d) {
	return new Date(d.laid_down);
}

function getLaunchDate(d) {
	return new Date(d.launched);
}

function getFateDate(d) {
	return new Date(d.fate);
}

function getAttackDate(d) {
	return new Date(d.attack_date);
}

var uboatNum = 1153,
	timelineStroke = 12,
	timelineSpacing = 1;

var margin = {top: 40, right: 20, bottom: 20, left: 60},
width = document.getElementById('chart').offsetWidth - margin.left - margin.right,
height = uboatNum*(timelineStroke+timelineSpacing);

var colorOrdered = "#ccc",
	colorOrderedHover = "#bbb",
	colorLaidDown = "#aaaaaa",
	colorLaidDownHover = "#999",
	colorLaunched = "#789dcd",
	colorLaunchedHover = "#5e8cc9",
	colorSunk = "#3670bc",
	colorDecommissioned = "#999",
	colorScuttled = "#555555",
	colorMissing = "#789dcd",
	colorSurrendered = "#fff",
	colorCaptured = "#e73f3f",
	colorGrounded = "#f4db36",
	colorGiven = "#8b5ec8",
	colorDamaged = "#42ba72",
	colorDestroyed = "#df6f3e",
	colorText = "#333",
	colorTextLight = "#666"
	colorWarMarkers = "#f28788"
	;

var svgContainer = d3.select("#chart")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("id","svg-container")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var timelineContainer = svgContainer
	.append("g")
		.attr("id","timeline-container");

var targetContainer = svgContainer
	.append("g")
		.attr("id","target-container");

var xAxisContainer = d3.select("#chart")
	.append("svg")
		.attr("class", "x-axis-container")
		.attr("width", width + margin.left + margin.right)
		.attr("height", 50)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var	minDate = new Date("1934"),
	maxDate = new Date("1/1/1946"),
	wwiiStart = new Date("9/1/1939"),
	wwiiEnd = new Date("5/7/1945");

var y = d3.scale.ordinal().rangeRoundBands([0, height], 1, 0);

var	x = d3.time.scale().domain([minDate, maxDate]).range([0, width]);

var tooltip = d3.select("#tooltip");
	var tooltip_left = 50, tooltip_top = 35;

window.onmousemove = function (e) {
	var mousex = e.clientX,
		mousey = e.clientY;
	$("#tooltip").css( "top", (mousey + 20) + 'px' );
	$("#tooltip").css( "left", (mousex + 20) + 'px' );
};

var xAxisBackground = xAxisContainer.append("g")
	.attr("class", "x-axis-background")
	.append("line")
	.attr("x1", -100)
	.attr("x2", width+100)
	.attr("y1", -12)
	.attr("y2", -12)
	.attr("stroke-width", 56)
	.attr("stroke", "#eee");

var markersGroup = svgContainer.append("g").
	attr("id", "markers-group");
var markersTextGroup = xAxisContainer.append("g");

//Markers - Timeline section

var wwiiStartMarker = markersGroup.append("line")
	.attr("x1", x(wwiiStart))
	.attr("y1", -12)
	.attr("x2", x(wwiiStart))
	.attr("y2", height)
	.attr("stroke-width", 1)
	.attr("shape-rendering","crispEdges")
	.attr("stroke", colorWarMarkers);
var wwiiEndMarker = markersGroup.append("line")	
	.attr("x1", function(d) { return x(wwiiEnd) })
	.attr("y1", -14)
	.attr("x2", function(d) { return x(wwiiEnd) })
	.attr("y2", height)
	.attr("stroke-width", 1)
	.attr("shape-rendering","crispEdges")
	.attr("stroke", colorWarMarkers);

//Markers - Top section

var wwiiStartMarkerText = markersTextGroup.append("text")
	.attr("class","wwii-marker-text")
	.attr("x", x(wwiiStart))
	.attr("y", -20)
	.attr("fill", colorWarMarkers)
	.attr("text-anchor", "middle")
	.text("WWII Begins");
var wwiiEndMarkerText = markersTextGroup.append("text")
	.attr("class","wwii-marker-text")
	.attr("x", x(wwiiEnd))
	.attr("y", -20)
	.attr("fill", colorWarMarkers)
	.attr("text-anchor", "middle")
	.text("WWII Ends");
var wwiiStartMarkerTop = markersTextGroup.append("line")
	.attr("x1", x(wwiiStart))
	.attr("y1", -12)
	.attr("x2", x(wwiiStart))
	.attr("y2", 30)
	.attr("stroke-width", 1)
	.attr("shape-rendering","crispEdges")
	.attr("stroke", colorWarMarkers);
var wwiiEndMarkerTop = markersTextGroup.append("line")	
	.attr("x1", function(d) { return x(wwiiEnd) })
	.attr("y1", -14)
	.attr("x2", function(d) { return x(wwiiEnd) })
	.attr("y2", 30)
	.attr("stroke-width", 1)
	.attr("shape-rendering","crispEdges")
	.attr("stroke", colorWarMarkers);

var xAxis = d3.svg.axis()
	.scale(x)
	.tickSize(-(height), 0, 0)
	.orient("top");

var yAxis = d3.svg.axis()
	.scale(y)
	.tickSize(0)
	.tickPadding(10)
	.orient("left");


//DATA DRAW FUNCTION

d3.csv("data/uboat-data.csv", function(error, data) {
	if (error) throw error;

	y.domain(data.map(function(d) { return d.name; }));

	var xAxisOverlayGroup = xAxisContainer.append("g")
		.attr("class", "x-axis-overlay")
		.call(xAxis);

	var xAxisGroup = svgContainer.append("g")
		.attr("class", "x axis")
		.call(xAxis);

	var yAxisGroup = svgContainer.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	
	drawTimeline(data);
	drawLegendCareer();
	drawLegendFate(data);
//	drawFilter(data);
	
	d3.csv("data/uboat-target-data.csv", function(error, data) {
		drawTargets(data);
	});

});

// Draw Legend Career

var legendSpacing = 8,
	legendWidth = 172
	legendOffset = 10
	careerLineLength = 16;

function drawLegendCareer() {

	var careerLegendMarks = [
	  { name: 'Ordered', color: colorOrdered }, 
	  { name: 'Under Construction', color: colorLaidDown },
	  { name: 'In Service', color: colorLaunched },
	  { name: 'Target Sunk', color: colorLaunched }
	];

	var legendFate = d3.select("#legend-career")
		.append("svg")
			.attr("width", legendWidth)
			.attr("height", careerLegendMarks.length*(legendSpacing+timelineStroke))
		.append("g")
			.attr("id","svg-legend-fate");

	var legendFateItem = legendFate.selectAll("g")
		.data(careerLegendMarks)
		.enter()
		.append('g')
		.attr('class', 'legend-fate-item')
		.attr('transform', function(d, i) {
			var height = timelineStroke + legendSpacing;
			var horz = -2 * timelineStroke+24;
			var vert = i * height+legendOffset;
			return 'translate(' + horz + ',' + vert + ')';
		});

	legendFateItem.append('line')
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", careerLineLength)
		.attr("y2", 0)
		.attr("stroke-width", timelineStroke)
		.attr("stroke", function(d) { return d.color;});

	legendFateItem.append('text')                       
		.attr('x', timelineStroke + 12)
		.attr('y', 5)
		.text(function(d) { return d.name; });

	//Target line
	legendFate.append('line')
		.attr("x1", careerLineLength/2-1)
		.attr("y1", 0)
		.attr("x2", careerLineLength/2+1)
		.attr("y2", 0)
		.attr("stroke-width", timelineStroke)
		.attr("stroke", colorSunk)
		.attr("shape-rendering","crispEdges")
		.attr('transform', function(d, i) {
			var height = timelineStroke + legendSpacing;
			var horz = -2 * timelineStroke+24;
			var vert = 3 * height+legendOffset;
			return 'translate(' + horz + ',' + vert + ')';
		});

}

// Draw Legend Fate

function drawLegendFate(data) {

	var fateTypeCount = d3.nest()
		.key(function(d) { return d.fate_type; })
		.rollup(function(v) { return v.length; })
		.entries(data);

	fateTypeCount.sort(function(a,b) {return b.values-a.values;});

	var legendFate = d3.select("#legend-fate")
		.append("svg")
			.attr("width", legendWidth)
			.attr("height", fateTypeCount.length*(legendSpacing+timelineStroke))
		.append("g")
			.attr("id","svg-legend-fate");

	var legendFateItem = legendFate.selectAll("g")
		.data(fateTypeCount)
		.enter()
		.append('g')
		.attr('class', 'legend-fate-item')
		.attr('transform', function(d, i) {
			var height = timelineStroke + legendSpacing;
			var horz = -2 * timelineStroke+30;
			var vert = i * height+legendOffset;
			return 'translate(' + horz + ',' + vert + ')';
		});

	legendFateItem.append('circle')
		.attr("r", timelineStroke/2)
		.attr("fill", function(d) {
			switch (d.key) {
			case "Sunk":
				return colorSunk
				break;
			case "Decommissioned":
				return colorDecommissioned
				break;
			case "Scuttled":
				return colorScuttled
				break;
			case "Missing":
				return colorMissing
				break;
			case "Surrendered":
				return colorSurrendered
				break;
			case "Captured":
				return colorCaptured
				break;
			case "Grounded":
				return colorGrounded
				break;
			case "Given":
				return colorGiven
				break;
			case "Damaged":
				return colorDamaged
				break;
			case "Destroyed":
				return colorDestroyed
				break;
		};
	});

	legendFateItem.append('text')                       
		.attr('x', timelineStroke + 4)
		.attr('y', 5)
		.attr('fil', colorText)
		.text(function(d) { return d.key; });

	legendFateItem.append('text')                       
		.attr('x', legendWidth-legendOffset)
		.attr('y', 5)
		.attr('fill', colorTextLight)
		.attr('text-anchor', 'end')
		.text(function(d) { return d.values; });
}

function drawTimeline(data) {

	//ORDERED

	$('#timeline-container').empty();

	var orderedLinesGroup = timelineContainer.append("g");

	var orderedLines = orderedLinesGroup.selectAll("line")
		.data(data)
		.enter()
		.append("line")
		.attr("class","ordered-line")
		.attr("x1", function(d) { return x(getOrderedDate(d)) })
		.attr("y1", function(d) { return y(d.name); })
		.attr("x2", function(d) { return x(getLaidDownDate(d)) })
		.attr("y2", function(d) { return y(d.name); })
		.attr("stroke-width", timelineStroke)
		.attr("stroke", colorOrdered)
		.on("mouseover", function(d) {	
			d3.select(this).attr("stroke", colorOrderedHover)
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 1);
			dayDistance = Math.round((getLaidDownDate(d)-getOrderedDate(d))/86400000); //This is returning PIXELS, not actual DAYS
			tooltip.html(								
					"<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'> Ordered " 
					+ d.ordered + "</td></tr><tr><td colspan='2'> Laid Down "
					+ d.laid_down +  "</td></tr><tr><td colspan='2'>"
					+ dayDistance + " days before construction</td></tr>"
					);
		})					
		.on("mouseout", function(d) {
			d3.select(this).attr("stroke", colorOrdered)
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 0);
		});

//LAID DOWN

	var dayDistance = 0;

	var laidDownLinesGroup = timelineContainer.append("g");

	var laidDownLines = laidDownLinesGroup.selectAll("line")
		.data(data)
		.enter()
		.append("line")
		.attr("x1", function(d) { return x(getLaidDownDate(d)) })
		.attr("y1", function(d) { return y(d.name); })
		.attr("x2", function(d) { return x(getLaunchDate(d)) })
		.attr("y2", function(d) { return y(d.name); })
		.attr("stroke-width", timelineStroke)
		.attr("stroke", colorLaidDown)
		.on("mouseover", function(d) {
			d3.select(this).attr("stroke", colorLaidDownHover)
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 1);
			dayDistance = Math.round((getLaunchDate(d)-getLaidDownDate(d))/86400000); //This is returning PIXELS, not actual DAYS
			tooltip.html(								
					"<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'> Laid Down " 
					+ d.laid_down + "</td></tr><tr><td colspan='2'> Launched "
					+ d.launched +  "</td></tr><tr><td colspan='2'>"
					+ dayDistance + " days under construction</td></tr><tr><td colspan='2'>Constructed at "
					+ d.shipyard + "</td></tr>"
					);
		})					
		.on("mouseout", function(d) {
			d3.select(this).attr("stroke", colorLaidDown)
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 0);
		});

//LAUNCHED

	var launchedLinesGroup = timelineContainer.append("g");

	var launchedLines = launchedLinesGroup.selectAll("line")
		.data(data)
		.enter()
		.append("line")
		.attr("x1", function(d) { return x(getLaunchDate(d)) })
		.attr("y1", function(d) { return y(d.name); })
		.attr("x2", function(d) { return x(getFateDate(d)) })
		.attr("y2", function(d) { return y(d.name); })
		.attr("stroke-width", timelineStroke)
		.attr("stroke", colorLaunched)
		.attr("class","launched-line")
		.on("mouseover", function(d) {

			d3.select(this).attr("stroke", colorLaunchedHover)

			tooltip.transition()		
				.duration(50)		
				.style("opacity", 1);
			dayDistance = Math.round((getFateDate(d)-getLaunchDate(d))/86400000); //This is returning PIXELS, not actual DAYS

			tooltip.html(							
					"<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'> Launched " 
					+ d.ordered + "</td></tr><tr><td colspan='2'>"
					+ d.fate_type + " " + d.fate +  "</td></tr><tr><td colspan='2'>"
					+ d.ships_sunk + " ships sunk</td></tr><tr><td colspan='2'>"
					+ dayDistance + " days in service</td></tr>"
					);
		})					
		.on("mouseout", function(d) {
			d3.select(this).attr("stroke", colorLaunched)
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 0);
		});

//FATE

	var fateCirclesGroup = timelineContainer.append("g");

	var fateCircles = fateCirclesGroup.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return x(getFateDate(d)); })
		.attr("cy", function (d) { return y(d.name); })
		.attr("r", timelineStroke/2)
		.attr("fill", function(d) {
			switch (d.fate_type) {
			case "Sunk":
				return colorSunk
				break;
			case "Decommissioned":
				return colorDecommissioned
				break;
			case "Scuttled":
				return colorScuttled
				break;
			case "Missing":
				return colorMissing
				break;
			case "Surrendered":
				return colorSurrendered
				break;
			case "Captured":
				return colorCaptured
				break;
			case "Grounded":
				return colorGrounded
				break;
			case "Given":
				return colorGiven
				break;
			case "Damaged":
				return colorDamaged
				break;
			case "Destroyed":
				return colorDestroyed
				break;
			}
		})
		.on("mouseover", function(d) {						
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 1);
			dayDistance = Math.round((getFateDate(d)-getLaunchDate(d))/86400000); //This is returning PIXELS, not actual DAYS

			function getFateCasualties(d) {
				switch (d.fate_type) {
					case "Sunk":
					case "Captured":
					case "Missing":
						return "<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'>"
								+ d.fate_type + " on " + d.fate +  "</td></tr><tr><td colspan='2'>"
								+ d.fate_survivors + " survivors, " + d.fate_dead + " dead</td></tr>"
						break;
					case "Decommissioned":
					case "Scuttled":
					case "Surrendered":
					case "Grounded":
					case "Destroyed":
					case "Damaged":
					case "Given":
						return "<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'>"
								+ d.fate_type + " on " + d.fate +  "</td></tr>"
						break;
				}
			}

			tooltip.html(getFateCasualties(d));
		})
		.on("mouseout", function(d) {		
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 0);
		});

	}

	function drawTargets(data) {

		$('#target-container').empty();

		var targetLinesGroup = d3.select("#target-container")
			.append("g");

		var targetLines = targetLinesGroup.selectAll("line")
			.data(data)
			.enter()
			.append("line")
				.attr("x1", function(d) { return x(getAttackDate(d)) })
				.attr("y1", function(d) { return y(d.name); })
				.attr("x2", function(d) { return x(getAttackDate(d))+1 })
				.attr("y2", function(d) { return y(d.name); })
				.attr("stroke-width", timelineStroke)
				.attr("stroke", colorSunk)
				.attr("shape-rendering","crispEdges");
	}

//			d3.select('#slider3').call(d3.slider().axis(true).value( [ 1934, 1946 ] ).on("slide", function(evt, value) {
//				updateDate(value[ 0 ], value[ 1 ]);
//			}));
//			
//			updateDate(1934, 1946);


//// Draw Type Filter
//			
//			function drawFilter(data) {
//				
//				var shipTypeCount = d3.nest()
//					.key(function(d) { return d.type; })
//					.rollup(function(v) { return v.length; })
//					.entries(data);
//							
//				//shipTypeCount.sort(function(a,b) {return b.values-a.values;});
//				
//				var typeDropdown = d3.select("#dropdown-type")
//					.append("select")
//					.attr("id","dropdown-type-select");
//				
//				var typeDropdownOption = typeDropdown
//					.selectAll("option")
//					.data(shipTypeCount)
//					.enter()
//					.append("option")
//					.text(function(d) {return d.key;});
//				
////				var nameInput = d3.select("#name-input");
//				var nameInput = $("#name-input");
//				
//				var filterButton = d3.select("#filter-button")
//					.on("click", function(d) {
//					
//						var typeIndex = $("#dropdown-type-select").selectedIndex;
//						//var	selectedTypeName = shipTypeCount[selectedType];
//						var	typeName = typeDropdown.options[typeIndex].text;
//						
//						//var selectedName = $("#name-input").value;
//						
//						console.log(typeIndex);
//						//console.log(selectedName);
//						console.log(typeName);
//						
////						redraw();
//					})	
//				
//			}

//			function redraw() {
//				
//				
//				
//				drawTimeline(data);
//				drawLegendCareer();
//				drawLegendFate(data);
//				drawTypeFilter(data);
//			}
//
//			function updateDate(yearStart, yearEnd) {
//				
//				d3.select('#slider3textmin').text(yearStart);
//				d3.select('#slider3textmax').text(yearEnd);
//				
//				var yearStartDate = new Date("1/1/"+yearStart.toString());
//				var yearEndDate = new Date("1/1/"+yearEnd.toString());
//				
//				if (yearStartDate != yearEndDate ) {
//					
//					d3.csv("data/uboat-data.csv", function(error, data) {
//
//						x.domain([yearStartDate, yearEndDate]).range([0, width]);
//
//						var svg = d3.select("body").transition();
//
//						svg.select(".x.axis") // change the x axis
//							.duration(750)
//							.call(xAxis);
//						svg.select(".x-axis-overlay") // change the x axis
//							.duration(750)
//							.call(xAxis);
//					
//						drawTimeline(data);
//					});
//					
//					d3.csv("data/uboat-target-data.csv", function(error, data) {
//						x.domain([yearStartDate, yearEndDate]).range([0, width]);
//						drawTargets(data);
//					});
//				}
//			}