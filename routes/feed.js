const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Feed Routes
router.get("/:id", ensureAuth, feedController.getRecipe);

module.exports = router;