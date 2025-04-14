const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookController');
const auth = require('../middleware/auth');
const multer = require('../middleware/mulder-config');

router.get('/', bookCtrl.getAllBook);

router.get('/bestrating', bookCtrl.bestRating);

router.get('/:id', bookCtrl.getOneBook);

router.post('/', auth, multer, bookCtrl.createBook);

router.put('/:id', auth, multer, bookCtrl.modifyBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

router.post('/:id/rating', auth, bookCtrl.rating);

module.exports = router;
