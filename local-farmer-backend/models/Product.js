// Product.js
import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: String,
  subcategories: [{ name: String }],
});

const Product = mongoose.model('products', productSchema);

export default Product;
