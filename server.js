const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const multer = require("multer");

const app = express();

const dotenv = require("dotenv");

dotenv.config();

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log(err.message));

// Create a schema for the uploaded images
const imageSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  fileType: String,
});

// Create a model for the uploaded images
const Image = mongoose.model("Image", imageSchema);

// Setup multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// Create a route to handle file uploads
app.post("/api/upload", upload.single("photo"), async (req, res, next) => {
  const { filename: fileName, path: filePath, mimetype: fileType } = req.file;
  console.log(req.file);
  // Save the uploaded image to MongoDB
  const image = new Image({
    fileName,
    filePath,
    fileType,
  });
  await image.save();

  // Return the image information to the frontend
  res.json({ success: true, image });

  next();
});

app.listen(8000, () => console.log("Server started on port 8000"));
