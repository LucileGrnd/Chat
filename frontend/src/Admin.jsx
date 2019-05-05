import React, { Component } from "react";
import { connect } from "react-redux";

class unconnectedAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }

  //fonction pour les messages
  handleName = event => {
    this.setState({ name: event.target.value });
  };

  //fonction pour submit la form
  handleSubmit = event => {
    event.preventDefault();
    console.log("form submitted");
    let data = new FormData();
    data.append("msg", this.state.name);
    fetch("http://159.89.112.34:4000/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    this.setState({ name: "" });
  };

  render = () => {
    console.log("IMAGE=>", this.state.file);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>Ban:</p>
          <input
            onChange={this.handleName}
            type="text"
            placeholder="name here"
            value={this.state.name}
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

let Admin = connect()(unconnectedAdmin);

export default Admin;
