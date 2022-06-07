require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const open = require('open')
const app = express();
const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE_URI
const port = process.env.PORT || 3000;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mongoose.connect(uri, (err) => { if (err) throw err })
const db = mongoose.connection

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    // res.sendFile(__dirname + '/views/index.html')
    let arrUser = ['fuck', 'shit', 'what the fuck', 'the hell']
    
    res.render('index', { arrUser })
})

app.post('/sign_up', function (req, res) {
    let email = req.body.emailSignup
    let fullname = req.body.fullnameSignup
    let password = req.body.passwordSignup
    let retype = req.body.retypeSignup
    let alert = ""
    let data =
    {
        "email": email,
        "fullname": fullname,
        "password": password
    }
    if (password === retype) {
        db.collection('users').insertOne(data, function (err, collection) {
            if (err) throw err
            console.log(`Successfully signup with email: ${email}`);
        })
    }
})

// mongoMain()
app.listen(port, () => {
    console.log('Node is listening on port ' + port + '...');
    console.log(process.env.SECRET_API);
    console.log('Opening browser...');
    open('http://localhost:3000/', { app: 'chrome' })
})


