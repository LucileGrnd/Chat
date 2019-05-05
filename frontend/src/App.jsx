import ChatForm from "./ChatForm.jsx";
import ChatMessages from "./ChatMessages.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import { connect } from "react-redux";
import Logout from "./Logout.jsx";
import React, { Component } from "react";
import Active from "./Active.jsx";
import Admin from "./Admin.jsx";

class UnconnectedApp extends Component {
  componentDidMount = () => {
    fetch("http://159.89.112.34:4000/already", {
      credentials: "include"
    })
      .then(response => {
        return response.text();
      })
      .then(responseBody => {
        let parsed = JSON.parse(responseBody);
        if (parsed.success) {
          this.props.dispatch({
            type: "login-success"
          });
          return;
        }
        alert("Please Signup or Login");
        return;
      });
  };

  render = () => {
    if (this.props.login && this.props.admin) {
      return (
        <div>
          <Active />
          <ChatMessages />
          <ChatForm />
          <Admin />
          <Logout />
        </div>
      );
    }
    if (this.props.login) {
      return (
        <div>
          <Active />
          <ChatMessages />
          <ChatForm />
          <Logout />
        </div>
      );
    }
    return (
      <div>
        <Signup />
        <Login />
      </div>
    );
  };
}

let mapStateToProps = st => {
  return { login: st.loggedIn, signup: st.Signup, admin: st.admin };
};

let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
