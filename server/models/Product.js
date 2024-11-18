const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['electronics', 'footwear', 'fashion', 'home', 'toys'] },
  price: { type: Number, required: true },
  image: [{ type: String }] ,
  description: { type: String, required: true } 
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);
