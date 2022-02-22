module.exports = {
  isLoggedIn(req, res, next) {
    //if user logged
    if (req.isAuthenticated()) {
      //true and continue with route function
      return next();
    }
    //false and redirect
    return res.redirect("/users/signin");
  },

  isNotLoggedIn(req, res, next) {
    //if user not logged
    if (!req.isAuthenticated()) {
      //true continue where is
      return next();
    }
      //false redirect to profile
    return res.redirect("/profile");
  },
};
