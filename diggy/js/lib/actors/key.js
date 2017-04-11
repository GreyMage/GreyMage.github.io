
const key = {};

key.x = 200;
key.y = 159;
key.r = 3;
key.solid = true;

key.render = ctx => {
	
	ctx.beginPath();
	ctx.arc(key.x, key.y, key.r, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'rgba(255,0,0,0.8)';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.stroke();
	
}

key.tick = () => {
	if(key.dead){ 
		key.r = 0;
		key.solid = false;
	}
}

key.collide = other => {
	console.log("YOU WIN!");
	key.dead = true;
}

key.init = () => {

}

module.exports = key;