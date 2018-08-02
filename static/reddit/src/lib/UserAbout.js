
import Queue from "./Queue";
import GetJson from "./GetJson";
import Nedb from 'nedb';
// debugging
if(process.env.NODE_ENV !== "production"){
	window.Nedb = Nedb;
}

export default class UserAbout {

    constructor(author) {
        this.author = author;
        this.queue = new Queue();
		this.db = {};
        this.db.about = new Nedb({
            filename: 'about',
            autoload: true
        });
			
    }
	
	get about(){
		
		return new Promise((resolve,reject)=>{
			
			this.db.about.findOne({name:this.author}, (err, about)=>{
			
				if(about) {
					resolve(about);
					return;
				} else {
					
					this.queue.add(done => {
						const path = "/user/"+this.author+"/about.json";
						// console.log("trying to get json",path);
						const fetch = GetJson(path);
						
						fetch.then(({data}) => {
							this.db.about.update({name:data.name},data,{upsert:true},(err,numReplaced)=>{
								resolve(data);
								done();
							})
							// console.log(data);
						})
						
						fetch.catch((e)=>{
							// Try again. (this will re-queue)
							done();
							console.log("Failed to fetch",path,"Trying again to get about");
							resolve(this.about);
						});
						
					})
				}
				
			});
			
		});
		
	}
     
}