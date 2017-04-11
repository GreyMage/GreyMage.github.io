class Actor {

	constructor() {
		this.x = 0;
		this.y = 0;
		this.r = 0;
		this.speed = 0;
		this.solid = false;
		this.inputs = {};
	}

	init(engine){
		this.engine = engine;
		this.class="Actor";
	}
	
	tick(){}
	
	render(ctx){}

	move(delta) {
		this.x += delta.x || 0;
		this.y += delta.y || 0;
	}
  
}

module.exports = Actor;