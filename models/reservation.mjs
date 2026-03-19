import {Schema, model} from "mongoose";

const reservationSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: [true, "L'utilisateur est requis."]
     },
    campsite: {
      type: Schema.Types.ObjectId,
      ref: "Campsite",
      required: [true, "Le site de campement est requis."]
    },
    startDate: { 
      type: Date,
      required: [true, "La date de début est requise."],
      validate: {
        validator: async function(v) {
         if (!this.endDate || v >= this.endDate) return false;

          const autreReservation = await mongoose.model("Reservation").findOne({
          $or: [
            { startDate: { $lte: this.endDate }, endDate: { $gte: v } }
          ]
        });
      return !autreReservation;

        },
        message: "La date de début doit être avant la date de fin et ne doit pas être pendant une autre réservation."
      }
    },
    endDate: { 
      type: Date,
      required: [true, "La date de fin est requise."],
       validate: {
        validator: function(v) {
          return this.startDate && v > this.startDate;
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
            if (!this._id) return true;

            const documentExistant = await mongoose.model("Reservation").findById(this._id);

            if (!documentExistant) return true;
            
            return documentExistant.status !== "cancelled";
          },
          message: "Une réservation annulée ne peut pas être modifiée."
        }
      ]
    },
  },
  { timestamps: true },
);

export default model("Reservation", reservationSchema);
