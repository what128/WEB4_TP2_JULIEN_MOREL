import mongoose from "mongoose";
import * as utils from "../utils/utils.mjs";
import User from "../models/user.mjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Le prénom est requis."]
    },
    lastName: {
      type: String,
      required: [true, "Le nom est requis."]
    },
    email: {
      type: String,
      required: [true, "Le courriel est requis"],
      lowercase: true,
      trim: true,
      validate: [
        {
          validator: function (v) {
            return utils.validateEmail(v);
          },
          message: "Veuillez fournir une adresse email valide."
        },
        {
          validator: async function (v) {
            const existant = await User.findOne({ email: v, _id: { $ne: this._id } });
            return !existant;
          },
          message: "Ce courriel est déjà utilisé."
        },
      ]
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return utils.validatePhone(v);
        },
        message: "Le numéro de téléphone est invalide."
      }
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis."],
      validate: {
        validator: function (v) {
          return utils.validatePassword(v);
        },
        message: "Le mot de passe ne correspond pas aux exigences de sécurité"
      },
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: (props) => {
          return `Le rôle ${props} n'est pas un rôle valide.`;
        }
      },
      default: "user"
    }
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
