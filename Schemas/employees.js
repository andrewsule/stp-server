const mongoose = require("mongoose");

const employees_attributes = new mongoose.Schema({
  uid: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  image: { type: String, required: true },
  next_of_kin: { type: String, required: true },
  nof_contact: { type: String, required: true },
});

let employees = mongoose.model("employees", employees_attributes);
module.exports = employees;
