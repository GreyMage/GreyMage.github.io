import React from 'react';

export default class Background extends React.Component {
  constructor(props) {
    super(props);
    console.log("ok");
  }

  render() {
    return <div className="background-canvas">
      
      <div className="center-canvas">
        {this.props.children}
      </div>
    </div>;
  }
}
