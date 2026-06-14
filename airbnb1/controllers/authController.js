
const {check, validationResult} = require('express-validator');
const User = require('./models/User');
const bcrypt = require("bcrypt");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", { pageTitel: "page found", isloggedIn: false });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitel: "page found",
    isloggedIn: false,
    errorMessages:[],
  });
};

exports.postlogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    console.log("Login Email:", email);
    console.log("Login Password:", password);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("user and mismatch "+user, isMatch);
    if (!isMatch) {
      throw new Error("Password does not match");
    }
    // req.session.isloggedIn = true;
    
    //  req.session.user = user;

    //  await req.session.save();
    //  res.redirect("/");
    req.session.isloggedIn = true;
    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      userType:user.userType,
    };

    console.log("Before Save:", req.session);

    req.session.save((err) => {
      console.log("Session Saved", err);
      res.redirect("/");
    });

  } catch (err) {
     res.render("auth/login", {
      pageTitel: "login",
      isloggedIn: false,
      errorMessages: [err.message],
    });
  }
};



const firstNameValidator =
  check('firstName')
    .notEmpty()
    .withMessage("First name is mandatory")
    .trim()
    .isLength({ min: 2 })
    .withMessage('first name  should be minium 2 chars')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('first name should only contain english aplnabets');

const LASTNAME = check("lastName")
  .notEmpty()
  .withMessage("last  name is mandatory")
  .trim()
  .isLength({ min: 4 })
  .withMessage('last name should be minium 4chars ')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('last name should only contain english alphabat');

const EMAIL = check('email')
  .isEmail()
  .withMessage('please enter a vaild email')

const PASSWORD = check("password")
  .trim()
  .isLength({ min: 8 })
  .withMessage("password should be minium 8 chars")
  .matches(/[a-z]/)
  .withMessage("password should have atleast one small alphabet")
  .matches(/[A-Z]/)
  .withMessage("password should have atleast one capital alphabet")
  .matches(/[ @#$%^&*()_]/)
  .withMessage("password should have atleast one special charater")
const CONFORMPASSWORD = check("confirm_password")
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('confirm password does not match password');
    }
    return true;
  })
const USERTYPE = check('userType')
  .trim()
  .notEmpty()
  .withMessage("user type is required")
  .isIn(['guest', 'host'])
  .withMessage('user type is invalid')

    



exports.postSignup = [
  firstNameValidator,
  LASTNAME,
  EMAIL,
  PASSWORD,
  CONFORMPASSWORD,
  USERTYPE,

  (req, res, next) => {
    console.log("user came for signup:", req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitel: "login",
        isloggedIn: false,
        errorMessages: errors.array().map((error) => error.msg),
        oldInput: req.body,
      });
    }

    const { firstName, lastName, email, password, userType } = req.body;
    bcrypt.hash(password, 12).then(hashedPassword => {
      console.log( " hash password"+hashedPassword);
       const user = new User({
         firstName,
         lastName,
         email,
         password:hashedPassword,
         userType,
       });

       user
         .save()
         .then((result) => {
           console.log("User Saved:", result);

           req.session.destroy((err) => {
             if (err) {
               console.log(err);
             }
             res.redirect("/login");
           });
         })
         .catch((error) => {
           console.log(error);

           return res.status(422).render("auth/signup", {
             pageTitel: "login",
             isloggedIn: req.session.isloggedIn,
             errorMessages: ["Error while saving user"],
             oldInput: req.body,
           });
         });
      
    })

   
  },
];
exports.postlogout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
};//1:11:13
