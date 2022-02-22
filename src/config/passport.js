const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const helpers = require("../libs/helpers");

//SIGN UP
passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { name, confirm_password } = req.body;

      if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirm_password === ""
      ) {
        req.flash("fail", "Empty spaces");
      } else if (password != confirm_password) {
        done(null, false, req.flash("fail", "Password do not match"));
      } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
          done(
            null,
            false,
            req.flash("fail", "The email is already registered")
          );
        } else {
          const newUser = new User({ name, email, password });
          newUser.password = await helpers.encryptPassword(password);
          const result = await newUser.save();
          newUser.id = result.insertId;
          return done(
            null,
            newUser,
            req.flash("success", "User created successfully")
          );
        }
      }
    }
  )
);

//SIGN IN
passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      // validate the correct email
      const user = await User.findOne({ email: email });
      if (!user) {
        done(null, false, req.flash("fail", "Not user found"));
      } else {
        const match = await helpers.matchPassword(password, user.password);
        if (match) {
          //not error, user, message
          done(null, user, req.flash("success", "Welcome", user.name));
        } else {
          //not error, not user, message
          done(null, false, req.flash("fail", "Incorrect Password"));
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).lean();
  done(null, user);
});
