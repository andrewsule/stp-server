const mongoose = require("mongoose");

const products_attributes = new mongoose.Schema({
  name: { type: String, required: true },
  sold_by: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiry_date: { type: Date, required: true },
  buying_price: { type: Number, required: true },
  selling_price: { type: Number, required: true },
  initialquantity: { type: Number, required: true },
});
let products = mongoose.model("products", products_attributes);
module.exports = products;
