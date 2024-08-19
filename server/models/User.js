import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["admin", "employee"], default: "employee" },
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: String,
  shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shift" }],
  //todo add maximum shifts
  maximumShifts: { type: Number, default: 5 }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
