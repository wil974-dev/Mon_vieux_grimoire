const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();

const upload = multer({ storage }).single('image');

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Echec du téléchargement' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier fourni.' });
        }

        const name = req.file.originalname.split(' ').join('_');
        const extension = 'webp';
        const nameImage = name + Date.now() + '.' + extension;

        const imageFolder = path.join(__dirname, '..', 'images');
        const imagePath = path.join(imageFolder, nameImage);

        console.log({ name, nameImage, imageFolder, imagePath, __dirname });

        sharp(req.file.buffer)
            .webp({ quality: 20 })
            .toFile(imagePath)
            .then(() => {
                req.optimizedImage = {
                    filename: nameImage,
                    path: imagePath,
                };
                next();
            })
            .catch((error) => {
                res.status(500).json({ error: error });
            });
    });
};
