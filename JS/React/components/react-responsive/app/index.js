import React from 'react';
import {render} from 'react-dom';



class App extends React.Component {
	constructor(props){
		super(props);
		console.log(this.props.wrapper);
		
		this.checkWrapper = this.checkWrapper.bind(this);
		this.state = {};
		
		// hookup external event to watch for changes.
		window.addEventListener("resize",e=>{
			this.checkWrapper();
		});
		
	}
	checkWrapper(){
		// Runs on window resize, to check self for resize.		
		let w = this.props.wrapper;
		if(w.clientWidth !== this.state.wrapWidth || w.clientHeight !== this.state.wrapHeight){
			this.setState(()=>{
				return {
					wrapWidth: w.clientWidth,
					wrapHeight: w.clientHeight,
				};
			});
		}
	}
	render () {
		if(this.state.wrapWidth > 200){
				return <p> Hello React! This container is {this.state.wrapWidth}px wide!</p>;
		}
		return <p> BLAH BLAH </p>;
		
	}
}

const main = document.getElementById('app');
render(<App wrapper={main}/>, main);