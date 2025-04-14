const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    });
    book.save()
        .then(() => {
            res.status(201).json({ message: 'Objet enregistré !' });
        })
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};

exports.modifyBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            let bookObject;

            if (req.file) {
                // Supprimer l'ancienne image
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) {
                        console.error(
                            "Erreur lors de la suppression de l'image :",
                            err
                        );
                    } else {
                        console.log('Ancienne image supprimée');
                    }
                });

                bookObject = {
                    ...JSON.parse(req.body.book),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${
                        req.file.filename
                    }`,
                };
            } else {
                bookObject = { ...req.body };
            }

            delete bookObject._userId;

            Book.updateOne(
                { _id: req.params.id },
                { ...bookObject, _id: req.params.id }
            )
                .then(() =>
                    res.status(200).json({ message: 'Objet modifié !' })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Not aurhorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'Objet supprimé !',
                            });
                        })
                        .catch((error) => {
                            res.status(401).json({ error: error });
                        });
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error: error }));
};

exports.getAllBook = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error: error }));
};

exports.bestRating = (req, res, next) => {
    Book.find()
        .then((books) => {
            const top3BestRating = books
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3);
            res.status(200).json(top3BestRating);
        })
        .catch((error) => res.status(400).json({ error: error }));
};

exports.rating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            const noted = book.ratings.find(
                (rating) => rating.userId === req.auth.userId
            );

            if (noted) {
                return res
                    .status(400)
                    .json({ message: 'Vous avez déjà noté ce livre.' });
            }

            let ratingTotal = 0;
            let nbrRating = 0;
            book.ratings.map((rating) => {
                ratingTotal += rating;
                nbrRating++;
            });
            ratingTotal = ratingTotal / nbrRating;
            book.ratings.push({
                userId: req.auth.userId,
                grade: req.body.rating,
                averageRating: ratingTotal,
            });
            book.save()
                .then((book) => res.status(201).json(book))
                .catch((error) => res.status(500).json({ error: error }));
        })
        .catch((error) => res.status(500).json({ error: error }));
};
