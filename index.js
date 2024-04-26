const express = require('express')
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express()

// middlewares 
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@databases1.utppk3d.mongodb.net/?retryWrites=true&w=majority&appName=databases1`;

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

    const craftsCollection = client.db('Art_and_craft_store').collection('arts&crafts')
    
    app.get('/allcrafts',async(req,res)=>{
          const allItems = await craftsCollection.find().toArray()
          res.send(allItems)
    })

    app.get('/craftitem/:id',async(req,res)=>{
          const {id} = req.params
          const objId = new ObjectId(id)
          const craftItem = await craftsCollection.findOne(objId)
          res.send(craftItem)
    })

    app.get('/mycrafts/:userId/:customized',async(req,res)=>{
        const {userId,customized} = req.params

        if(customized==='customized-yes'){
          const myCrafts = await craftsCollection.aggregate([{$match: {userId, customization:'Yes'}}]).toArray()
          res.send(myCrafts)
        }
        if(customized === 'customized-no'){
          const myCrafts = await craftsCollection.aggregate([{$match: {userId, customization:'No'}}]).toArray()
          res.send(myCrafts)
        }
        if(customized === 'all'){
          const myCrafts = await craftsCollection.aggregate([{$match: {userId}}]).toArray()
          res.send(myCrafts)
        }
       
       
    })

    app.post('/crafts',async(req,res)=>{
          const craftData = req.body
          const addItem = await craftsCollection.insertOne(craftData)
          res.send(addItem)
    })

    app.put('/crafts',async(req,res)=>{
          const {formData,id} = req.body
          const objId = new ObjectId(id)
          const options = {uprest:true}
          const craftItem = {
             $set:{
             image: formData.image,
             itemName: formData.itemName,
             subcategoryName: formData.subcategoryName,
             shortDescription: formData.shortDescription,
             price: formData.price,
             rating: formData.rating,
             customization: formData.customization,
             processingTime: formData.processingTime,
             stockStatus: formData.stockStatus,
             }
          }
          const addItem = await craftsCollection.updateOne({_id:objId},craftItem,options)
          res.send(addItem)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

