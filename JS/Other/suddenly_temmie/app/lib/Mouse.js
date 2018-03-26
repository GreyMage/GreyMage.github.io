// SUDDENLY TEMMIE

class Mouse {
	constructor() {
		
		this.lastClick = null;
		
		// Resize handler.
		window.addEventListener('click', this.setClick.bind(this), true);
		
	}
	popClick(){
		let x = this.lastClick;
		this.lastClick = false;
		return x;
	}
	setClick(e){
		this.lastClick = e;
	}
}

module.exports = Mouse;