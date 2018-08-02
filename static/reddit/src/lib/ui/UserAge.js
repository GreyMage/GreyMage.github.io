import Identicon from 'identicon.js';
import React from 'react';
import ReactDOM from 'react-dom';

export default class UserAge extends React.Component {

    constructor(props){
        super(props);
		
		
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
            age.robot = {unit:"Year",num: Math.floor(age.years)}
        } else if(age.months > 1) {
            age.human = `around ${Math.floor(age.months)} months.`;
            age.robot = {unit:"Month",num: Math.floor(age.months)}
        } else if(age.days > 1) {
            age.human = `only ${Math.floor(age.days)} days.`;
            age.robot = {unit:"Day",num: Math.floor(age.days)}
        } else {
            age.human = `TODAY! Only ${Math.floor(age.minutes)} Minutes!`;
            age.robot = {unit:"Minute",num: Math.floor(age.minutes)}
        }

		// AFTER ALL
        return age;

    }
    
    render(){
    
        const age = this.calculateAge(this.props.about.created);
        // console.log(age);
        
        const wrapStyle = {
            display:'inline-flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '20px',
        }
        const blockStyle = {
            height: "10px",
            width: "10px",
            margin: "1px",
            display: 'inline-block',
        }
        
        const blocks = [];
        Array.from(Array(Math.max(1,age.robot.num)),(_,i)=>{
            
            const map = {
                "Year": "#558b2f",
                "Month": "#ff8f00",
                "Day": "#c62828",
                "Minute": "#4e342e",
            }
            let color = map[age.robot.unit];
            
            blocks.push(<div key={i} style={Object.assign(blockStyle,{backgroundColor:color})} ></div>);
            
        });
        
        return <div title={age.human} style={wrapStyle}>
            {blocks} 
        </div>;
        
    }

}