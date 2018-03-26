// SUDDENLY TEMMIE

class Canvas {
	constructor() {
		
		// Resize handler.
		window.addEventListener('resize', this.resize.bind(this), true);
		
		// Create a canvas. this will be a fullscreen, unclickable thing.
		this.dom = document.createElement("canvas");
		this.dom.style.pointerEvents = "none"
		this.dom.style.position = "fixed";
		this.dom.style.left=0;
		this.dom.style.top=0;  
		document.body.appendChild(this.dom);
		
		// Easy access to context.
		this.ctx = this.dom.getContext("2d");
		
	}
	resize(){
		this.dom.width = window.innerWidth;
		this.dom.height = window.innerHeight 
	}
}

module.exports = Canvas;