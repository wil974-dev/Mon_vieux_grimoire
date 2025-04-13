const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage(); //Les fichiers ne sont pas stockés sur le disque mais en mémoire dans req.file.buffer
const upload = multer({ storage }).single('image'); //On attend un seul fichier, envoyé dans le champ de formulaire appelé 'image'

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        // On utilise la fonction upload de Multer pour extraire le fichier du formulaire.
        if (err) {
            return res
                .status(400) // On retourne une erreur 400 si le Multer a eu un problème.
                .json({ error: 'Erreur lors du téléchargement de l’image.' });
        }

        if (!req.file) {
            return next(); // Pas d’image envoyée donc on passe au middleware suivant
        }

        const imageDir = path.join(__dirname, '../images'); //Ici on stocke l'adresse du dossier image.
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
                // Si succès on ajoute filename dans req.file pour l'utiliser plus tard dans les routes.
                req.file.filename = filename;
                next(); //On passe au middleware suivant.
            })
            .catch((error) => {
                res.status(500) //Si sharp plante, on envoie une erreur 500
                    .json({
                        error: 'Erreur lors de la compression de l’image.',
                    });
            });
    });
};
