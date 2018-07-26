import React from 'react';
import {render} from 'react-dom';

import SummaryTable from './lib/SummaryTable';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {date: new Date()};
	}
	getTables() {
		if(!this.props.licenses){
			return <div>No Licenses!</div>;
		}
		let tables = [];
		for(let i=0;i<this.props.licenses.length;i++){
			tables.push(<SummaryTable key={i} license={this.props.licenses[i]} team={this.props.team}></SummaryTable>);
		}
		return <div>{tables}</div>;
	}
	render () {
		return <div>			
			{this.props.title}
			{this.getTables()}
		</div>;
		// return <p> Hello React! {this.props.title} </p>;
	}
}

// Global Configs
const c_title = <h3><span className="mbe">myBLU<i>edge</i></span> Learning Licenses</h3>;

// Attach to any valid dom elements.
const targetClass = 'lms_licence_zone';
let targets = document.getElementsByClassName(targetClass);
for(let i=0;i<targets.length;i++){

	let licenses = false;
	let team = false;

	try {
		licenses = JSON.parse(atob(targets[i].getAttribute("licences")));
		team = JSON.parse(atob(targets[i].getAttribute("team")));
	} catch (e) {}
	
	render(<App title={c_title} team={team} licenses={licenses}/>, targets[i]);

}
