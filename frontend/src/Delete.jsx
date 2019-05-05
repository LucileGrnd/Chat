import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedDelete extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick = () => {
    fetch("http://localhost:4000/delete", {
      credentials: "include"
    });
  };

  render = () => {
    return (
      <div>
        <button onClick={this.handleOnClick}>Delete Message</button>
      </div>
    );
  };
}

let Delete = connect()(UnconnectedDelete);

export default Delete;
