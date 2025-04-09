const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoute');

mongoose
    .connect(
        'mongodb+srv://liou:WP5aq3@cluster0.xfsqd9y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

module.exports = app;
