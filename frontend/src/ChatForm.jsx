import React, { Component } from "react";
import Delete from "./Delete.jsx";

class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "", file: undefined };
  }

  //fonction pour les messages
  handleMessageChange = event => {
    console.log("new message", event.target.value);
    this.setState({ message: event.target.value });
  };

  // fonction pour les images
  handleFile = event => {
    console.log("User put an image", event.target.files);
    this.setState({ file: event.target.files[0] });
  };

  //fonction pour submit la form
  handleSubmit = event => {
    event.preventDefault();
    console.log("form submitted");
    let data = new FormData();
    data.append("msg", this.state.message);
    data.append("file", this.state.file);
    fetch("http://159.89.112.34:4000/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    this.setState({ message: "", file: "" });
  };

  render = () => {
    console.log("IMAGE=>", this.state.file);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleMessageChange}
            type="text"
            placeholder="message here"
            value={this.state.message}
          />
          <p>Add an image</p>
          <input type="file" onChange={this.handleFile} />
          <input type="submit" />
        </form>
        <Delete />
      </div>
    );
  };
}

export default ChatForm;
