/* Set serviceMode to true to create your own shapes: */
var serviceMode = false;

$(document).ready(function(){
	/* This code is executed after the DOM has been completely loaded */

	var str=[];
	var perRow = 16;
	
	/* Generating the dot divs: */
	
	for(var i=0;i<192;i++)
	{
		str.push('<div class="dot" id="d-'+i+'" />');
	}
	
	/* Joining the array into a string and adding it to the inner html of the stage div: */
	
	$('#stage').html(str.join(''));
	
	/* Using the hover method: */

	$('#navigation li a').hover(function(e){
	
		/* serviceDraw is a cut-out version of the draw function, used for shape editing and composing: */
		
		if(serviceMode)
			serviceDraw($(this).attr('class'));
		else
			draw($(this).attr('class'));
	}, function(e){
		
	});
	
	/* Caching the dot divs into a variable for performance: */
	dots = $('.dot');
	
	if(serviceMode)
	{
		/* If we are in service mode, show borders around the dot divs, add the export link, and listen for clicks: */
		
		dots.css({
			border:'1px solid black',
			width:dots.eq(0).width()-2,
			height:dots.eq(0).height()-2,
			cursor:'pointer'
		})
		
		$('<div/>').css({
			position:'absolute',
			bottom:-20,
			right:0
		}).html('<a href="" onclick="outputString();return false;">[Export Shape]</a>').appendTo('#stage');
		
		dots.click(function(){
			$(this).toggleClass('active');
		});
	}
});

var shapes={
	
	/* Each shape is described by an array of points. You can add your own shapes here,
	   just don't forget to add a coma after each array, except for the last one */
	
	house:[22,37,38,39,52,53,54,55,56,67,68,69,70,71,72,73,82,83,84,85,86,87,88,89,90,99,100,104,105,115,116,120,121,131,132,136,137,147,148,150,151,152,153,163,164,166,167,168,169],
	wrench:[22,23,24,25,26,27,38,39,40,41,42,43,54,55,58,59,70,71,86,87,88,89,101,102,103,104,105,116,117,118,131,132,133,146,147,148,163],
	envelope:[34,35,36,37,38,39,40,41,42,43,44,50,51,52,58,59,60,66,68,69,73,74,76,82,85,86,88,89,92,98,102,103,104,108,114,119,124,130,140,146,147,148,149,150,151,152,153,154,155,156],
	info:[22,23,38,39,69,70,71,86,87,102,103,118,119,134,135,150,151,166,167,168],
	blog:[2,3,4,5,6,7,8,9,10,11,18,19,27,34,35,37,38,39,40,43,50,51,59,66,67,75,82,83,85,86,87,91,98,99,107,114,115,117,118,119,120,121,123,130,131,139,146,147,155,162,163,171,178,179,180,181,182,183,184,185,186,187],
	code:[6,7,8,9,10,11,12,21,22,27,28,36,37,44,52,53,68,69,84,85,100,101,116,117,132,133,149,150,156,166,167,171,172,183,184,185,186,187,188],
    about:[16,17,18,19,20,24,25,26,27,28,33,37,41,45,49,54,57,61,65,70,73,77,81,86,89,90,91,92,97,102,105,109,113,118,121,125,129,134,137,141,145,149,153,157,160,161,162,163,164,168,169,170,171,172]
}

var stopCounter = 0;
var dots;

function draw(shape)
{
	/* This function draws a shape from the shapes object */
	
	stopCounter++;
	var currentCounter = stopCounter;

	dots.removeClass('active').css('opacity',0);
	
	$.each(shapes[shape],function(i,j){
		setTimeout(function(){
							
			/* If a different shape animaton has been started during the showing of the current one, exit the function  */
			if(currentCounter!=stopCounter) return false;
			
			dots.eq(j).addClass('active').fadeTo('slow',0.4);
			
			/* The fade animation is scheduled for 10*i millisecond in the future: */
		},10*i);

	});
}

function serviceDraw(shape)
{
	/* A cut out version of the draw function, used in service mode */
	
	dots.removeClass('active');
	
	$.each(shapes[shape],function(i,j){
		dots.eq(j).addClass('active');
	});
}

function outputString()
{
	/* Outputs the positions of the active dot divs as a comma-separated string: */
	
	var str=[];
	$('.dot.active').each(function(){
		
		str.push(this.id.replace('d-',''));
	})
	
	prompt('Insert this string as an array in the shapes object',str.join(','));
}
