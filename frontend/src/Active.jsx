import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedActive extends Component {
  constructor() {
    super();
    this.state = {
      active: []
    };
  }

  componentDidMount = () => {
    let updater = () => {
      fetch("http://localhost:4000/active", {
        credentials: "include"
      })
        .then(response => {
          return response.text();
        })
        .then(responseBody => {
          console.log("List of actives", responseBody);
          let parsed = JSON.parse(responseBody);
          this.props.dispatch({
            type: "active",
            active: parsed
          });
        });
    };
    setInterval(updater, 1000);
  };

  render = () => {
    let msgToElement = elem => {
      return <li>{elem.username}</li>;
    };
    console.log("props=>", this.props);
    return (
      <div>
        <ul>{this.props.actives.map(msgToElement)}</ul>
      </div>
    );
  };
}

let mapStateToProps = st => {
  console.log("active users :", st.active);
  return {
    actives: st.actives
  };
};

let Active = connect(mapStateToProps)(UnconnectedActive);

export default Active;
