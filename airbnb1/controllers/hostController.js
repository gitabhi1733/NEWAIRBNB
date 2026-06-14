const path = require("path");
const mongoose = require("mongoose");
const rootDir = require("../util/path-util");
const Home = require("../controllers/models/home");


exports.getAddhome = (req, res, next) => {
  res.render("host/edit-Home", {
    editing: false,
    pageTitle: "host your home",
    isloggedIn: req.session.isloggedIn,
    user: req.session.user,
  });
};
//chatgpt
exports.getEdithome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  console.log(editing);

  if (!editing) {
    console.log("editing flag not set properly");
    return res.redirect("/host/host-home");
  }

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("home not found for editing");
      return res.redirect("/host/host-home");
    }

    console.log(homeId, editing);

    res.render("host/edit-Home", {
      home: home,
      editing: true,
      pageTitle: "Edit Your Home",
      isloggedIn: req.session.isloggedIn,
      user: req.session.user,
    });
  });
};

exports.addhome = (req, res, next) => {
  console.log(req.body);

  const houseName = req.body.houseName;
  const price = req.body.price;
  const location = req.body.location;
  const rating = req.body.rating;
  const photoUrl = req.body.photoUrl;

  const newHome = new Home({ houseName, price, location, rating, photoUrl,host:req.session.user._id, });

  newHome
    .save()
    .then(() => {
      res.render("host/home-added", {
        pageTitle: "Home Hosted",
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/host/add-home");
    });
};


exports.postEdithome = (req, res, next) => {
  const { id, houseName, price, location, rating, photoUrl } = req.body;

  Home.findById(id)
    .then((existingHome) => {
      if (!existingHome) {
        console.log("home not found for editing");
        return  res.redirect("/host/host-homes") ;                 
      }

      existingHome.houseName = houseName;
      existingHome.price = price;
      existingHome.location = location;
      existingHome.rating = rating;
      existingHome.photoUrl = photoUrl;

      return existingHome.save();
    })
    .then(() => {
      return res.redirect("/host/host-homes");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/host/host-homes");
    });
};








exports.postDeleteHome = (req, res) => {
  
    const homeId = req.params.homeId;
  console.log("came to delete", homeId);
  
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host-homes");
    })
    .catch((err) => {
      console.log("error occur while deleting home", err);
    });
};

exports.getHostHome = (req, res, next) => {
  Home.find({ host: req.session.user._id }).then((registeredHomes) => {
    console.log(registeredHomes);
    res.render("host/host-home", {
      home: registeredHomes,
      pageTitle: "  host home ",
      isloggedIn: req.session.isloggedIn,
      user: req.session.user,
    });
  });
};
