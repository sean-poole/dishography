const User = require("../models/User");
const Recipe = require("../models/Recipe");

module.exports = {
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find().sort({ createdAt: "desc" }).limit(12).lean();
      res.render("feed.ejs", { recipes: recipes, user: req.user });
    } catch(err) {
      console.log(err);
    }
  },
  getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      res.render("viewRecipe.ejs", { recipe: recipe, user: req.user });
    } catch(err) {
      console.log(err);
    }
  },

}
