let express = require("express");
let app = express();
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads" });
let cors = require("cors");
let cookieParser = require("cookie-parser");
let passwords = { Marie: "123" };
let messages = [];
let sessions = {};
let actives = [];

let generateId = () => {
  return "" + Math.floor(Math.random() * 10000000);
};

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use("/images", express.static("uploads"));

app.get("/messages", (req, res) => {
  let Id = req.cookies.sid;
  if (sessions[Id] !== undefined) {
    res.send(JSON.stringify(messages));
    return;
  }
  res.send(JSON.stringify({ success: false }));
  return;
});

app.get("/active", (req, res) => {
  actives = actives.filter(elem => {
    let timestamp = elem.time;
    let now = new Date() / 1;
    return timestamp > now - 5000;
  });
  res.send(JSON.stringify(actives));
  return;
});

app.get("/already", (req, res) => {
  console.log("is the user already loginin?");
  let sessionId = req.cookies.sid;
  if (sessions[sessionId] === undefined) {
    res.send(JSON.stringify({ success: false }));
    return;
  }
  res.send(JSON.stringify({ success: true }));
  return;
});

app.get("/delete", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  messages = messages.filter(elem => {
    return elem.username !== username;
  });
  res.send("success");
});

app.post("/signup", upload.none(), (req, res) => {
  console.log("Signup endpoint: ", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  if (passwords[username] === undefined) {
    passwords[username] = enteredPassword;
    console.log("passwords: ", passwords);
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/login", upload.none(), (req, res) => {
  console.log("Login endpoint", req.body);

  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = passwords[username];

  if (expectedPassword === enteredPassword) {
    let sessionId = generateId();

    sessions[sessionId] = username;
    res.cookie("sid", sessionId);

    let a = new Date();
    let alert = {
      username: username,
      message: "has joined the chat!",
      time: a
    };
    messages = messages.concat(alert);

    if (username === "Marie") {
      console.log("Admin is connected");
      res.send(JSON.stringify({ success: true }, { admin: true }));
      return;
    }

    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/newmessage", upload.single("file"), (req, res) => {
  console.log("New message endpoint:", req.body);
  //info sur le user
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  let msg = req.body.msg;

  // let file = req.body.file;

  if (sessions[sessionId] === undefined) {
    res.send(JSON.stringify({ success: false }));
    return;
  }

  let exist = false;

  actives.forEach((element, i) => {
    console.log(username, element.username);
    if (element.username === username) {
      console.log("found matching usernames");
      exist = true;
      actives[i].time = new Date();
    }
  });

  if (exist === false) {
    let a = {
      username: username,
      time: new Date()
    };
    actives = actives.concat(a);
  }

  //on declare un temps
  let time = new Date();

  // on s occupe de l'image:
  let file = req.file;
  if (file !== undefined) {
    let frontendPath = "http://localhost:4000/images/" + file.filename;
    console.log("path for image=>", frontendPath);
    let newMsg = {
      username: username,
      message: msg,
      img: frontendPath,
      time: time
    };

    messages = messages.concat(newMsg);
    console.log("new message", newMsg);
    res.send(JSON.stringify({ success: true }));
    return;
  }

  let newMsg = { username: username, message: msg, time: time };
  messages = messages.concat(newMsg);
  let length = messages.length - 20;
  if (length < 0) length = 0;
  messages = messages.slice(length);

  console.log("new message", newMsg);
  res.send(JSON.stringify({ success: true }));
  return;
});

app.post("/logout", upload.none(), (req, res) => {
  console.log("request to endpoint /logout");
});

let port = 4000;

app.listen(port, () => {
  console.log("The server is launched on:", port);
});
