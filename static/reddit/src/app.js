'use strict';
// THIS IS THE CLIENT APPLICATION

import React from 'react';
import ReactDOM from 'react-dom';

import UserIdenticon from "./lib/ui/UserIdenticon";
import UserAge from "./lib/ui/UserAge";
import UserPostPreview from "./lib/ui/UserPostPreview";

import UserPostHistory from "./lib/UserPostHistory";
import UserAbout from "./lib/UserAbout";

import "./app.less";

class Main extends React.Component {

    constructor(props) {
		
		// console.log(Styles);
		
        super(props);
		this.state = {};
		
		this.postHistory = new UserPostHistory(this.props.author);
		this.about = new UserAbout(this.props.author).about;
        
        this.loadAbout = this.loadAbout.bind(this);
        this.togglePane = this.togglePane.bind(this);
    }
    
    componentDidMount(){

        this.loadAbout();
        this.loadSubs();
		
    }
    
    loadAbout(){
		this.about.then(about => {
			this.setState({about});
		})
    }
   
    
    loadSubs(){
		this.postHistory.subs.then(subs => {
			this.setState({subs});
		})
    }
    
    getAgeHUD(){
		if(!this.state.about)return <span></span>;
		return <UserAge about={this.state.about} />;
    }
    
    getAccountHate(){
        if(!this.state.subs)
			return <span></span>;
        
        let hate = [
            'The_Donald',
            'CringeAnarchy',
            'GamersRiseUp',
            'greatawakening',
        ];
        let user_hates = [];
        hate.forEach(ha => {
            if(this.state.subs.hasOwnProperty(ha)){
                user_hates.push(ha);
            }
        })
		
        
        if(user_hates.length==0) return <span></span>;
        
        return <span style={{color:'red'}}>User has posted on: {user_hates.join(", ")}</span>
    }
	
	togglePane(){
		this.setState(oldState => {
			return {showPostHistory:!oldState.showPostHistory};
		});
	}
    
    getIdenticon(){
        if(!this.state.about) return <span></span>;
        return <UserIdenticon name={this.props.author} onClick={this.togglePane} />;
    }
    
	getSanityBar(){
		// Ripe for classin'
		return <div className={`sanity-bar`}>
			{this.getIdenticon()} 
			{this.getAgeHUD()}
		</div>
	}
    
	getPostHistoryWidget(){
		if(!this.state.subs || !this.state.showPostHistory)
			return <span></span>;
		console.log(this.state.subs);
		return <UserPostPreview history={this.state.subs}/>
	}
    
    render(){
        return <div className={`sanity`}>
            <div>{this.getSanityBar()}</div>
            <div>{this.getAccountHate()}</div>
            <div>{this.getPostHistoryWidget()}</div>
        </div>
    }

}

// Every 2 seconds check the existing comments on the page, and hook them if they arent already.
// This is safe because the moment an element gets hooked it wont be eligible anymore,
// and being attached to only adds the comment to the processing queue.
if(window.gm_sanity_heartbeat) clearInterval(gm_sanity_heartbeat);
window.gm_sanity_heartbeat = setInterval(()=>{
    let comments = document.querySelectorAll("[data-type=comment],[data-type=link]");
    comments = Array.prototype.slice.call(comments);
    comments.forEach((comment,i) => {
        if(comment.gm_sanity) {
            if(!window.gm_sanity_forceRepaint) return;
            if(comment.gm_sanity.parentElement) comment.gm_sanity.parentElement.removeChild(comment.gm_sanity);
        }
        
        comment.gm_sanity = true;
        
        // Defer actual attachment for each element by a quarter second to lessen load on weaker systems. 
        setTimeout(()=>{
            // Create an element just below the user bar
            comment.gm_sanity = document.createElement("div");
            const tagline = comment.getElementsByClassName('tagline')[0];
            if(tagline){
                tagline.parentNode.insertBefore(comment.gm_sanity,tagline.nextSibling);
                let author = comment.getAttribute("data-author");
                ReactDOM.render(<Main author={author}/>, comment.gm_sanity);
            }
            
        },250*i);

	});
    window.gm_sanity_forceRepaint = false;
},2000);

window.gm_sanity_forceRepaint = true;