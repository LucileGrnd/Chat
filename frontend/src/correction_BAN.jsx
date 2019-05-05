//BACKEND

let express = require("express"); // 1
let cors = require("cors"); // 3
let multer = require("multer"); // 1
let app = express(); // 1
let cookieParser = require("cookie-parser"); // 2

let upload = multer({
  dest: __dirname + "/uploads/"
});

app.use(cookieParser()); // 2
app.use(cors({ credentials: true, origin: "http://159.89.112.34" })); /* 3 */

let passwords = { admin: "pwd123" }; // 5
let sessions = {}; // 6
let messages = []; // 4
// associates a username with a time when they last sent a message
let activity = {};

app.get("/messages", function(req, res) {
  // 26
  let sessionId = req.cookies.sid; // 22
  let username = sessions[sessionId]; // 22
  if (username === undefined) {
    res.send("STOP YOU HACKER");
    return;
  }

  while (messages.length >= 20) messages.shift();

  res.send(JSON.stringify(messages)); // 26
}); // 26

app.post("/kick", (req, res) => {
  let sessionId = req.cookies.sid; // 22
  let username = sessions[sessionId]; // 22
  if (username !== "admin") {
    res.send("nice try bucko!");
    return;
  }
  let kickee = req.body.kickee;
  let allSessionIds = Object.keys(sessions);
  let candidates = allSessionIds.filter(id => {
    let user = sessions[id];
    return user === kickee;
  });
  let kickeeSessionId = candidates[0];
  delete sessions[kickeeSessionId];
  messages = messages.concat({
    username: "admin",
    msg: "I just kicked " + kickee + " was kicked out"
  });
  res.send("success");
});

app.get("/check-login", (req, res) => {
  let sessionId = req.cookies.sid; // 22
  let username = sessions[sessionId]; // 22
  if (username !== undefined) {
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/erase-existence", (req, res) => {
  let sessionId = req.cookies.sid; // 22
  let username = sessions[sessionId]; // 22
  messages = messages.filter(msg => {
    return msg.username !== username;
  });
  res.send("success");
});

app.get("/active-users", (req, res) => {
  let allUsers = Object.keys(activity);
  let now = new Date() / 1;
  let activeUsers = allUsers.filter(user => {
    let lastActivity = activity[user];
    return now - lastActivity < 1000 * 60 * 5;
  });
  res.send(JSON.stringify(activeUsers));
});

app.post("/newmessage", upload.single("image"), (req, res) => {
  // 21
  console.log("*** inside new message"); // 21
  console.log("body", req.body); // 21
  let sessionId = req.cookies.sid; // 22
  let username = sessions[sessionId]; // 22

  activity[username] = new Date() / 1;

  console.log("username", username); // 22
  let msg = req.body.msg; // 23
  let newMsg = { username: username, message: msg }; // 24

  if (req.file) {
    newMsg.imgPath = "http://159.89.112.34:4000/images/" + req.file.filename;
  }

  console.log("new message", newMsg); // 24
  messages = messages.concat(newMsg); // 24
  console.log("updated messages", messages); // 24
  res.send(JSON.stringify({ success: true })); // 25
}); // 21

app.post("/login", upload.none(), (req, res) => {
  // 12
  console.log("**** I'm in the login endpoint"); // 12
  console.log("this is the parsed body", req.body); // 12
  let username = req.body.username; // 13
  let enteredPassword = req.body.password; // 13
  let expectedPassword = passwords[username]; // 14
  console.log("expected password", expectedPassword); // 14
  if (enteredPassword === expectedPassword) {
    // 15
    console.log("password matches"); // 15
    let sessionId = generateId(); // 16
    console.log("generated id", sessionId); // 16
    sessions[sessionId] = username; // 16
    res.cookie("sid", sessionId); // 17
    res.send(JSON.stringify({ success: true })); // 18
    return; // 19
  } // 15
  res.send(JSON.stringify({ success: false })); // 20
}); // 12

let generateId = () => {
  // 7
  return "" + Math.floor(Math.random() * 100000000); // 7
}; // 7

app.get("/logout", (req, res) => {
  let sessionId = req.cookies.sid; // 22
  delete sessions[sessionId];
  res.send("success!");
});

app.post("/signup", upload.none(), (req, res) => {
  // 8
  console.log("**** I'm in the signup endpoint"); // 8
  console.log("this is the body", req.body); // 8
  let username = req.body.username; // 9
  let enteredPassword = req.body.password; // 9
  passwords[username] = enteredPassword; // 10
  console.log("passwords object", passwords); // 10

  let sessionId = generateId(); // 16
  console.log("generated id", sessionId); // 16
  sessions[sessionId] = username; // 16
  res.cookie("sid", sessionId); // 17

  res.send(JSON.stringify({ success: true })); // 11
}); // 8

// app.post("/image", upload.single('image'), (req, res) => {

//   res.send(makePage())
// })

app.listen(4000); // 1

// FRONTEND

import React, { Component } from "react"; // 1

class UnconnectedChatForm extends Component {
  // 1
  constructor(props) {
    // 1
    super(props); // 1
    this.state = { message: "", fileLocation: undefined }; // 1
  } // 1
  handleMessageChange = event => {
    // 1
    console.log("new message", event.target.value); // 1
    this.setState({ message: event.target.value }); // 1
  }; // 1
  handleSubmit = event => {
    // 2
    event.preventDefault(); // 2
    console.log("form submitted"); // 2
    let data = new FormData(); // 2
    data.append("msg", this.state.message); // 2

    if (this.state.fileLocation !== undefined)
      data.append("image", this.state.fileLocation); // 2

    fetch("http://159.89.112.34:4000/newmessage", {
      /* 2 */
      method: "POST", // 2
      body: data, // 2
      credentials: "include" // 2
    }); // 2
  }; // 2
  eraseExistence = () => {
    fetch("/erase-existence", { method: "POST", credentials: "include" });
  };
  handleFile = ev => {
    this.setState({ fileLocation: ev.target.files[0] });
  };
  kick = () => {
    let userToKick = window.prompt("who?");
    let data = new FormData();
    data.append("kickee", userToKick);
    fetch("/kick", { method: "POST", body: data, credentials: "include" });
  };

  render = () => {
    // 1
    let possibleKickButton = undefined;
    if (this.props.admin) {
      possibleKickButton = <button onClick={this.kick}>kick out!</button>;
    }
    return (
      // 1
      <div>
        {" "}
        {/* 1 */}
        <form onSubmit={this.handleSubmit}>
          {" "}
          {/* 1 */}
          <input onChange={this.handleMessageChange} type="text" /> {/* 1 */}
          <input type="file" onChange={this.handleFile} />
          <input type="submit" /> {/* 1 */}
        </form>{" "}
        {/* 1 */}
        <button onClick={this.eraseExistence}>erase!</button>
        {possibleKickButton}
      </div>
    ); // 1
  }; // 1
} // 1

let mapStateToProps = st => {
  return {
    admin: st.admin
  };
};

let ChatForm = connect(mapStateToProps)(UnconnectedChatForm);

/// OTHER

import React, { Component } from "react"; // 1
import { connect } from "react-redux"; // 1
class UnconnectedLogin extends Component {
  // 1
  constructor(props) {
    // 1
    super(props); // 1
    this.state = {
      // 1
      username: "", // 1
      password: "" // 1
    }; // 1
  } // 1
  handleUsernameChange = event => {
    // 1
    console.log("new username", event.target.value); // 1
    this.setState({ username: event.target.value }); // 1
  }; // 1
  handlePasswordChange = event => {
    // 1
    console.log("new password", event.target.value); // 1
    this.setState({ password: event.target.value }); // 1
  }; // 1
  handleSubmit = evt => {
    // 2
    evt.preventDefault(); // 2
    console.log("login form submitted"); // 2
    let data = new FormData(); // 3
    data.append("username", this.state.username); // 3
    data.append("password", this.state.password); // 3
    fetch("http://localhost:4000/login", {
      /* 3 */
      method: "POST", // 3
      body: data, // 3
      credentials: "include" // 3
    }) // 3
      .then(x => {
        return x.text();
      }) // 4
      .then(responseBody => {
        // 5
        console.log("responseBody from login", responseBody); // 5
        let body = JSON.parse(responseBody); // 5
        console.log("parsed body", body); // 5
        if (!body.success) {
          // 6
          alert("login failed"); // 6
          return; // 6
        } // 6
        this.props.dispatch({
          // 7
          type: "login-success" // 7
        }); // 7
        if (this.state.username === "admin") {
          this.props.dispatch({
            type: "admin-mode"
          });
        }
      }); // 5
  }; // 2
  render = () => {
    // 1
    return (
      // 1
      <form onSubmit={this.handleSubmit}>
        {" "}
        {/* 1 */}
        Username {/* 1 */}
        <input type="text" onChange={this.handleUsernameChange} /> {/* 1 */}
        Password {/* 1 */}
        <input type="text" onChange={this.handlePasswordChange} /> {/* 1 */}
        <input type="submit" /> {/* 1 */}
      </form> // 1
    ); // 1
  }; // 1
} // 1

//OTHER

import { createStore } from "redux"; // 1
let reducer = (state, action) => {
  // 2
  if (action.type === "login-success") {
    // 3
    return { ...state, loggedIn: true }; // 3
  } // 3
  if (action.type === "set-messages") {
    // 4
    return { ...state, msgs: action.messages }; // 4
  } // 4
  if (action.type === "set-active-users") {
    // 4
    return { ...state, activeUsers: action.users }; // 4
  } // 4
  if (action.type === "logout") {
    // 4
    return { ...state, loggedIn: false }; // 4
  } // 4
  if (action.type === "admin-mode") {
    // 4
    return { ...state, admin: true }; // 4
  } // 4
  return state; // 5
}; // 2

const store = createStore(
  // 6
  reducer, // 6
  { msgs: [], loggedIn: false }, // 6
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // 7
); // 6

export default store; // 6
