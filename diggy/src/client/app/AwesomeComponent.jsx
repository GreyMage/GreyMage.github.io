import React from 'react';

class AwesomeComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {likesCount : 0};
		this.onLike = this.onLike.bind(this);
		this.getLikes = this.getLikes.bind(this);
	}

	onLike () {
	
		let newLikesCount = this.state.likesCount + 1;
		this.setState((prevState,props) => {
		
			const newState = { 
				likesCount: newLikesCount 
			}
		
			if(this.props.onChange){
				this.props.onChange(newState);
			}
			
			return newState;
			
		});

	}
  
	getLikes() {
		return this.state.likesCount;
	}

	render() {
		return (
			<div>
				Likes : <span>{this.state.likesCount}</span>
				<div><button onClick={this.onLike}>Like Me</button></div>
			</div>
		);
	}

}

export default AwesomeComponent;