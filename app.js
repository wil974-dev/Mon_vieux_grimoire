const express = require('express');

const app = express();

app.use((req, res, next) => {
    res.status(201).json({ message: 'server OK !' });
});

module.exports = app;
