var fixgeometry2 = function() {
    /* Some orientation changes leave the scroll position at something
     * that isn't 0,0. This is annoying for user experience. */
    scroll(0, 0);

    /* Calculate the geometry that our content area should take */
    var header = $(".header:visible");
    var footer = $(".footer:visible");
    var content = $(".content:visible");
    var viewport_height = $(window).height();
    
    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    
    /* Trim margin/border/padding height */
    content_height -= (content.outerHeight() - content.height());
    content.height(content_height);
}; /* fixgeometry */

var colorcanvas1 = function(canvas, color) {
	if (canvas) {
		var canvasContext = canvas.getContext('2d');

		if (canvasContext) {
			canvasContext.fillStyle = color;
			canvasContext.fillRect(0, 0, canvas.width, canvas.height);
		}
	}
};

