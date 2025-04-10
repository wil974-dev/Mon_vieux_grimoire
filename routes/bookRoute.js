const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookController');
const auth = require('../middleware/auth');

router.get('/', bookCtrl.getAllBook);

router.get('/:id', bookCtrl.getOneBook);

router.get('/bestrating', bookCtrl.bestRating);

router.post('/', auth, bookCtrl.createBook);

router.put('/:id', auth, bookCtrl.modifyBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

router.post('/:id/rating', auth, bookCtrl.rating);

module.exports = router;
