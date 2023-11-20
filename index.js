const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.trhzw6v.mongodb.net/?retryWrites=true&w=majority`;

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

    const menuCollection = client.db("bistroyBossDB").collection("menu");
    const reviewCollection = client.db("bistroyBossDB").collection("reviews");
    const cartsCollection = client.db("bistroyBossDB").collection("carts");
    // const userCollection = client.db("bistroyBossDB").collection("users");

    // -------------------
    // Menu Collection
    // -------------------

    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result)
    })

    // -------------------
    // Reviews Collection
    // -------------------

    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result)
    })

    // -------------------
    // Carts Collection 
    // -------------------
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await cartsCollection.find(query).toArray()
      res.send(result);
    })
    app.post('/carts', async (req, res) => {
      const cartsitems = req.body;
      const result = await cartsCollection.insertOne(cartsitems);
      res.send(result);
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



app.get('/', (req, res) => {
  res.send('Bistro Boss Server is listening')
})

app.listen(port, () => {
  console.log(`Bistro Boss Server is listening on port ${port}`)
})