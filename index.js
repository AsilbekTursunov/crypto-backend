const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors  = require('cors')
// routes 
const authRoute = require("./routes/auth.route");
const errorMiddle = require("./middleware/error.middleware");
const app = express();
dotenv.config();

app.use(cors({
  origin: '*',
  credentials: true, // allow cookies
}))

app.use(express.json());
app.use(express.static("static"));

app.use(cookieParser()); // add cookie-parser middleware to handle cookies
app.use(fileUpload()); 

app.use("/api/auth", authRoute);
app.use(errorMiddle);

// connect to MongoDB and start the server
const PORT = 8080;

// call port
const bootstrap = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log("Connected to MongoDB"));
    app.listen(PORT, () => console.log(`Connected to ${PORT}`));
  } catch (error) {
    console.log(`Error connecting:${error}`);
  }
};

bootstrap();
