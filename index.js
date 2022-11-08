const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// Data
const servicesData = require('./services-data.json')

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello ')
})





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Password}@cluster0.cjesyyc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.get('/services', (req, res) => {
    res.send(servicesData)
})


app.listen(port, () => {
    console.log(`Server is runing on port ${port}`)
})