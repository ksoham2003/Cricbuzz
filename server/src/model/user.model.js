import { ROLES } from "../constant/model.constant.js";
import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.SCORER },
    refreshToken: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const userModel = model("User", userSchema);
export default userModel;