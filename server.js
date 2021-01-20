import express from 'express';
import mongoose from 'mongoose';
import Messages from '/dbMessages.js';


//app config
const app = express();
const port = process.env.PORT || 8080;

//middleware

//DB config
const password = "M6v7D7LVhr5KvSOE";
const dbname = "whatsappDb";
const connectionUrl = `mongodb+srv://admin:${password}@cluster0.ukp1l.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//api routes
app.get("/", (req,res) => res.stauts(200).send("Hellow"));

app.post('/api/v1/messages/new', (req,res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

//listener
app.listen(port, ()=> console.log(`Listening from ${port}`))