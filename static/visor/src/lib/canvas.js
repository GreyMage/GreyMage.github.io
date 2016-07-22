const canvas = {};
const dom = document.createElement('canvas');
const ctx = dom.getContext("2d");
const actors = [];

let tickCycle = true;

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

const sleep = () => {
	tickCycle = false;
}

const wake = () => {
	tickCycle = true;
}

const click = e => {
	actors.forEach(actor => {
		if(isClicked(e,actor)) actor.emit("click",e);
	});
}

const resize = e=>{
	dom.width = window.innerWidth;
	dom.height = window.innerHeight;
}

const isClicked = (e,actor) =>{
	let hb = actor.hitbox;
	if(e.clientY >= hb.y && e.clientY <= hb.y+hb.h && e.clientX >= hb.x && e.clientX <= hb.x+hb.w){
		return true;
	}
	return false;
}

const addActor = actor => {
	if(actors.indexOf(actor) === -1){
		actors.push(actor);
		actor.spawn(ctx,canvas);
	}
}

const rmActor = actor => {
	let i = actors.indexOf(actor);
	if(i !== -1){
		actor.destroy();
		actors.splice(i,1);
	}
}

let lastTime = 0;
let shade = false;
const tick = time =>{
	
	// Put next frame online.
	requestAnimationFrame(tick);
	
	//skip maybe
	if(!tickCycle) { return; }
	
	// compute delta
	let delta = ((time - lastTime) / 1000) || 0;
	// save stamp
	lastTime = time;
	
	// Clean screen
	ctx.clearRect(0, 0, dom.width, dom.height);
	if(shade){
		ctx.fillStyle = "rgba(255,255,255,0.75)";
		ctx.fillRect(0, 0, dom.width, dom.height);
	}
	
	actors.forEach(actor => {
		actor.tick(delta,time);
	})
	
}

// attach helper methods
canvas.addActor = addActor;
canvas.rmActor = rmActor;
canvas.sleep = sleep;
canvas.wake = wake;

canvas.toggleShade = () => {
	shade = !shade;
}

// Init
main();

module.exports = canvas;