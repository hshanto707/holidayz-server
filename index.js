const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swoyo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("holidayz");
    const toursCollection = database.collection("tours");
    const cartCollection = database.collection("cart");

    // GET ALL TOUR INFO

    app.get("/tours", async (req, res) => {
      const cursor = toursCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    // GET SINGLE TOUR INFO

    app.get("/tours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await toursCollection.findOne(query);
      res.json(tour);
    });

    // ADD DATA TO CART

    app.post("/cart", async (req, res) => {
      const tour = req.body;
      const result = await cartCollection.insertOne(tour);
      res.json(result);
    });

    // GET CART DATA

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    // GET CART DATA BY USER

    // app.get("/cart/:uid", async (req, res) => {
    //   const uid = req.params.uid;
    //   const query = { uid: uid };
    //   console.log(query)
    //   const result = await cartCollection.find(query).toArray();
    //   res.json(result);
    // });

    // DELETE DATA FROM CART

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.json(result);
    });
  } 
  finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Is Running...");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
