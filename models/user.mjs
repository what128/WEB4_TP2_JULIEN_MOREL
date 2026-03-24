import mongoose, {Schema, model} from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String,
      required: [true, "Le prénom est requis."]
     },
    lastName: { type: String,
      required: [true, "Le nom est requis."]
     },
    email:{
    type: String,
    required: [true, "Le courriel est requis"],
    lowercase: true,
    trim: true,
    validate: [
    {
      validator: function (v) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(v);
    },
    message: "Veuillez fournir une adresse email valide."
    },
    {
      validator: async function (v) {
         const existant = await mongoose.model("User").findOne({ email: v });
        return !existant || existant._id == this._id;
    },
    message: "Ce courriel est déjà utilisé."
    },
  ]
  },
    phone: { type: String,
      validate: {
        validator: function(v){
          const phoneRegex = /^[\d]{10}$/;
          return phoneRegex.test(v);
        }
      }
     },
    password: { type: String,
      required: [true, "Le mot de passe est requis."],
      validate: {
        validator: function(v) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

          return passwordRegex.test(v);
        },
        message: "Le mot de passe doit contenir 8 caractères, dont au moins 1 majuscule, minuscule, caractère spécial et chiffre."
      }
     },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: (props) =>{
          return `Le rôle ${props} n'est pas un rôle valide.`;
        }
      }
    }
  },
  { timestamps: true },
);

export default model("User", userSchema);
