module.exports = ()=>{
	
	// Creates canvas-compatible test object.
	let test = {};
	let _x=0.0, _y=0.0;
	let x=_x, y=_y;
	let r = 0, rs = 5;
	let w=100,h=50;
	let fillStyle = "#FF0000";
	
	let canvas = null;
		 
	test.onSpawn = (ctx,newcanvas) => {
		canvas = newcanvas;
	}
	
	test.onTick = (ctx,delta,time) => {
		
		ctx.save();

			let distance = 10;
			let z = distance * (Math.sin(time / 1000));   
			y = _y+z+10;
			
			ctx.fillStyle = fillStyle;
			ctx.fillRect(x,y,w,h);
			//ctx.restore();
			
		ctx.restore();
	}
	
	test.onClick = (ctx,e) => {
		if(clicked(e)){
			e.preventDefault();
			e.stopPropagation();
			fillStyle = "#"+Math.floor(Math.random() * 16777216).toString(16);
			canvas.toggleShade();
		}
	}
	
	const clicked = e =>{
		if(e.clientY >= y && e.clientY <= y+h && e.clientX >= x && e.clientX <= x+w){
			return true;
		}
		return false;
	}
	
	return test;  
	
}