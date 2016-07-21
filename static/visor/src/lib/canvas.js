const canvas = {};
const dom = document.createElement('canvas');
const ctx = dom.getContext("2d");
const actors = [];


const main = ()=>{
	// Resize handler.
	window.addEventListener('resize', resize, true);
	
	// in-scope click handler
	window.addEventListener('dblclick', click, true);
	window.addEventListener('click', click, true);
	
	dom.id = "VISOR";
	document.body.appendChild(dom);
	
	resize();
	tick();
	
}

const click = e => {
	actors.forEach(actor => {
		if(actor.onClick) actor.onClick(ctx,e);
	})
}

const resize = e=>{
	dom.width = window.innerWidth;
	dom.height = window.innerHeight;
}

const addActor = actor => {
	if(actors.indexOf(actor) === -1){
		actors.push(actor);
		if(actor.onSpawn) actor.onSpawn(ctx,canvas);
	}
}

const rmActor = actor => {
	let i = actors.indexOf(actor);
	if(i !== -1){
		if(actor.onDestroy) actor.onDestroy(ctx);
		actors.splice(i,1);
	}
}

let lastTime = 0;
let shade = false;
const tick = time =>{
	
	// compute delta
	let delta = (time - lastTime) / 1000;
	// save stamp
	lastTime = time;
	
	// Clean screen
	ctx.clearRect(0, 0, dom.width, dom.height);
	if(shade){
		ctx.fillStyle = "rgba(255,255,255,0.75)";
		ctx.fillRect(0, 0, dom.width, dom.height);
	}
	
	actors.forEach(actor => {
		if(actor.onTick) actor.onTick(ctx,delta,time);
	})
	
	// Loop
	requestAnimationFrame(tick);
	
}

// attach helper methods
canvas.addActor = addActor;
canvas.rmActor = rmActor;
canvas.toggleShade = () => {
	shade = !shade;
}

// Init
main();

module.exports = canvas;