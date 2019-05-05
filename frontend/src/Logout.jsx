import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedLogout extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick = () => {
    this.props.dispatch({
      type: "logout"
    });
  };

  render = () => {
    return (
      <div>
        <input type="button" onClick={this.handleOnClick} value="Logout" />
      </div>
    );
  };
}

let Logout = connect()(UnconnectedLogout);

export default Logout;
