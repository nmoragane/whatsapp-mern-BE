import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import Messages from './dbMessages.js';


//app config
const app = express();
const port = process.env.PORT || 8080;

const pusher = new Pusher({
    appId: "1141798",
    key: "230c1ce486dfc6d1a094",
    secret: "0a4ec974cd29f33fba41",
    cluster: "ap2",
    useTLS: true
  });

//middleware
app.use(express.json())

app.use((req,res) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers", '*');
    next();
})

//DB config
const password = "M6v7D7LVhr5KvSOE";
const dbname = "whatsappDb";
const connectionUrl = `mongodb+srv://admin:${password}@cluster0.ukp1l.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.once('open', () => {
    console.log('db connected')
    
    const msgCollection = db.collection("messagecontent");
    const changeStream = msgCollection.watch();

    changeStream.on('change' , (change) => {
        console.log(change);

        if(change.operationType ==="insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messagse" , "inserted" , {
                name: messageDetails.user,
                message: messageDetails.message,
            });
        } else {console.log("Error trigering pusher")};
    })
})


//api routes
app.get("/", (req,res) => res.stauts(200).send("Hellow"));

app.get('/messages/sync', (req,res) => {
    Messages.find((err,data) => {
        if (err) {
            res.status(300).send(err);
        } else {
            res.send(200).send(data)
        }
    })
})

app.post('/messages/new', (req,res) => {
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