const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauces'); //ec
const userRoutes = require('./routes/user');

/***********
MongoDB - Connect
*/
mongoose.connect('mongodb+srv://user1:mdp@cluster0.zp8iu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
/*
MongoDB - Connect
***********/


/***********
    CORE
*/
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
/*
    CORE
***********/

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); //ec
app.use('/api/sauces', saucesRoutes); //ec
app.use('/api/auth', userRoutes);

module.exports = app;