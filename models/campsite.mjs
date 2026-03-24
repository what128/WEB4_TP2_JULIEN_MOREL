import mongoose from "mongoose";

const campsiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"]
     },
    location: { 
      type: String,
      required: [true, "La localisation est requise"]
    },
    description: { type: String },
    type: {
      type: String,
      enum:
    {
      values: ["tente", "rv", "chalet", "glamping", "arrière-pays", "autre"],
      message: (props) =>{
        return `Le type '${props}' n'est pas valide pour un site de camping.`
      } 
      
    },
      required: [true, "Le type de site de camping est requis"]
    },
    pricePerNight: { 
      type: Number,
      required: [true, "Le prix par nuit est requis."],
      validate: {
        validator: function (v){
          return v > 0;
        },
        message: "Le prix par nuit doit être supérieur à 0."
      }
     },
    capacity: { 
      type: Number,
      required: [true, "La capacité est requise."],
      validate: {
        validator: function(v){
          return v > 0;
        },
        message: "La capacité doit être supérieure à 0."
      }
     },
    maxVehicleLength: {
      type: Number,
      required: function() {
        return this.type == "rv";
      },
      validate: {
        validator: function(v) {
          return this.type !== "rv" || (v != null && v > 0);
        }
      },
      message: "La longueur maximale du véhicule est requise et doit être supérieure à 0 pour les sites RV"
    }, // in meters, required for RV sites
    amenities: {
      type: [String],
      enum: [
        "électricité",
        "eau",
        "égout",
        "feu de camp",
        "table de pique-nique",
        "abri",
        "wifi",
        "douche",
        "toilettes",
      ],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Campsite", campsiteSchema);
