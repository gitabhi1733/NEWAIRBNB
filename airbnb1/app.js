const express = require("express");
require("dotenv").config();
console.log(+process.env.MONGO_URL);
const MONGO_URL = process.env.MONGO_URL;

const app = express();
const storerouter = require("./router/storerouter");
const path = require("path");
const mongodb = require("mongodb");

const rootDir = require("./util/path-util");
const mongoose = require("mongoose");
const { hostrouter } = require("./router/hostRouter");
const { authRouter } = require("./router/authRouter");
app.set("view engine", "ejs");
app.set("views", "views");

const session = require("express-session");
const mongodb_session = require("connect-mongodb-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});

store.on("error", (error) => {
  console.log("Session Store Error:", error);
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my secret",
    resave: false,                
    saveUninitialized: true,
    store: store,
  }),
);



app.use((req, res, next) => {
  res.locals.isloggedIn = req.session.isloggedIn;
  res.locals.user = req.session.user;
  next();
});

app.use("/host", hostrouter);

app.use(express.static(path.join(rootDir, "public")));


app.use(storerouter);
app.use(hostrouter);
app.use(authRouter);

const PORT = 4000;

mongoose.connect(MONGO_URL).then(() => {
  console.log("connect");
  app.listen(PORT, () => {
    console.log(`server runnig at : http://localhost:${PORT}`);
  });
});

