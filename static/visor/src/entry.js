require("./style/main.less");

const canvas = require("./lib/canvas.js"); 
const testGen = require("./lib/ui/test.js"); 

var test = testGen();
canvas.addActor(test);
