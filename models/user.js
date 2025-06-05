import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define collection and schema
const userSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  login: {
    type: String,
    match: /^[a-zA-Z0-9-_]+$/
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  email: {
    type: String,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]{2,6}$/
  },
  logo: {
    type: String,
    enum: ['aubergine', 'banane', 'biere', 'biscuit', 'brochette', 'burger', 'cafe', 'carotte', 'champagne', 'cherry', 'chocolat', 'citron', 'citrouille', 'cocktail', 'coco', 'croissant', 'donut', 'egg', 'fraise', 'fromage', 'gateau', 'glace', 'kiwi', 'mais', 'meat', 'myrtille', 'nutella', 'orange', 'pasteque', 'pepper', 'poire', 'poireaux', 'poulet', 'ramen', 'riz', 'salade', 'sandwish', 'sucette', 'sushi', 'taco', 'tarte', 'tomato'],
    default: 'egg'
  },
  votedFor: [
    {
      id:  { type: Number },
      mark:  { type: Number}
    }
  ],
  cart: [
    {
      ingredient: { type: String, required: true },
      quantity: { type: String, default: ''},
      unit: { type: String, default: ''},
      checked: Boolean
    }
  ]
}, {
   collection: 'users'
})


const User = mongoose.model('User', userSchema);

export default User;
