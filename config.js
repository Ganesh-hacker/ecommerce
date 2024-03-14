const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://saibavesh5559:Ammanana1201@cluster0.lylfov2.mongodb.net/New");
connect.then(() => {
        console.log("Database connected Successfully");
    })
    .catch(() => {
        console.log("Database cannot be connected");
    });
const LoginSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mno: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const ProductsSchema= new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPersent: {
        type: Number,
        required: true
    },
    size: {
        type: Array,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    topLavelCategory: {
        type: String,
        required: true
    },
    secondLavelCategory: {
        type: String,
        required: true
    },
    thirdLavelCategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }

});
const CartproductsSchema= new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    imageUrl: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPersent: {
        type: Number,
        required: true
    },
    size: {
        type: Array,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    topLavelCategory: {
        type: String,
        required: true
    },
    secondLavelCategory: {
        type: String,
        required: true
    },
    thirdLavelCategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }

});
const PurchproductsSchema= new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    imageUrl: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPersent: {
        type: Number,
        required: true
    },
    size: {
        type: Array,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    topLavelCategory: {
        type: String,
        required: true
    },
    secondLavelCategory: {
        type: String,
        required: true
    },
    thirdLavelCategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }

});

const AddressSchema= new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname: {
        type: String,
        required: true
    },
    uname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mno: {
        type: Number,
        required: true
    },

});




const collection= new mongoose.model("Loginusers", LoginSchema);
const allinfo=new mongoose.model("allinfo",ProductsSchema);
const cartproducts=new mongoose.model("cartproducts",CartproductsSchema)
const purchproducts=new mongoose.model("purchproducts",PurchproductsSchema)
const billingaddress=new mongoose.model("billingaddress", AddressSchema)

module.exports= {collection,allinfo,cartproducts,purchproducts,billingaddress};