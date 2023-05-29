const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User");
const Recipe = require("../models/Recipe");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const profile = await User.findById(req.params.id);
      const recipes = await Recipe.find({ user: profile._id });
      res.render("profile.ejs", { user: req.user, profile: profile, recipes: recipes });
    } catch(err) {
      console.log(err);
    }
  },

  getEditProfile: async (req, res) => {
    try {
      res.render("editProfile.ejs", { user: req.user });
    } catch(err) {
      console.log(err);
    }
  },

  editProfile: async (req, res) => {
    try {
      let userId = await User.findById({ _id: req.user._id });
      if (userId.image !== undefined) {
        await cloudinary.uploader.destroy(userId.cloudinaryId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "dd-profile-images"
      });

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          image: result.secure_url,
          cloudinaryId: result.public_id
        },
        { new: true }
      );
      console.log("Profile picture updated.");
      res.redirect(`/profile/${req.user.id}`);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Unable to upload image." });
    }
  },

  getAddRecipe: async (req, res) => {
    try {
      res.render("addRecipe.ejs", { user: req.user });
    } catch(err) {
      console.log(err);
    }
  },

  addRecipe: async (req, res) => {
    try {
      const ingredients = req.body.ingredients.split("\n").map(e => e.replace(/\r/g, ""));
      const directions = req.body.directions.split("\n").map(e => e.replace(/\r/g, ""));
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "dd-recipe-images"
      });

      await Recipe.create({
        user: req.user.id,
        author: req.user.firstName + " " + req.user.lastName,
        name: req.body.recipeName,
        desc: req.body.recipeDesc,
        ingredients: ingredients,
        directions: directions,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        likes: 0
      });
      console.log(`Recipe added by ${req.user.firstName}.`);
      res.redirect(`/profile/${req.user.id}`);
    } catch(err) {
      console.log(err);
    }
  },

  getEditRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById({ _id: req.params.recipeId });
      console.log(recipe);
      res.render("editRecipe.ejs", { user: req.user, recipe: recipe });
    } catch(err) {
      console.log(err);
    }
  },

  editRecipe: async (req, res) => {
    try {
      const { id, recipeId } = req.params;
      const { recipeName, recipeDesc, ingredients, directions } = req.body;
      const recipe = await Recipe.findById(recipeId);

      // Update the recipe information.
      if (req.file) {
        // Destroy and replace the previous recipe image if a new file is provided.
        await cloudinary.uploader.destroy(recipe.cloudinaryId);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "dd-recipe-images"
        });

        const updatedRecipe = await Recipe.findByIdAndUpdate(
          { _id: recipeId },
          {
            name: recipeName,
            desc: recipeDesc,
            ingredients: ingredients.split("\n").map(e => e.replace(/\r/g, "")),
            directions: directions.split("\n").map(e => e.replace(/\r/g, "")),
            image: result.secure_url,
            cloudinaryId: result.public_id
          },
          { new: true }
        );

        console.log(updatedRecipe);
      } else {
        // Keeps the previous recipe image if one is not provided.
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          { _id: recipeId },
          {
            name: recipeName,
            desc: recipeDesc,
            ingredients: ingredients.split("\n").map(e => e.replace(/\r/g, "")),
            directions: directions.split("\n").map(e => e.replace(/\r/g, "")),
          },
          { new: true }
        );

        console.log(updatedRecipe);
      }

      res.redirect(`/profile/${req.params.id}`);
    } catch(err) {
      console.log(err);
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById({ _id: req.params.recipeId });
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      await Recipe.deleteOne({ _id: req.params.recipeId });
      console.log("Recipe deleted.");
      res.redirect(`/profile/${req.user.id}`);
    } catch(err) {
      console.log(err);
      res.redirect(`/profile/${req.user.id}`);
    }
  },

}
