const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favorites");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Favorites Routes
router.put("/:id/addBookmark", favoritesController.addBookmark);
router.put("/:id/removeBookmark", favoritesController.removeBookmark);

module.exports = router;