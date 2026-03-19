import express from "express";
import mongoose from "mongoose";
import campsiteRoutes from "./routes/campsites.mjs";
import reservationRoutes from "./routes/reservations.mjs";
import dbRoutes from "./routes/db.mjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes


app.use("/api/db", dbRoutes);

app.use("/api/campsites", campsiteRoutes);
app.use("/api/reservations", reservationRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
