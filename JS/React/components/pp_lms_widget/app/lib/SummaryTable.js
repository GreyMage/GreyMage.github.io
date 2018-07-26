import React from 'react';
import SummaryRow from './SummaryRow';

class SummaryTable extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			licenseType:null,
			assignee:null,
			startDate:null,
			endDate:null
		};

		// Attach license 
		this.state.licenseType = this.props.license.fields.License_Type__c;

		// We're going to figure out our own assignee up here for simplicity later on.
		for(let i=0;i<this.props.team.length;i++){
			let member = this.props.team[i];
			if(this.props.license.fields.JWUID__c === member.jwuid){
				this.state.assignee = member;
			}
		}

		// transform date strings into date objects.
		this.state.startDate = this.transformDateStrToObject(this.props.license.fields.Start_Date__c);
		this.state.endDate = this.transformDateStrToObject(this.props.license.fields.End_Date__c);

	}
	transformDateStrToObject(datestr){
		// turn dates like 2001-1-1 into date()'s
		if(!datestr) return new Date(0); // haha, 1970 

		let matched = datestr.match(/^(\d+)-(\d+)-(\d+)/);
		if(!matched) return new Date(0); // haha, 1970 
		let m = parseInt(matched[2],10);
		let d = parseInt(matched[3],10);
		let Y = parseInt(matched[1],10);
		
		const newDate = new Date();
		newDate.setUTCMonth(m-1);
		newDate.setUTCDate(d);
		newDate.setUTCFullYear(Y);

		return newDate;
	}
	formatDate(date){
		//turn date()'s into m/d/Y
		let m = date.getUTCMonth() + 1; // always +1 months, months are 0 indexed.
		let d = date.getUTCDate();
		let Y = date.getUTCFullYear();
		return `${m}/${d}/${Y}`;
	}
	getHeader() {
		return <tr><th colSpan="2">{this.props.license.fields.Name}</th></tr>;
	}
	getStartDate(){
		return this.formatDate(this.state.startDate);
	}
	getEndDate(){
		return this.formatDate(this.state.endDate);
	}
	getLicenseType(){
		if(!this.state.licenseType) return " - No Type - ";
		return this.state.licenseType;
	}
	getAssigneeName(){
		if(!this.state.assignee) return " - Unassigned - ";
		let t = this.state.assignee;
		return t.firstName + " " + t.lastName;
	}
	getLicenceRows() {
		
		// Logic of what rows to display.
		const rows = [];

		// Type
		let typeRow = <SummaryRow key="type" label="Type" value={this.getLicenseType()} />;
		rows.push(typeRow);

		// Assignee
		let assigneeRow = <SummaryRow key="assignee" label="Assignee" value={this.getAssigneeName()} />;
		rows.push(assigneeRow);

		// Start Date
		let startdateRow = <SummaryRow key="startdate" label="Start Date" value={this.getStartDate()} />;
		rows.push(startdateRow);

		// Start Date
		let stopdateRow = <SummaryRow key="enddate" label="End Date" value={this.getEndDate()} />;
		rows.push(stopdateRow);

		return rows;

	}
	render () {
		let raw = JSON.stringify(this.props.license);
		return <table>
			<thead>
				{this.getHeader()}
			</thead>
			<tbody>
				{this.getLicenceRows()}
			</tbody>
		</table>;
	}
}

module.exports = SummaryTable;