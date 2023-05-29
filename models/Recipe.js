const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    author: { type: String, required: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    ingredients: { type: [String], required: true },
    directions: { type: [String], required: true },
    image: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    likes: { type: Number, required: true }
});

module.exports = mongoose.model("Recipe", RecipeSchema);
