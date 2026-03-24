import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    password: { 
      type: String,
      required: [true, "Le mot de passe est requis."],
      select: false
     },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: (props) =>{
          return `Le rôle ${props} n'est pas un rôle valide.`;
        }
      },
      default: "user"
    }
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
