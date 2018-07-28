
import Queue from "./Queue";
import GetJson from "./GetJson";
import Nedb from 'nedb';
// debugging
if(process.env.NODE_ENV !== "production"){
	window.Nedb = Nedb;
}

export default class UserPostHistory {

    constructor(author) {
        this.author = author;
        this.queue = new Queue();
		this.db = {};
        this.db.subs = new Nedb({
            filename: 'subs',
            autoload: true
        });
		
        this.fetchSubs = this.fetchSubs.bind(this);
		
    }
	
	fetchSubs(more=0){
		return new Promise((resolve,reject)=>{
			
			// First of all, since we're trying to not get API banned, lets cache this data for... i dunno, a day? right now we're only checking the last 50 posts, may extend later.
			const cacheTime = 1000 * 60 * 60 * 24;
			
			let subs = {};
			
			const getPage = (after=false)=>{

				let url = "/user/"+this.author+"/comments.json";
				if(after) url += "?after="+after;

				this.queue.add(done => {
					const fetch = GetJson(url)
					
					fetch.then(json => {
						const posts = json.data.children;
						if(posts.length > 0){
							posts.forEach(post => {
								try {
									subs[post.data.subreddit] = subs[post.data.subreddit] || {};
								}catch(e){
									subs[post.data.subreddit] = {};
								}
								
								subs[post.data.subreddit][post.data.id] = {
									name:post.data.name,
									permalink:post.data.permalink,
									body:post.data.body
								};
							})
						}
						if(more > 0 && json.data.after) {
							more--;
							getPage(json.data.after);
						}
						else finish(done);
					})
					
					fetch.catch((e)=>{
						// Try again. (this will re-queue)
						done();
						console.log("Failed to fetch",url,"Trying again, no json",after);
						getPage();
					});
				})
				
			}

			const finish = (cb) =>{

				const data = {
					name:this.author,
					expires: (new Date().getTime()) + cacheTime,
					subs:subs
				}

				this.db.subs.update({name:data.name},data,{upsert:true},(err,numReplaced)=>{
					resolve({subs:data.subs});
					if(cb)cb();
				})
				
			}

			// Load any existing subs
			this.db.subs.findOne({name:this.author}, (err, data)=>{
				if(!err && data && data.subs) subs = data.subs;
				getPage();
			});
		})
    }
	
	get subs(){
		
		return new Promise((resolve,reject)=>{
			
			this.db.subs.findOne({name:this.author}, (err, data)=>{
			
				// This needs to also check expiration
				// console.log(data);
				if(data) {
					resolve({subs:data.subs});
					return;
				}
				
				// console.log("gonna fix that");
				resolve(this.fetchSubs());
			
			});
			
		});
		
	}
     
}