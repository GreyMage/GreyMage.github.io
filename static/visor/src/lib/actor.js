module.exports = class Actor {
	
	constructor() {
		this._events = this._events || {};
		this.ageTime = 0;
		this.ageTicks = 0;
	}
	
	// Used like:
	// let blob = requireBlob(require("../../sprite/heart-wings.png")); 
	requireBlob(dataURI) {
		
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		let byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		// write the bytes of the string to an ArrayBuffer
		let ab = new ArrayBuffer(byteString.length);
		let ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
		  ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		let blob = new Blob([ab], {type: mimeString});
		return blob;

	}
	
	on(evt,callback,context,once=false) {

		// ensure
		this._events[evt] = this._events[evt] || [];
	
		// protect
		let skip = false;
		this._events[evt].forEach(i=>{
			if(skip) return;
			if(i.cb === callback) {
				skip = true;
			}
		});
		if(skip) return;
		
		// apply
		//if(this._events[evt].indexOf(callback) !== -1){ return; }
		this._events[evt].push({
			cb: callback,
			once: once,
			context: context || callback
		});
		
	}
	
	once(evt,callback,context){
		return this.on(evt,callback,context,true);
	}
	
	emit(evt, ...args){
		
		// ensure
		this._events[evt] = this._events[evt] || [];
		
		// find
		for(let i=this._events[evt].length - 1;i>=0;i--){
			let el = this._events[evt][i];
			if(el.cb)el.cb.apply(el.context,args);
			if(el.once){
				this._events[evt].splice(i,1);
			}
		}

	}
	
	spawn(ctx,canvas){
		this.canvas = canvas;
		this.ctx = ctx;
	}
	
	tick(delta,time){
		this.ageTime = this.ageTime + (delta * 1000) || 0;
		this.ageTicks++;
	}
	
	destroy(){
		console.log("blarg!");
	}
	
	get hitbox(){
		return {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h
		}
	}
	
}