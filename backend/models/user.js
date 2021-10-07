/* Importe "Mongoose" - Pour un modèle/schéma fortement typé */
const mongoose = require('mongoose');

/* Importe "Mongoose unique validator" - Pour vérifier qu'on ne duplique pas deux fois la même adresse email / utilisateur */
const uniqueValidator = require('mongoose-unique-validator');

/* Le schéma de l'user */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/* Ajoute le vérificateur d'email unique au shéma */
userSchema.plugin(uniqueValidator);

/* Export - Le modèle user précédement mis dans mangoose, enregistré ici sous le nom de "User" dans la base de donnée (au pluriel dans la database) */
module.exports = mongoose.model('User', userSchema);