require("./style/main.less");

const canvas = require("./lib/canvas.js"); 
// const testGen = require("./lib/ui/test.js"); 

// var test = testGen();

// let newDude = function(){
	// return new Promise(resolve =>{
		// var test = testGen();
		// canvas.addActor(test);
		// setTimeout(resolve,1000);
	// })
// }

// let next = newDude();
// for(let i=0;i<2;i++){
	// next = next.then(()=>{
		// return newDude();
	// });
// }

const Button = require("./lib/ui/button.js"); 
let btn = new Button();
canvas.addActor(btn);


console.log(btn);