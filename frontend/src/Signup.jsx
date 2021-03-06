import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleUsernameChange = event => {
    console.log("new username", event.target.value);
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    console.log("new password", event.target.value);
    this.setState({ password: event.target.value });
  };

  handleSubmit = evt => {
    evt.preventDefault();
    console.log("signup form submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    fetch("http://159.89.112.34:4000/signup", {
      method: "POST",
      body: data,
      credentials: "include"
    })
      .then(x => {
        return x.text();
      })
      .then(responseBody => {
        let body = JSON.parse(responseBody);
        if (!body.success) {
          alert("Signup failed");
          return;
        }
        alert("Signup succeeded");
        return fetch("http://159.89.112.34:4000/login", {
          method: "POST",
          body: data,
          credentials: "include"
        })
          .then(x => {
            return x.text();
          })
          .then(responseBody => {
            let body = JSON.parse(responseBody);
            if (!body.success) {
              alert("login failed");
              return;
            }
            this.props.dispatch({
              type: "login-success"
            });
          });
      });
  };

  render = () => {
    return (
      <div>
        <h2>Signup</h2>
        <form onSubmit={this.handleSubmit}>
          Username
          <input type="text" onChange={this.handleUsernameChange} />
          Password
          <input type="text" onChange={this.handlePasswordChange} />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

let Signup = connect()(UnconnectedSignup);

export default Signup;
