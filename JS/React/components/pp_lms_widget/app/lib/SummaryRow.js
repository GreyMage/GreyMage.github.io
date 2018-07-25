import React from 'react';

class SummaryRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		return <tr>
			<td>{this.props.label}</td><td>{this.props.value}</td>
		</tr>;
	}
}

module.exports = SummaryRow;