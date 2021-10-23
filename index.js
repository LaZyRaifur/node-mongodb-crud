const express = require("express");
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const password = "e2OWK7FeuEJhiwgF";
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://dbUser:e2OWK7FeuEJhiwgF@cluster0.jrqdf.mongodb.net/dbUser?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// const { MongoClient } = require('mongodb');
client.connect((err) => {
  const productCollection = client.db("dbUser").collection("products");

  app.get('/products',(req,res)=>{
    productCollection.find({})
    .toArray((err, document)=>{
      res.send(document);
    })
  })


  app.get('/product/:id', (req,res)=>{
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0]); 
    })
  })

  app.post("/addProduct", (req, res) => {
   const product = req.body;
   productCollection.insertOne(product)
   .then(result =>{
     console.log('data added successfully');
    //  res.send('success');
    res.redirect('/');
   })

  })


  app.patch('/update/:id', (req,res)=>{
    console.log(req.body.price);
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set:{price: req.body.price, quantity: req.body.quantity}
    }
    )
    .then(result =>{
      res.send(result.modifiedCount > 0)
    })
  })
  app.delete('/delete/:id',(req,res)=>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result)=>{
      res.send(result.deletedCount > 0);
    })
  })
  // perform actions on the collection object
  console.log("database connected");
});

// // const { MongoClient } = require('mongodb');
// client.connect(err => {
//   const collection = client.db("dbUser").collection("products");
//   // perform actions on the collection object
//   const product ={name: "Modhu", price: 35, quantity: 20};
//   collection.insertOne(product)
//   .then(result =>{
//     console.log('one product added');
//   })

//   console.log('database connected');

// client.close();

app.listen(3000);
