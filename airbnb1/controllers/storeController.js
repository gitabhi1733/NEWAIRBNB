const Home = require("./models/home");

const User = require("./models/User")

const mongoose = require('mongoose');  //  es me hi problem hi 1:10:19

exports.getIndex = (req, res) => {
  console.log(req.session);
   console.log("isloggedIn:", req.session.isloggedIn);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      home: registeredHomes,
      pageTitle: "index Hamara airbnb ",
      isloggedIn: req.session.isloggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res) => {
  Home.find().then((registeredHomes) => {
    res.render("store/homes", {
      home: registeredHomes,
      pageTitle: "  homes Hamara airbnb ",
      isloggedIn: req.session.isloggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomesDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.redirect("/homes");
      }

      res.render("store/home_details", {
        home: home,
        pageTitle: "Home Detail",
        isloggedIn: req.session.isloggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/homes");
    });
};


// exports.postRemovefavourites = (req, res) => {
//   const homeId = req.params.homeId;

//  favourites
//    .deleteOne({ homeId: homeId })
//    .then(() => {
//      res.redirect("/favorites");
//    })
//    .catch((err) => {
//      console.log(err);
//    });
// };
exports.postRemovefavourites = async (req, res) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;

  try {
    const user = await User.findById(userId);

    user.favouriteHomes = user.favouriteHomes.filter(
      (favId) => favId.toString() !== homeId,
    );

    await user.save();

    res.redirect("/favorites");
  } catch (err) {
    console.log(err);
    res.redirect("/favorites");
  }
};



exports.getfavorites = async (req, res, next) => {
  const userId = req.session.user._id
  try {
    const user = await User.findById(userId).populate
      ('favouriteHomes');
    res.render("store/favorite", {
      home: user.favouriteHomes,
      pageTitle: "Favourites",
      isloggedIn: req.session.isloggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log( " this is erroe"+err)
    res.redirect('/');
     console.log(" this is erroe" + err);
  }
 
}

 



// exports.postfavorites =  async (req, res) => {
//   const homeId = req.body.id;
//   const userId = req.session.user._id;
//   try {
//     const user = await User.findOne({ _id: userId });
//     if (!user.favouriteHomes.includes(homeId)) {
//       user.favouriteHomes.push(homeId);
//       await user.save();
     
    
//     }
//   } catch (err) {
//     console.log(  err)
    
//   } finally {
//     console.log("not to run")
//     res.redirect("store/favorite");
//     console.log("after")
    
//   }
   
// };

exports.postfavorites = async (req, res) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;

  try {
    const user = await User.findById(userId);

    if (!user.favouriteHomes.includes(homeId)) {
      user.favouriteHomes.push(homeId);
      await user.save();
    }

    res.redirect("/favorites");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};