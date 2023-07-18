const mongoose = require("mongoose");

const sales_attributes = new mongoose.Schema({
  customer_name: { type: String, required: true },
  customer_phone: { type: Number, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  selling_price: { type: Number, required: true },
  buying_price: { type: Number, required: true },
  sold_by: { type: String, required: true },
  date: { type: Date, required: true },
});
let sales = mongoose.model("sales", sales_attributes);
module.exports = sales;
