import express from "express";
import mongoose from "mongoose";
import campsiteRoutes from "./routes/campsites.mjs";
import reservationRoutes from "./routes/reservations.mjs";
import authRoutes from "./routes/auth.mjs";
import dbRoutes from "./routes/db.mjs";
import dotenv from "dotenv";
import { get404, getErrors } from "./controllers/errorController.mjs";

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
app.use("/api/auth", authRoutes);
app.use("/api/campsites", campsiteRoutes);
app.use("/api/reservations", reservationRoutes);

app.use("/", get404);

app.use(getErrors);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
