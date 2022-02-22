const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../libs/auth");

//SIGN UP
router.get("/users/signup", isNotLoggedIn, (req, res) => {
  res.render("users/signup");
});

router.post(
  "/users/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/users/signup",
    failureFlash: true,
  })
);

//SIGN IN

router.get("/users/signin", isNotLoggedIn, (req, res) => {
  res.render("users/signin");
});

router.post("/users/signin", (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/users/signin",
    failureFlash: true,
  })(req, res, next);
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect("/");
});


module.exports = router;
