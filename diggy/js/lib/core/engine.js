const engine = {};

	// get engine elem
engine.canvas = document.getElementById("game");

// CSS to dom fix. Lets you be lazy. :)
engine.canvas.setAttribute("width",engine.canvas.clientWidth);
engine.canvas.setAttribute("height",engine.canvas.clientHeight);

// get canvas context
engine.ctx = engine.canvas.getContext("2d");

// Stuff to render
engine.items = [];

const render = () => {
	// Clear engine.
	engine.ctx.clearRect(0,0,
		engine.width(),
		engine.height()
	);
	
	engine.items.forEach(item => {
		if(item.render){
			item.render(engine.ctx,{
				width:engine.width(),
				height:engine.height(),
			});
		}
	});
	
	window.requestAnimationFrame(render);
}

const distance = (a,b) => {
	return Math.sqrt(
		(b.x-a.x) * (b.x-a.x) // (x2 - x1)^2
		+
		(b.y-a.y) * (b.y-a.y) // (y2 - y1)^2
	);
}

const tick = () => {
	engine.items.forEach(item => {
	
		if(item.tick){
			item.tick();
		}
		
		if(item.solid){
			engine.items.forEach(other => {
				if(item == other) return;
				if(!other.solid) return;
				let d = distance(item,other);
				if(d < item.r + other.r){
					if(item.collide)item.collide(other);
				}
			})
		}
		
	});
	
	window.requestAnimationFrame(tick);
}

engine.width = () => {
	return engine.canvas.clientWidth;
}
engine.height = () => {
	return engine.canvas.clientHeight;
}

engine.add = item => {
	item.engine = engine;
	engine.items.push(item);
	if(item.init)item.init(engine);
}

engine.kickoffRenderLoop = () => {
	if(engine.__rendering)return;
	engine.__rendering = true;
	window.requestAnimationFrame(render);
	window.requestAnimationFrame(tick);
}

module.exports = engine;