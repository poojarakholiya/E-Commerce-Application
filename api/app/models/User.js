const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    usr_fname: {
      type: String,
      required: [true, "Name is required"],
    },
    usr_lname: {
      type: String,
      required: [true, "Name is required"],
    },
    usr_email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    usr_email_verified:{
      type : Boolean,
      default: false
    },
    usr_password: {
      type: String,
      required: [true, "Password is required"],
    },
    usr_role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    usr_status: {
      type: Boolean,
      default: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("usr_password")) return next();
  this.usr_password = await bcrypt.hash(this.usr_password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.usr_password);
};

userSchema.virtual('usr_name').get(function () {
  const fName = this.usr_fname || '';
  const lName = this.usr_lname || '';
  return `${fName} ${lName}`.trim();
});

module.exports = mongoose.model("User", userSchema);
