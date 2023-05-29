const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    image: { type: String, required: false },
    cloudinaryId: { type: String, required: false },
    favorites: [{
      recipeId: { type: String },
      authorId: { type: String },
      author: { type: String },
      name: { type: String },
      desc: { type: String },
      image: { type: String },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }]
});

// Password hash middleware.
UserSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
});
  
// Helper method for validating user's password.
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch(err) {
    throw err;
  }
};

module.exports = mongoose.model("User", UserSchema);
