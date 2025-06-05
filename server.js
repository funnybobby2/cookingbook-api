import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from "body-parser";
import { upload } from './cloudinary.js';

import recipeRoute from "./routes/recipes.js";
import userRoute from "./routes/users.js";

dotenv.config();

const uri = process.env.MONGODB_URI;

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(() => {
      console.log('Database sucessfully connected')
   },
   error => {
      console.log('Database could not connected: ' + error)
   }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(cors());

app.use('/api/recipes', recipeRoute);
app.use('/api/users', userRoute);

// image Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'Image non envoyée' });
  }
  res.json({ url: req.file.path });
});

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log('Connected to port ' + port)
})

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});