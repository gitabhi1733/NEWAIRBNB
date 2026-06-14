const path = require("path");
const express = require("express");
const storeController = require("../controllers/storeController");
const storerouter = express.Router();

const rootDir = require("../util/path-util");

storerouter.get("/", storeController.getIndex);
storerouter.get("/homes", storeController.getHomes);
storerouter.get("/homes/:homeId", storeController.getHomesDetails);
storerouter.get("/favorites", storeController.getfavorites);
storerouter.post("/favorites", storeController.postfavorites);
storerouter.post("/favourites/delete/:homeId",storeController.postRemovefavourites);

module.exports = storerouter;
