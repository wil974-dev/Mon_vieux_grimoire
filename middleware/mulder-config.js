const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res
                .status(400)
                .json({ error: 'Erreur lors du téléchargement de l’image.' });
        }

        if (!req.file) {
            return next();
        }

        const imageDir = path.join(__dirname, '../images');
        console.log(req.file.originalname);
        const originalName = req.file.originalname
            .split(' ')
            .join('_')
            .split('.')[0];
        console.log(originalName);
        const filename = `${originalName}_${Date.now()}.webp`;
        const outputPath = path.join(imageDir, filename);

        sharp(req.file.buffer)
            .webp({ quality: 50 })
            .toFile(outputPath)
            .then(() => {
                req.file.filename = filename;
                next();
            })
            .catch(() => {
                res.status(500).json({
                    error: 'Erreur lors de la compression de l’image.',
                });
            });
    });
};
