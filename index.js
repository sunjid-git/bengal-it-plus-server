const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Bengal It Plus!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqs6b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("test").collection("devices");

  console.log('connection err', err);
  const eventCollection = client.db("bengalPlus").collection("product");

  app.get('/events', (req,res) => {
    eventCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})

  app.post('/addEvent',(req,res)=>{
    const newEvent = req.body;
    console.log('adding new event: ',newEvent);
    eventCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

});


app.listen( process.env.PORT || port)