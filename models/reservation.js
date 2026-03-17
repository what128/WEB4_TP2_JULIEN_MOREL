const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: [true, "L'utilisateur est requis."]
     },
    campsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campsite",
      required: [true, "Le site de campement est requis."]
    },
    startDate: { 
      type: Date,
      required: [true, "La date de début est requise."],
      validate: {
        validator: function(v) {
          return this.startDate < this.endDate;
        },
        message: "La date de début doit être une date précédant la date de fin."
      }
    },
    endDate: { 
      type: Date,
      required: [true, "La date de fin est requise."],
       validate: {
        validator: function(v) {
          return this > this.startDate;
        },
        message: "La date de début doit être une date précédant la date de fin."
      }
   },
    guests: { 
      type: Number,
      validate: {
        validator: async function (v) {
          if (v <= 0) return false;

          const campsite = await mongoose.model("Campsite").findById(this.campsite);

          if (!campsite) return false;

          return v <= campsite.capacity;
        },
    message: "Le nombre de personnes dépasse la capacité du site de camping."
  }
    },
    vehicleLength: { type: Number },
    totalPrice: { type: Number },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      validate: [
        {
          validator: async function(v) {
            return this.status == "cancelled";
          },
          message: "Une réservation annulée ne peut pas être modifiée."
        }
      ]
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reservation", reservationSchema);
