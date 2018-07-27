// THIS IS THE CLIENT APPLICATION

import React from 'react';
import ReactDOM from 'react-dom';
import Queue from "./lib/Queue";
import GetJson from "./lib/GetJson";
import Nedb from 'nedb';
import Identicon from 'identicon.js';
import crypto from 'crypto';

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.queue = new Queue();
        this.state = { iconSize: 20 }
        
        this.loadAbout = this.loadAbout.bind(this);
        this.loadSubs = this.loadSubs.bind(this);
        this.fetchSubs = this.fetchSubs.bind(this);
    }
    
    componentDidMount(){
    
        // Lets load in our data!
        this.db = {};
        this.db.about = new Nedb({
            filename: 'about',
            autoload: true
        });
        this.db.subs = new Nedb({
            filename: 'subs',
            autoload: true
        });
        
        this.loadAbout();
        this.loadSubs();
        
    }
    
    loadAbout(){
        
        this.db.about.findOne({name:this.props.author}, (err, about)=>{
        
            if(about) {
                this.setState({about});
                return;
            }
            
            this.queue.add(done => {
                const path = "/user/"+this.props.author+"/about.json";
                // console.log("trying to get json",path);
                const fetch = GetJson(path);
                
                fetch.then(({data}) => {
                    this.db.about.update({name:data.name},data,{upsert:true},(err,numReplaced)=>{
                        this.setState({about:data});
                        done();
                    })
                    // console.log(data);
                })
                
                fetch.catch((e)=>{
                    // Try again. (this will re-queue)
                    done();
                    console.log("Failed to fetch",path,"Trying again to get about");
                    this.loadAbout();
                });
                
            })
            
        });
    
    }
    
    fetchSubs(more=0){
    
        // First of all, since we're trying to not get API banned, lets cache this data for... i dunno, a day? right now we're only checking the last 50 posts, may extend later.
        const cacheTime = 1000 * 60 * 60 * 24;

        // Didnt find him, load real data
        const subs = {};

        const getPage = (after=false)=>{

            let url = "/user/"+this.props.author+"/comments.json";
            if(after) url += "?after="+after;

            this.queue.add(done => {
                const fetch = GetJson(url)
                
                fetch.then(json => {
                    const posts = json.data.children;
                    if(posts.length > 0){
                        posts.forEach(post => {
                            subs[post.data.subreddit] = subs[post.data.subreddit] || 0;
                            subs[post.data.subreddit]++;
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
                    getPage(after);
                });
            })
            
        }

        const finish = (cb) =>{

            const data = {
                name:this.props.author,
                expires: (new Date().getTime()) + cacheTime,
                subs:subs
            }

            this.db.subs.update({name:data.name},data,{upsert:true},(err,numReplaced)=>{
                this.setState({subs:data.subs});
                if(cb)cb();
            })
            
        }

        getPage();
    }
    
    loadSubs(){
    
        this.db.subs.findOne({name:this.props.author}, (err, data)=>{
        
            if(data) {
                this.setState({subs:data.subs});
                return;
            }
            
            this.fetchSubs();
        
        });
    
        
    }
    
    // Get detailed age info
    calculateAge(birthday){

        const birthDate = new Date(parseInt(birthday,10) * 1000);
        const age = {ms:(new Date().getTime()) - birthDate.getTime()}
        age.seconds = age.ms / 1000;
        age.minutes = age.seconds / 60;
        age.hours = age.minutes / 60;
        age.days = age.hours / 24;
        age.weeks = age.days / 7;
        age.months = age.days / 30;
        age.years = age.days / 365;

        // Work out human description
        if(age.years > 1){
            age.human = `around ${Math.floor(age.years)} years.`;
        } else if(age.months > 1) {
            age.human = `around ${Math.floor(age.months)} months.`;
        } else if(age.days > 1) {
            age.human = `only ${Math.floor(age.days)} days.`;
        } else {
            age.human = `TODAY! Only ${Math.floor(age.minutes)} Minutes!`;
        }

        return age;

    }
    
    getAccountAge(){
        if(!this.state.about) return <span>Loading</span>;
        const style = {
            lineHeight:this.state.iconSize+"px",
            paddingLeft:(this.state.iconSize+10)+"px"
        };
        return <span style={style}>Account Age: {this.calculateAge(this.state.about.created).human}</span>
    }
    
    getAccountHate(){
        if(!this.state.subs) return <span></span>;
        
        let hate = [
            'The_Donald',
            'CringeAnarchy',
            'GamersRiseUp',
        ];
        let user_hates = [];
        hate.forEach(ha => {
            if(this.state.subs.hasOwnProperty(ha)){
                user_hates.push(ha);
            }
        })
        
        if(user_hates.length==0) return <span></span>;
        
        return <span style={{color:'red'}}>User has recently posted on: {user_hates.join(", ")}</span>
    }
    
    getIdenticon(){
        if(!this.state.about) return <span></span>;
        
        let hash = crypto.createHash('sha1').update(this.props.author).digest('hex');
        var svg = new Identicon(hash, {
            margin: 0,
            size: this.state.iconSize,
            format: 'svg'
        }).toString();
        
        const src = "data:image/svg+xml;base64,"+svg;
        
        return <img style={{position: "absolute"}} src={src} />
    }
    
    
    getLoadingContent(){
        return <div>
            Loading...
        </div>
    }
    
    getContent(){
        return <div>
            <div style={{position:'relative',display: "inline-block"}}>{this.getIdenticon()} {this.getAccountAge()}</div>
            <div>{this.getAccountHate()}</div>
        </div>
    }
    
    render(){
        return this.getContent();
    }

}

// Every 2 seconds check the existing comments on the page, and hook them if they arent already.
// This is safe because the moment an element gets hooked it wont be eligible anymore,
// and being attached to only adds the comment to the processing queue.
if(window.gm_sanity_heartbeat) clearInterval(gm_sanity_heartbeat);
window.gm_sanity_heartbeat = setInterval(()=>{
    let comments = document.querySelectorAll("[data-type=comment],[data-type=link]");
    comments = Array.prototype.slice.call(comments);
    comments.forEach(comment => {
        if(comment.gm_sanity) {
            if(!window.gm_sanity_forceRepaint) return;
            if(comment.gm_sanity.parentElement) comment.gm_sanity.parentElement.removeChild(comment.gm_sanity);
        }
        // Create an element just below the user bar
        comment.gm_sanity = document.createElement("div");
        const tagline = comment.getElementsByClassName('tagline')[0];
        if(tagline){
            tagline.parentNode.insertBefore(comment.gm_sanity,tagline.nextSibling);
            let author = comment.getAttribute("data-author");
            ReactDOM.render(<Main author={author}/>, comment.gm_sanity);
        }
        
    });
    window.gm_sanity_forceRepaint = false;
},2000);

window.gm_sanity_forceRepaint = true;