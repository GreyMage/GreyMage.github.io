import AwesomeComponent from './AwesomeComponent.jsx';

import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {outsideLikes : 0};
		this.getLikes = this.getLikes.bind(this);
		
		this.ac = <AwesomeComponent onChange={this.getLikes} />;
		
	}

	getLikes(data) {
		this.setState({
			outsideLikes:data.likesCount
		});
	}
	
	render () {
		return (
			<div>
				<p> Hello React! {this.state.outsideLikes}</p>
				<div>{this.ac}</div>
			</div>
		);
	}
}

render(<App/>, document.getElementById('root'));