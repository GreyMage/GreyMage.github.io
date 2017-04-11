require("./../css/style.less");

const engine = require("./lib/core/engine.js");
const Actor = require("./lib/actors/actor.js");
//const player = require("./lib/actors/oldplayer.js");
const Player = require("./lib/actors/player.js");
const Pickaxe = require("./lib/actors/pickaxe.js");

let joe = new Actor(); 
let fred = new Player(); 

engine.add(joe);
engine.add(fred);
engine.add(new Pickaxe()); 
engine.kickoffRenderLoop();


//document.write(require("./content.js"));