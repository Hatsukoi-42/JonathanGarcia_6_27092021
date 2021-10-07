/* Importe "Mongoose" - Pour un modèle/schéma fortement typé */
const mongoose = require('mongoose');


/* Le schéma de la sauce  */
const sauceSchema = mongoose.Schema({

    userId: { type: String, required: true },
    name: { type: String, required: true }, //tc
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: false },
    usersDisliked:{ type: [String], required: false }
    
});

/* TO ADD - A ajouter dans le schéma supérieur lorsqu'on ajoutera la partie like/dislike */
// likes: { type: Number, required: true },
// dislikes: { type: Number, required: true },
// usersLiked: { type: [String], required: false },
// usersDisliked:{ type: [String], required: false }


/* Export - Le modèle de sauce précédement mis dans mangoose, enregistré ici sous le nom de "Sauce" dans la base de donnée (au pluriel dans la database) */
module.exports = mongoose.model('Sauce', sauceSchema);