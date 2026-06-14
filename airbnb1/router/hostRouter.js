const express = require('express')
const hostrouter = express.Router();
const path = require("path");
const rootDir = require("../util/path-util");
const hostController = require("./../controllers/hostController")


hostrouter.get("/add-home", hostController.getAddhome);
hostrouter.post("/add-home", hostController.addhome);
hostrouter.get("/host-homes", hostController.getHostHome);

hostrouter.get("/host/edit-home/:homeId", hostController.getEdithome);
hostrouter.post("/host/edit-home", hostController.postEdithome);
hostrouter.post("/host/delete-home/:homeId", hostController.postDeleteHome);


//hostrouter.get("/",Host.host);// mistak only filepath 

exports.hostrouter = hostrouter;



