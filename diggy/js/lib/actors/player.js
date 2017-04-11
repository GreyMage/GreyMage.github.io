import Actor from "./actor"

class Player extends Actor {

	constructor() {
		super();
		
		this.r = 10;
		this.speed = 4;
		this.solid = true;
		this.inputs = {
			left:false,
			right:false,
			up:false,
			down:false
		};
	}
	
	render(ctx) {
		
		super.render(ctx);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.stroke();
		
	} 
	
	tick() {
		super.tick();
		// Handle any movement
		this.move({
			 x:((this.inputs.right?1:0)*this.speed)-((this.inputs.left?1:0)*this.speed),
			 y:((this.inputs.down?1:0)*this.speed)-((this.inputs.up?1:0)*this.speed),
		});
	}
	
	handleKeyDown(event){
		if(event.keyCode === 65) this.inputs.left = true;
		if(event.keyCode === 68) this.inputs.right = true;
		if(event.keyCode === 87) this.inputs.up = true;
		if(event.keyCode === 83) this.inputs.down = true;
	}
	
	handleKeyUp(event){
		if(event.keyCode === 65) this.inputs.left = false;
		if(event.keyCode === 68) this.inputs.right = false;
		if(event.keyCode === 87) this.inputs.up = false;
		if(event.keyCode === 83) this.inputs.down = false;
	}
	
	init(engine){
		super.init(engine);
		console.log("I AM NOT A NUMBER");
		this.engine.canvas.addEventListener("keydown", event => { this.handleKeyDown(event); });
		this.engine.canvas.addEventListener("keyup", event => { this.handleKeyUp(event); });
	}
	
}

module.exports = Player;