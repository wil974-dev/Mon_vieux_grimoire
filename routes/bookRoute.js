const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookController');

router.post('/api/auth/signup', bookCtrl.signup);

router.post('/api/auth/login', bookCtrl.login);

router.get('/', bookCtrl.getAllBook);

router.get('/:id', bookCtrl.getOneBook);

router.get('/bestrating', bookCtrl.bestRating);

router.post('/', bookCtrl.createBook);

router.put('/:id', bookCtrl.modifyBook);

router.delete('/:id', bookCtrl.deleteBook);

router.post('/:id/rating', bookCtrl.rating);

module.exports = router;
