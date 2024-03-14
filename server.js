const express = require('express');
const cors = require('cors'); // Import the cors middleware
const bcrypt = require('bcrypt');
const {collection,allinfo,cartproducts,purchproducts} = require("./config");
const app = express();
const { helpcenterinfo } = require('./Helpcenterinfo');
const {All_info}=require('./All_info')
const path = require('path');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.get('/api', (req, res) =>
     res.json( helpcenterinfo )
);

app.get('/v1/query', (req, res) => {
    const { search } = req.query;
    let sortedquest = helpcenterinfo;

    if (search) {
        const searchWords = search.split(" ").filter(Boolean); 
        sortedquest = sortedquest.filter(question => {
            return searchWords.some(word => question.heading.toLowerCase().includes(word.toLowerCase()));
        });
    }

    res.status(200).json(sortedquest);
});

app.get("/v1/query/:id",(req,res)=>{
    const {id}=req.params
   const helpquest=helpcenterinfo.find(helpquest=>helpquest.id==id)
   if(!helpquest){
    return res.status(404).json({success:false,msg:'question not found'})
   }
   res.json(helpquest)
})

app.get('/v1/dresses/query', async (req, res) => {
    const { search } = req.query;
    try {
        let sortedinfo = [];

        if (search) {
            const searchWords = search.split(" ").filter(Boolean); 
            const regexArray = searchWords.map(word => `(?=.*\\b${word}\\b)`);
            const regex = new RegExp(regexArray.join("") + ".*", "i");
            sortedinfo = await allinfo.find({ title: { $regex: regex } });
        } else {
            sortedinfo = await allinfo.find();
        }

        res.status(200).json(sortedinfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/v1/dresses/random', async (req, res) => {
    const { search } = req.query;
    try {
        let pipeline = [];
        if (search) {
            const searchWords = search.split(" ").filter(Boolean);
            const regexArray = searchWords.map(word => `(?=.*\\b${word}\\b)`);
            const regex = new RegExp(regexArray.join("") + ".*", "i");
            pipeline.push({ $match: { title: { $regex: regex } } });
        }
        pipeline.push({ $sample: { size: 30 } });
        const sortedinfo = await allinfo.aggregate(pipeline);

        res.status(200).json(sortedinfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/v1/dresses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const searchpro = await allinfo.findOne({ id: id });
        if (searchpro) {
            res.status(200).json(searchpro);
        } else {
            res.status(404).json({ message: 'Dress not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post("/login", async(req,res)=>{
    try{
        const { name, password } = req.body;
        const user = await collection.findOne({ name });

        if(!user){
            return res.status(404).send("User not found");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(isPasswordMatch){
            res.status(200).redirect('/');
        }
        else{
            res.status(401).send("Wrong password");
        }
    } catch(error) {
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error. Please try again later.");
    }
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        mno: req.body.mno,
        password: req.body.password
    }

    try {
        const existingUser = await collection.findOne({
            $or: [
                { name: data.name },
                { email: data.email },
                { mno: data.mno }
            ]
        });

        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(409).redirect('/urexist');
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashedPassword;
            await collection.insertMany(data);
            console.log("User registered successfully:", data);
            return res.status(200).redirect('/successful'); 
        }
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send("Internal server error. Please try again later.");
    }
});


app.post("/addingtocart/:id", async (req, res) => {
    const { id } = req.params;

    const data = {
        id: id, 
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        brand: req.body.brand,
        title: req.body.title,
        color: req.body.color,
        discountedPrice: req.body.discountedPrice,
        price: req.body.price,
        discountPersent: req.body.discountPersent,
        size: req.body.size,
        quantity: req.body.quantity,
        topLavelCategory: req.body.topLavelCategory,
        secondLavelCategory: req.body.secondLavelCategory,
        thirdLavelCategory: req.body.thirdLavelCategory,
        description: req.body.description
    };

    try {
        await cartproducts.insertMany(data);

        console.log("Product added to cart:", data);
        res.status(200).redirect('/cart');
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).send("Internal server error. Please try again later.");
    }
});

app.get('/v1/cart/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const searchpro = await cartproducts.find({ name: name });
        if (searchpro.length > 0) {
            res.status(200).json(searchpro);
        } else {
            res.status(404).json({ message: 'No items found in the cart for this user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.delete("/cart/:id/:name", async (req, res) => {
    const itemId = req.params.id;
    const name=req.params.name;
    try {
        const deletedItem = await cartproducts.findOneAndDelete({ id: itemId, name: name });
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});

app.post("/addingtopurch/:id", async (req, res) => {
    const { id } = req.params;

    const data = {
        id: id, 
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        brand: req.body.brand,
        title: req.body.title,
        color: req.body.color,
        discountedPrice: req.body.discountedPrice,
        price: req.body.price,
        discountPersent: req.body.discountPersent,
        size: req.body.size,
        quantity: req.body.quantity,
        topLavelCategory: req.body.topLavelCategory,
        secondLavelCategory: req.body.secondLavelCategory,
        thirdLavelCategory: req.body.thirdLavelCategory,
        description: req.body.description
    };

    try {
        await purchproducts.insertMany(data);

        console.log("Product added to cart:", data);
        res.status(200).redirect('/purchased');
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).send("Internal server error. Please try again later.");
    }
});
app.get('/v1/purch/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const searchpro = await purchproducts.find({ name: name });
        if (searchpro.length > 0) {
            res.status(200).json(searchpro);
        } else {
            res.status(404).json({ message: 'No items found in the cart for this user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen('3005', () => console.log("successfully logged to 3005"));
