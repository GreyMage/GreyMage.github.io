// SUDDENLY TEMMIE
// THE GOAL: Make a small heart from undertale float down into the screen, and if clicked, begin a battle with temmie.
import Canvas from './lib/Canvas';
import Mouse from './lib/Mouse';

class Game {
	constructor() { 
			 
		// Create a canvas. this will be a fullscreen, unclickable thing.
		this.canvas = new Canvas();
		this.mouse = new Mouse();
		this.render = this.render.bind(this);
		this.tick = this.tick.bind(this);
		this.render();
		this.tick();
		
	}
	
	tick(){
		// let click = this.mouse.popClick();
		
		// if(click) console.log(click);
		
		setTimeout(this.tick,1000/20);
	}

	render(timestamp){
		//console.log(this,"render",timestamp);
		let click = this.mouse.popClick();
		if(click){
			console.log(click.clientX,click.clientY);
			this.canvas.ctx.fillRect(click.clientX-5,click.clientY-5,10,10);
		}
		
		window.requestAnimationFrame(this.render);
	}
	
}

const game = new Game();  