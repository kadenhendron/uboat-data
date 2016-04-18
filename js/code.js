$( document ).ready(function() {
	var offset = $(".x-axis-container").offset().top;
	
	$(window).scroll(function(e){ 
		var $el = $('.x-axis-container'); 
		var isPositionFixed = ($el.css('position') == 'fixed');
		var left_offset = $("#chart-container").offset().left;
		var right_offset = ($(window).width() - ($("#chart-container").offset().left + $("#chart-container").outerWidth()));

		if ($(this).scrollTop() > offset && !isPositionFixed){ 
			$('.x-axis-container').css({'position': 'fixed', 'top': '0px', 'left': left_offset });
			$('#legend').css({'position': 'fixed', 'top': '20px', 'right': right_offset });
		}
		if ($(this).scrollTop() < offset) {
			$('.x-axis-container').css({'position': 'absolute', 'top': '-8px', 'left': 0});
			$('#legend').css({'position': 'absolute', 'top': '6px', 'right': 0});
		} 
	});
	
	$(window).resize(function(){ 
		var left_offset = $("#chart-container").offset().left;
		var right_offset = ($(window).width() - ($("#chart-container").offset().left + $("#chart-container").outerWidth()));
		
		$('.x-axis-container').css({'left': left_offset });
		$('#legend').css({'right': right_offset }); 
	});
});
