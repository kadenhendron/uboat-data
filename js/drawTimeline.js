var format = d3.time.format("%B %e, %Y");
//var format = d3.time.format("%x");

function formatDate(dateToConvert) {
	return format(new Date(dateToConvert));
}

var uboatNum = 1153,
	timelineStroke = 12,
	timelineSpacing = 1;

var margin = {top: 40, right: 20, bottom: 20, left: 60},
	width = document.getElementById('chart').offsetWidth - margin.left - margin.right,
	height = uboatNum * (timelineStroke + timelineSpacing);

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
	colorTextLight = "#666",
	colorWarMarkers = "#f28788";

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

var xAxisTop = d3.svg.axis()
	.scale(x)
	.tickSize(-20, 0)
	.tickPadding(4)
	.orient("top");

var xAxis = d3.svg.axis()
	.scale(x)
	.tickSize(-(height))
	.orient("top");

var yAxis = d3.svg.axis()
	.scale(y)
	.tickSize(0)
	.tickPadding(10)
	.orient("left");

function xAxisScroll() {
	var $el =  $(".x-axis-container");
	var offset = $el.offset().top;
	
	$(window).scroll(function(e){
		
		var isPositionFixed = ($el.css('position') == 'fixed');
		var left_offset = $("#chart-container").offset().left;
		var right_offset = ($(window).width() - ($("#chart-container").offset().left + $("#chart-container").outerWidth()));

		if ($(this).scrollTop() > offset && !isPositionFixed){ 
			$el.css({'position': 'fixed', 'top': '0px', 'left': left_offset });
			$('#side-content').css({'position': 'fixed', 'top': '18px', 'right': right_offset });
		}
		if ($(this).scrollTop() < offset) {
			$el.css({'position': 'absolute', 'top': '-8px', 'left': 0});
			$('#side-content').css({'position': 'absolute', 'top': '6px', 'right': 0});
		} 
	});
	
	$(window).resize(function(){
		
		var isPositionFixed = ($el.css('position') == 'fixed');
		var left_offset = $("#chart-container").offset().left;
		var right_offset = ($(window).width() - ($("#chart-container").offset().left + $("#chart-container").outerWidth()));
		
		if ($(this).scrollTop() > offset && !isPositionFixed){ 
			$el.css({'position': 'fixed', 'top': '0px', 'left': left_offset });
			$('#side-content').css({'position': 'fixed', 'top': '18px', 'right': right_offset });
		}
	});
}

function drawWWIIMarkers(svgContainer, xAxisContainer) {
	
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
}

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
	
	timelineContainer = d3.select("#timeline-container");

	var orderedLinesGroup = timelineContainer.append("g");

	var orderedLines = orderedLinesGroup.selectAll("line")
		.data(data)
		.enter()
		.append("line")
		.attr("class","ordered-line")
		.attr("x1", function(d) { return x(d.ordered) })
		.attr("y1", function(d) { return y(d.name); })
		.attr("x2", function(d) { return x(d.laid_down) })
		.attr("y2", function(d) { return y(d.name); })
		.attr("stroke-width", timelineStroke)
		.attr("stroke", colorOrdered)
		.on("mouseover", function(d) {	
			d3.select(this).attr("stroke", colorOrderedHover)
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 1);
			dayDistance = Math.round((d.laid_down-d.ordered)/86400000); //This is returning PIXELS, not actual DAYS
			tooltip.html(								
					"<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'> Ordered " 
					+ formatDate(d.ordered) + "</td></tr><tr><td colspan='2'> Laid Down "
					+ formatDate(d.laid_down) +  "</td></tr><tr><td colspan='2'>"
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
		.attr("x1", function(d) { return x(d.laid_down) })
		.attr("y1", function(d) { return y(d.name); })
		.attr("x2", function(d) { return x(d.launched) })
		.attr("y2", function(d) { return y(d.name); })
		.attr("stroke-width", timelineStroke)
		.attr("stroke", colorLaidDown)
		.on("mouseover", function(d) {
			d3.select(this).attr("stroke", colorLaidDownHover)
			tooltip.transition()		
				.duration(50)		
				.style("opacity", 1);
			dayDistance = Math.round((d.launched-d.laid_down)/86400000); //This is returning PIXELS, not actual DAYS
			tooltip.html(								
					"<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'> Laid Down " 
					+ formatDate(d.laid_down) + "</td></tr><tr><td colspan='2'> Launched "
					+ formatDate(d.launched) +  "</td></tr><tr><td colspan='2'>"
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
		.attr("x1", function(d) { return x(d.launched) })
		.attr("y1", function(d) { return y(d.name); })
		.attr("x2", function(d) { return x(d.fate) })
		.attr("y2", function(d) { return y(d.name); })
		.attr("stroke-width", timelineStroke)
		.attr("stroke", colorLaunched)
		.attr("class","launched-line")
		.on("mouseover", function(d) {

			d3.select(this).attr("stroke", colorLaunchedHover)

			tooltip.transition()		
				.duration(50)		
				.style("opacity", 1);
			dayDistance = Math.round((d.fate-d.launched)/86400000); //This is returning PIXELS, not actual DAYS

			tooltip.html(							
					"<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'> Launched " 
					+ formatDate(d.launched) + "</td></tr><tr><td colspan='2'>"
					+ d.fate_type + " " + formatDate(d.fate) +  "</td></tr><tr><td colspan='2'>"
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
		.attr("cx", function (d) { return x(d.fate); })
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
			dayDistance = Math.round((d.fate-d.launched)/86400000); //This is returning PIXELS, not actual DAYS

			function getFateCasualties(d) {
				switch (d.fate_type) {
					case "Sunk":
					case "Captured":
					case "Missing":
						return "<tr><td>" + d.name + "</td><td>Type " + d.type + "</td></tr> <tr><td colspan='2'>"
								+ d.fate_type + " " + formatDate(d.fate) +  "</td></tr><tr><td colspan='2'>"
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
								+ d.fate_type + " " + formatDate(d.fate) +  "</td></tr>"
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
				.attr("x1", function(d) { return x(d.attack_date) })
				.attr("y1", function(d) { return y(d.name); })
				.attr("x2", function(d) { return x(d.attack_date)+1})
				.attr("y2", function(d) { return y(d.name); })
				.attr("stroke-width", timelineStroke)
				.attr("stroke", colorSunk)
				.attr("shape-rendering","crispEdges");
	}

//	d3.select('#slider3').call(d3.slider().axis(true).value( [ 1934, 1946 ] ).on("slide", function(evt, value) {
//		updateDate(value[ 0 ], value[ 1 ]);
//	}));
//
//	updateDate(1934, 1946);


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


function sortData(data, sortOption) {
	
	switch (sortOption) {
		case "shipName":
			//data = data.sort(function(a, b) { return d3.ascending(a.name, b.name); });
			break;
		case "shipType":
			data = data.sort(function(a, b) { return d3.ascending(a.type, b.type); });
			break;
		case "orderedDate":
			data = data.sort( function(a, b) { return a.ordered - b.ordered ;} );
			break;
		case "laidDownDate":
			data = data.sort( function(a, b) { return a.laid_down - b.laid_down ;} );
			break;
		case "launchedDate":
			data = data.sort( function(a, b) { return a.launched - b.launched ;} );
			break;
		case "fateDate":
			data = data.sort( function(a, b) { return a.fate - b.fate ;} );
			break;
		case "fateType":
			data = data.sort(function(a, b) { return d3.ascending(a.fate_type, b.fate_type); });
			break;
		case "shipyard":
			data = data.sort(function(a, b) { return d3.ascending(a.shipyard, b.shipyard); });
			break;
		case "shipsSunk":
			data = data.sort(function(a,b) {return b.ships_sunk - a.ships_sunk;});
			break;
	};
	
	return data;
}

//DATA PULL FUNCTION

function runDraw(firstTime, sortOption) {
	
	d3.csv("data/uboat-data.csv", function(error, data) {
		if (error) throw error;

		data.forEach(function(d) {
			d.ordered = new Date(d.ordered);
			d.laid_down = new Date(d.laid_down);
			d.launched = new Date(d.launched);
			d.fate = new Date(d.fate);
			d.value = +d.value;
		});
		
		sortData(data, sortOption);		
		
		//d3.select("#chart").hasChildNodes == false
		if ( true ) {
			var svgContainer = d3.select("#chart")
				.append("svg")
					.attr("id", "svg-container")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var timelineContainer = svgContainer
				.append("g")
				.attr("id", "timeline-container");

			var targetContainer = svgContainer
				.append("g")
					.attr("id", "target-container");

			var xAxisContainer = d3.select("#chart")
				.append("svg")
					.attr("class", "x-axis-container")
					.attr("width", width + margin.left + margin.right)
					.attr("height", 48)
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			xAxisScroll();

			var xAxisBackground = xAxisContainer.append("g")
					.attr("class", "x-axis-background")
				.append("line")
					.attr("x1", -100)
					.attr("x2", width+100)
					.attr("y1", -12)
					.attr("y2", -12)
					.attr("stroke-width", 56)
					.attr("stroke", "#eee");
			
			if (firstTime) {
				drawLegendCareer();
				drawLegendFate(data);
			}
		}

		y.domain(data.map(function(d) { return d.name; }));

		var xAxisOverlayGroup = xAxisContainer.append("g")
			.attr("class", "x-axis-overlay")
			.call(xAxisTop);

		var xAxisGroup = svgContainer.append("g")
			.attr("class", "x axis")
			.call(xAxis);

		var yAxisGroup = svgContainer.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		drawTimeline(data);
		drawWWIIMarkers(svgContainer, xAxisContainer);
	//	drawFilter(data);

		d3.csv("data/uboat-target-data.csv", function(error, data) {
			data.forEach(function(d) {
				d.attack_date = new Date(d.attack_date);
				d.value = +d.value;
			});

			drawTargets(data);
		});
	});
}

runDraw(true, "shipName");

$('#redraw-button').click(function() {
	
	var sortDropdown = document.getElementById("sort-options");
	var sortOption = sortDropdown.options[sortDropdown.selectedIndex].value;
	
	$('#chart').fadeOut('1000', function() {
		$('#chart').empty();
		runDraw(false, sortOption);
		$('#chart').fadeIn('1000');
	});
});