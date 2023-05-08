const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://sakibsakib99880:P24tsbHsTl9CdRsf@cluster0.yk6uldw.mongodb.net/?retryWrites=true&w=majority";

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
        const database = client.db("usersDB");
        const userscollection = database.collection("users");
        app.get('/users', async (req, res) => {
            const cursor = userscollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userscollection.findOne(query);
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await userscollection.insertOne(user);
            res.send(result)
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body
            console.log(id, user);
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true }
            const updateuser = {
                $set: {
                    name: user.name,
                    email: user.email
                },
            };
            const result = await userscollection.updateOne(filter, updateuser, option);
            res.send(result)

        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) };
            const result = await userscollection.deleteOne(query);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finisH/erroR
        // await client.close();
    }
}
run().catch(console.log);










app.get('/', (req, res) => {
    res.send('simple curd is running')
})
// sakibsakib99880
// P24tsbHsTl9CdRsf

app.listen(port, () => {
    console.log(` curd API is running  on port : ${port}`)
})