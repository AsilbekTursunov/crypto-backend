import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from 'cors';
// routes 
import authRoute from "./routes/authRoute.js";
const app = express();
config();

app.use(cors({
  origin: '*',
  credentials: true, // allow cookies
}))

app.use(json());
app.use(cookieParser()); // add cookie-parser middleware to handle cookies
app.use(fileUpload()); 

app.use("/api/auth", authRoute); 

// connect to MongoDB and start the server
const PORT = 8080;

// call port
const bootstrap = async () => {
  try {
    await connect(process.env.DB_URL)
      .then(() => console.log("Connected to MongoDB"));
    app.listen(PORT, () => console.log(`Connected to ${PORT}`));
  } catch (error) {
    console.log(`Error connecting:${error}`);
  }
};

bootstrap();
