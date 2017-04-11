import Actor from "./actor"

class Pickaxe extends Actor {

	constructor() {
		super();
		
		this.r = 3;
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
		ctx.fillStyle = 'rgba(0,255,0,0.5)';
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
	
	collide(other){
		console.log(other);
	}
	
	init(engine){
		super.init(engine);
		this.clazz="Pickaxe";
	}
	
}

module.exports = Pickaxe;