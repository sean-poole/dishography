const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const profileController = require("../controllers/profile");
const favoritesController = require("../controllers/favorites");
const feedController = require("../controllers/feed");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Main Routes
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, profileController.getProfile);
router.get("/favorites", ensureAuth, favoritesController.getFavorites);
router.get("/feed", ensureAuth, feedController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
