const mongoose = require("mongoose");

const expense_attributes = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, required: true },
});

let expeenses = mongoose.model("expenses", expense_attributes);
module.exports = expeenses;
