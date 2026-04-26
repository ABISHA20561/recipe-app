const mongoose = require("mongoose");

const SavedRecipeSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipeIdx:   Number,
  recipeId:    Number,
  name:        String,
  ingredients: [String],
  nutrition:   [Number],
  score:       Number,
  savedAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedRecipe", SavedRecipeSchema);