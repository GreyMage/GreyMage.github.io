module.exports = ()=>{
	
	// Creates canvas-compatible test object.
	let test = {};
	let _x=0.0, _y=0.0;
	let x=_x, y=_y;
	let r = 0, rs = 5;
	let w=50,h=50;
	let fillStyle = "#FF0000";
	let flashspeed = 5;
	
	let age_t = 0;
	let age_f = 0;
	
	let canvas = null;
	let sprite = null;
	
	// t-vars are things used primarily in the tick cycle
	let t_flashing = false; // used in tick 
		 
	function dataURItoBlob(dataURI) {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		var byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
		  ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		var blob = new Blob([ab], {type: mimeString});
		return blob;

	}
	
		 
	test.onSpawn = (ctx,newcanvas) => {
		canvas = newcanvas;		
		// Load images
		let temp = dataURItoBlob(require("../../sprite/heart-wings.png"));	
		createImageBitmap(temp).then(function(data){
			sprite = data;
		});
		
	}
	
	test.onTick = (ctx,delta,time) => {
		
		// Increment Age
		//console.log(age_t);
		age_t = age_t + (delta * 1000);
		age_f++;

			let distance = 30 + (Math.sin(age_t/50)) + (age_t / 1000);
			let z = distance * (Math.sin(age_t / 1000));   
			let zz = distance * (Math.cos(age_t / 1000));   
					 
			//y = _y+zz+distance;
			//x = _x+z+distance;
			
			if(t_flashing){
				let f = age_f % flashspeed;
				if(f != 0) if(sprite) ctx.drawImage(sprite, x, y, w, h);
			} else {
				if(sprite) ctx.drawImage(sprite, x, y, w, h);
			}
						
	}
	
	test.onClick = (ctx,e) => {
		e.preventDefault();
		e.stopPropagation();
		
		t_flashing = true;
		setTimeout(function(){
			t_flashing = false;
			//canvas.wake();
		},1000);
		
		canvas.toggleShade();
		//canvas.sleep();
	}
	
	test.getHitbox = () => {
		return {
			x,y,w,h
		}
	}
		
	return test;  
	
}