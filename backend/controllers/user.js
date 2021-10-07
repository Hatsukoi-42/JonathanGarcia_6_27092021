/* Importe la librairie "bcrypt" afin de hasher les mots de passes et de comparer les mots de passes encodés */
const bcrypt = require('bcrypt');

/* Importer la librairie "jsonwebtoken" pour utiliser les Tokens */
const jwt = require('jsonwebtoken');

/* Importe le modèle user, exporté du document "user.js" */
const User = require('../models/User');



/***********
SIGNUP - Fonction pour créer une utilisateurs dans la BDD
*/
exports.signup = (req, res, next) => {
    /* Hash le mot de passe avant de le stocker */
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        /* Sauve l'utilisateur dans la BDD, email et mot de passe (hashé avec Bcrypt)  */
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
/*
SIGNUP - Fonction pour créer une utilisateurs dans la BDD
***********/



/***********
LOGIN - Fonction pour se connecter en tant qu'utilisateur, si trouvé dans la BDD et si les logins sont valides
*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        /* Compare le mot de passe entré et celui de la BDD */
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
/*
LOGIN - Fonction pour se connecter en tant qu'utilisateur, si trouvé dans la BDD et si les logins sont valides
***********/