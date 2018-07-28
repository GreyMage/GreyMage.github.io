import Identicon from 'identicon.js';
import React from 'react';
import ReactDOM from 'react-dom';
import crypto from 'crypto';

export default class UserIdenticon extends React.Component {

    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
		
		this.state = {
			iconSize : 20
		}
		
    }
    
    onClick(){
		if(this.props.onClick) this.props.onClick();
    }
    
    render(){
    
        let hash = crypto.createHash('sha1').update(this.props.name).digest('hex');
        var svg = new Identicon(hash, {
            margin: 0,
            size: this.state.iconSize,
            format: 'svg'
        }).toString();
         const he = `dwa`; 
        const src = `data:image/svg+xml;base64,`+svg;
        
        return <img className={`identicon`} onClick={this.onClick} src={src} />
        
    }

}
 
/*

let hash = crypto.createHash('sha1').update(this.props.author).digest('hex');
        var svg = new Identicon(hash, {
            margin: 0,
            size: this.state.iconSize,
            format: 'svg'
        }).toString();
        
        const src = "data:image/svg+xml;base64,"+svg;
        
        return <img onClick={()=>{if(this.state.subs)console.log(this.state.subs);}} style={{position: "absolute"}} src={src} />

*/