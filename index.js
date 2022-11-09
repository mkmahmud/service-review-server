const express = require('express');
const app = express();
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;
require('dotenv').config();

// Data
// const servicesData = require('./services-data.json');
// const { async } = require('@firebase/util');

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello ')
})



// Mongo DB connection

const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Password}@cluster0.cjesyyc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const servicesCollection = client.db('mk').collection('services');
    const reviewsCollections = client.db('mk').collection('reviews')

    try {

        // Get services data from monogdb collection 
        app.get('/services', async (req, res) => {
            const query = {};
            const coursor = servicesCollection.find(query);
            const servicesData = await coursor.toArray()
            res.send(servicesData)
        })

        // Get Services Home page 
        app.get('/serviceshomepage', async (req, res) => {
            const query = {}
            const coursor = servicesCollection.find(query)
            const serviceHomeData = await coursor.limit(3).toArray()
            res.send(serviceHomeData)
        })

        // Get Singel Data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const serviceOne = await servicesCollection.findOne(query)
            res.send(serviceOne)
        })


        //  Add Service Data 
        app.post('/addservices', async (req, res) => {
            const services = req.body;
            const result = await servicesCollection.insertOne(services)
            res.send(result)
        })


        // Get my Review

        app.get('/myreview', async (req, res) => {
            const userEmail = req.query.email;
            const query = { userEmail: userEmail }
            const getMyReviews = reviewsCollections.find(query);
            const myreviews = await getMyReviews.toArray()
            res.send(myreviews)
        });

        // Update My review Data
        app.patch('/myreview/:id', async (req, res) => {
            const id = req.params.id;
            const updateReview = req.body.updateReview;
            const query = {_id: ObjectId(id)}
            const updateDoc = {
                $set:{
                    message: updateReview
                }
            }
            const result = await reviewsCollections.updateOne(query, updateDoc)
            res.send(result)
        });


        // Delete My review Data

        app.delete('/myreview/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewsCollections.deleteOne(query)
            res.send(result)
        });

        // Get Review Data
        app.get('/reviewdata', async (req, res) => {
            const serviceId = req.query.id;
            const query = { serviceID: serviceId }
            const getReviews = reviewsCollections.find(query)
            const reviews = await getReviews.toArray();
            res.send(reviews)
        })

        // Add review 

        app.post('/addreview', async (req, res) => {
            const reviewData = req.body;
            const result = await reviewsCollections.insertOne(reviewData)
            res.send(result)
        })


    }
    catch {

    }
}


run().catch(err => console.log(err))



app.listen(port, () => {
    console.log(`Server is runing on port ${port}`)
})