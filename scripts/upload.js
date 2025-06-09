import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Recipe from '../models/recipe.js';

dotenv.config();

// 1. Cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. MongoDB connection
await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

// 3. Get images from local folder
const imageFolder = '../../cookingbook-next/public/assets/img/plats';
const files = fs.readdirSync(imageFolder).filter(file =>
  ['.jpg'].includes(path.extname(file).toLowerCase())
);

console.log(`🔍 ${files.length} images found in ${imageFolder}`);

for (const file of files) {
  const fullPath = path.join(imageFolder, file);
  const recipeID = path.parse(file).name; // ex: "1024.jpg" → "1024"

  try {
    // 4. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fullPath, {
      folder: 'recettes'
    });

    console.log(`📤 Upload successed : ${recipeID} → ${result.secure_url}`);

    // 5. Update MongoDB
    let recipe = await Recipe.findOne({ recipeID }).exec();
    if(recipe) {
      recipe["imageUrl"] = result.secure_url;
      // save
      await recipe.save();
      console.log(`✅ Update of : ${recipeID}`);
    } else {
      console.warn(`⚠️ No recipe found for "${recipeID}", but image uploaded`);
    }

  } catch (err) {
    console.error(`❌ Error with ${file} :`, err.message);
  }
}


mongoose.disconnect();
console.log('🎉 Finish');
