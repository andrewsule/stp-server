const express = require("express");
const jwt = require('jsonwebtoken');
const bcryt = require('bcryptjs')
const dotenv = require("dotenv");
const router = express.Router();
const Products = require("./Schemas/products");
const sales = require("./Schemas/sales");
const employees = require("./Schemas/employees");
const expeenses = require("./Schemas/expenses");
const authentication = require("./middleWare");

//product configuration
router.post("/addstock",authentication, async (req, res) => {
  let stock = {
    name: req.body.name,
    sold_by: req.body.sold_by,
    quantity: req.body.quantity,
    expiry_date: req.body.expiry_date,
    buying_price: req.body.buying_price,
    selling_price: req.body.selling_price,
    initialquantity: 1,
  };
  let find = Products.find({ name: stock.name });
  if ((await find).length > 0) {
    res.json("present");
  } else {
    let product = new Products(stock);
    await product.save();
    res.json(`${stock.name} has been added to the system`);
  }
});

//get all products
router.get("/viewstock",authentication, async (req, res) => {
  let productview = await Products.find();
  res.json(productview);
});

//update product
router.get("/update/:id" ,authentication, async (req, res) => {
  let productID = req.params.id;
  let updateview = await Products.findById(productID);
  res.json(updateview);
});

router.put("/update/:id" , async (req, res) => {
  let productID = req.params.id;
  let updateproduct = {
    name: req.body.name,
    sold_by: req.body.sold_by,
    quantity: req.body.quantity,
    expiry_date: req.body.expiry_date,
    buying_price: req.body.buying_price,
    selling_price: req.body.selling_price,
  };
  updated = await Products.findByIdAndUpdate(
    productID,
    { $set: updateproduct },
    { new: true }
  );
  res.json({message:"Updates have taken place Successfully"})
});

//employee configuration

router.post("/addemployee" ,authentication, async (req, res) => {
  let empnum = await employees.find();
  let uid = `stp${String(empnum.length + 1).padStart(3, "0")}`
  let find = await employees.find({uid:uid})
  if(find.length>0){
     uid = `stp${String(empnum.length + 2).padStart(3, "0")}`
  }else{
      uid= `stp${String(empnum.length + 1).padStart(3, "0")}`
  }
  let salt = bcryt.genSaltSync(10)
  let hashPassword = bcryt.hashSync(req.body.password,salt)

  let employee = {
    uid:uid,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    position: req.body.position,
    salary: req.body.salary,
    phone: req.body.phone,
    password: hashPassword,
    address: req.body.address,
    image: req.body.image,
    next_of_kin: req.body.next_of_kin,
    nof_contact: req.body.nof_contact,
  };
  let addemp = new employees(employee);
  await addemp.save();
  res.json(`${employee.first_name} has been added to the system`);
});

//view employees
router.get("/viewemployees",authentication, async (req, res) => {
  let employeeview = await employees.find();
  res.json(employeeview);
});

//update employee
router.put("/update_employee/:id",authentication, async (req, res) => {
  let salt = bcryt.genSaltSync(10)
  let hashPassword = bcryt.hashSync(req.body.password,salt)
  let employeeID = req.params.id;
  let updatemployee = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    position: req.body.position,
    salary: req.body.salary,
    phone: req.body.phone,
    password: hashPassword,
    address: req.body.address,
    image: req.body.image,
    next_of_kin: req.body.next_of_kin,
    nof_contact: req.body.nof_contact,
  };
  updated = await employees.findByIdAndUpdate(
    employeeID,
    { $set: updatemployee },
    { new: true }
  );
  res.json({message:"Updates have taken place Successfully"})
});

//expeense configuration
router.post("/addexpense",authentication, async (req, res) => {
  let expeense = {
    name: req.body.name,
    cost: req.body.cost,
    date: new Date(),
  };

  let addexpense = new expeenses(expeense);
  await addexpense.save();
  res.send(`${expeense.name} expense has been added to the system`);
});

//view employees
router.get("/viewexpenses",authentication, async (req, res) => {
  let expenceview = await expeenses.find();
  res.json(expenceview);
});

//view sales 
router.get("/viewsales",authentication, async (req, res) => {
  let salesview = await sales.find();
  res.json(salesview);
});

//delete employee
router.delete("/delete/:id",authentication, (req, res) => {
  let id = req.params.id;
  employees.deleteOne({ uid: id })
    .then(() => {
      res.send("Employee deleted successfully!");
    })
    .catch((error) => {
      res.status(401).send("Error deleting employee");
    });
});

//adding sells
router.post("/addingsales",authentication, async (req, res) => {
  const allData = req.body;
  const saleData = allData[0]; // Assuming the sale data is the first element in the array
  const customerData = allData[1]; // Assuming the customer data is the second element in the array
  // Iterate over each sale data element and save them individually
  for (const sale of saleData) {
    const newSale = new sales({
      customer_name: customerData.name,
      customer_phone: customerData.phone,
      name: sale.name,
      quantity: sale.quantity,
      selling_price: sale.selling_price,
      buying_price: sale.buying_price,
      sold_by: sale.sold_by,
      date: new Date(),
    });

    await newSale.save();
    await Products.findOneAndUpdate(
      { name: sale.name },
      { $inc: { quantity: -sale.quantity } }
    );
  }

  res.send(`${customerData.name} sales have been saved`);
});

//get all sales
router.get("/viewsales" ,authentication, async (req, res) => {
  let productview = await sales.find();
  res.json(productview);
});

//administrator login
router.post("/administratorlogin", async (req, res) => {
  let administrator = {
    uid: req.body.id,
    password: req.body.password,
  };

  let user = await employees.findOne({uid:administrator.uid,position:"Administrator"})
    if(!user){ return res.status(401).json({message:"UID not Present"})}

    let password = await bcryt.compare(administrator.password,user.password)
    if(!password){return res.status(401).json({message:"Invalid Password"})}

    let payload = {
      user:{
        id : user._id
        }
      }
    let token = jwt.sign(payload,process.env.JWT_SECRET_KEY)
    res.status(200).json({token:token,user:user})
    
});

//staff login
router.post("/stafflogin", async (req, res) => {
  let staff = {
    uid: req.body.id,
    password: req.body.password,
  };
  let user = await employees.findOne({uid:staff.uid})
  if(!user){ return res.status(401).json({message:"UID not present"})}

  let password = await bcryt.compare(staff.password,user.password)
  if(!password){return res.status(401).json({message:"Invalid password"})}

  let payload = {
      user:{
        id : user._id
      }
    }
  let token = jwt.sign(payload,process.env.JWT_SECRET_KEY)
  res.status(200).json({token:token,user:user})
});
//staff-nav bar
router.get("/user_staff",authentication,async (req,res)=>{
  try{
    let user = await employees.findOne({_id:req.user.id})
    res.status(200).json({user:user})
  }
  catch{console.log("Error")} 
});
//admin-nav bar
router.get("/user_admin",authentication,async (req,res)=>{
  try{
    let user = await employees.findOne({_id:req.user.id})
    res.status(200).json({user:user})
  }
  catch{console.log("Error")} 
});
module.exports = router;
