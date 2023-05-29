const User = require("../models/User");
const Recipe = require("../models/Recipe");

module.exports = {
  getFavorites: async (req, res) => {
    try {
      const profile = await User.findById(req.user._id);
      const favorites = profile.favorites;

      res.render("favorites.ejs", { user: req.user, profile: profile, favorites: favorites });
    } catch(err) {
      console.log(err);
    }
  },

  addBookmark: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const recipe = await Recipe.findById(req.params.id);

      // Prevent duplicate bookmarks
      if (user.favorites.some(obj => obj.recipeId == recipe._id)) {
        res.redirect(`/feed/${req.params.id}`);
        alert("That recipe is already bookmarked.");
      } else {
        user.favorites.push({ 
          recipeId: recipe._id,
          authorId: recipe.user,
          author: recipe.author,
          name: recipe.name,
          desc: recipe.desc,
          image: recipe.image,
          user: user
         });
        await user.save();
  
        console.log("Bookmark added.");
        res.redirect(`/feed/${req.params.id}`);
      }
    } catch(err) {
      console.log(err);
    }
  },

  removeBookmark: async (req, res) => {
    try {
      const user = req.user._id;
      const recipe = req.params.id;

      await User.findOneAndUpdate(
        { _id: user },
        { $pull: { favorites: { recipeId: recipe } } },
        { new: true }
      );

      console.log("Bookmark removed.");
      res.redirect(`/feed/${req.params.id}`);
    } catch(err) {
      console.log(err);
    }
  }
}
