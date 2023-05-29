const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const profileController = require("../controllers/profile");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Profile Routes
router.get("/:id", ensureAuth, profileController.getProfile);
router.get("/:id/editProfile", ensureAuth, profileController.getEditProfile);
router.put("/:id/editProfile", upload.single("image"), profileController.editProfile);
router.get("/:id/addRecipe", profileController.getAddRecipe);
router.post("/:id/addRecipe", upload.single("file"), profileController.addRecipe);
router.get("/:id/editRecipe/:recipeId", profileController.getEditRecipe);
router.put("/:id/editRecipe/:recipeId", upload.single("file"), profileController.editRecipe);
router.delete("/:id/deleteRecipe/:recipeId", profileController.deleteRecipe);

module.exports = router;
