const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT  || 5000;

// midelware
app.use(cors());
app.use(express.json());


// mondodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clf7ui5.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // Connect to the "insertDB" database and access its "haiku" collection
    const database = client.db("teaDB");
    const teaCollection = database.collection("tea");
    const userCollection = database.collection("user");
    // post create
    app.post("/tea", async(req, res)=>{
      const newTea = req.body;
      console.log(newTea);
      const result = await teaCollection.insertOne(newTea);
      res.send(result);
      console.log(result);
    })

    // get read
    app.get("/tea", async(req, res)=> {
      const cursor = teaCollection.find();
      const result = await cursor.toArray();
      res.send(result)
      console.log(result);
    })
    // delete 
    app.delete("/tea/:id", async(req, res)=> {
      // console.log(id);
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await teaCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    })
    // second get 
    app.get("/tea/:id", async(req, res)=>{
      const id = req.params.id;
      console.log(id);
      const query =  {_id: new ObjectId(id)}
      const result = await teaCollection.findOne(query);
      res.send(result)
      console.log(result);
    })
    //const updatedTea = {_id, name, chef, taste, supplier, category, details, photo}
    app.put("/tea/:id", async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedTea = req.body;
      const tea = {
        $set:{
          name:updatedTea.name,
          chef:updatedTea.chef,
          taste:updatedTea.taste,
          supplier:updatedTea.supplier,
          category:updatedTea.category,
          details:updatedTea.details,
          photo:updatedTea.photo,
        }
      }
      const result =await teaCollection.updateOne(filter, tea, options);
      res.send(result)
    })

    // user api post
    app.post("/user", async(req, res)=> {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log(result);
    })
    // user api get
    app.get("/user", async(req, res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
      console.log(result);
    })
    // user api delete
    app.delete("/user/:id", async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res)=> {
  res.send("Running tea store............")
});


app.listen(port, ()=> {
  console.log(`tea store running port: ${port}`);
})


