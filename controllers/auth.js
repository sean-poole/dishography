const passport = require("passport");
const moment = require("moment");
const validator = require("validator");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect(`/profile/${req.user.id}`);
  }
  res.render("index", {
    title: "Index",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || `/profile/${req.user.id}`);
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      console.log("Error: Failed to logout the user.", err);
      return next(err);
    }
    req.session.regenerate(err => {
      if (err) {
        console.log("Error: Failed to regenerate the session during logout.", err);
        return next(err);
      }

      req.user = null;
      res.redirect("/");
    });
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect(`/profile/${req.user.id}`);
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  User.findOne({ email: req.body.email })
    .then(existingUser => {
      if (existingUser) {
        req.flash("errors", {
          msg: `An account with that email address already exists.`
        });

        return res.redirect("../signup");
      }

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      });

      return user.save()
        .then(() => {
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect(`/profile/${req.user.id}`);
          });
        });
    })
    .catch(err => {
      return next(err);
    });
};
