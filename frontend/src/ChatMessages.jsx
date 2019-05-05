import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    let updater = () => {
      fetch("http://localhost:4000/messages", {
        credentials: "include"
      })
        .then(response => {
          return response.text();
        })
        .then(responseBody => {
          console.log("response from messages", responseBody);
          let parsed = JSON.parse(responseBody);
          console.log("parsed", parsed);
          this.props.dispatch({
            type: "set-messages",
            messages: parsed
          });
        });
    };
    setInterval(updater, 500);
  };

  render = () => {
    let msgToElement = elem => {
      if (elem.img === undefined) {
        return (
          <li>
            {elem.username +
              ": " +
              elem.message +
              " at " +
              moment(elem.time).format("LT")}
          </li>
        );
      }
      return (
        <li>
          {elem.username} :
          <img src={elem.img} height="80" />
          {elem.message + " at " + moment(elem.time).format("LT")}
        </li>
      );
    };
    console.log("messages:", this.props.messages);
    return (
      <div>
        <ul>{this.props.messages.map(msgToElement)}</ul>
      </div>
    );
  };
}

let mapStateToProps = st => {
  return {
    messages: st.msgs
  };
};

let ChatMessages = connect(mapStateToProps)(UnconnectedChatMessages);

export default ChatMessages;
