import Actor from '../actor'

module.exports = class Button extends Actor {
	
	constructor(){
		super();
		
		this.x = 30;
		this.y = 30;
		this.w = 100; 
		this.h = 50;
		
		this.on("click",this.click,this);
		console.log("ow",this); 
	
	}
	
	tick(d,t){
		super.tick(d,t);
		this.ctx.fillRect(this.x,this.y,this.w,this.h); 
	}
	
	click(e){
		
		this._y = this._y || this.y;
		let distance = 10;
		
		var start = +new Date();
		var tick = ()=>{
			
			let now = +new Date();
			let d = (now - start), mo = d / 50; // motion
			this.y = this._y + (distance * Math.sin(mo));
			
			if (mo < Math.PI * 4) {
				requestAnimationFrame(tick);
			} else {
				this.y = this._y; // reset
			}
			
		};

		tick();
  
	}
		
}