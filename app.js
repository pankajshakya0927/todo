const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");
const path = require("path");
const compression = require('compression');

const taskRoute = require("./routes/taskRoute");

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

// user routes
app.get('/api', (req, res) => res.send('ToDo API Working successfully ✅'))
app.use('/api', taskRoute);

// serve the static files
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/public"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/public/index.html"));
  });
}

module.exports = app;
