/* Importe le modèle sauce, exporté du document "sauce.js" */
const Sauce = require('../models/sauce');
/* Importe la librairie qui permet de gérer les "Files Systems" */
const fs = require('fs');

/* WARNING - A REMPLIR */
const parseJwt = require("../utils/parseJwt");


/***********
CRUD - Create Read Update Delete
*/


/* Create - Créer l'objet sauce dans la BDD */
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersdisLiked: [],
	});
	sauce.save()
	.then(() => res.status(201).json({ message: 'La sauce à bien été enregistrée !'}))
	.catch(error => res.status(400).json({ error }));
};


/* Read (one) - Lit 1 sauce de la BDD récupéré via l'ID via la fonction "findOne" de mongoose */
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
	.then((sauce) => {
		res.status(200).json(sauce);
	})
	.catch((error) => {
		res.status(404).json({ error });
	});
};


/* Read (all) - Lit toutes les sauces via la fonction "find" de mongoose */
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
	.then((sauces) => {
		res.status(200).json(sauces);
	})
	.catch((error) => {
		res.status(400).json({ error: error });
	});
};
		

/* Update - Met à jour une sauce, deux façon, selon si une image est modifié ou non */
exports.modifySauce = (req, res, next) => {

	const userId = req.body.userId;
	const jwtUserId = parseJwt(req.headers.authorization.split(" ")[1]).userId;
	if (userId == jwtUserId) {
		res.status(403).json({ message: `unauthorized request` })
		return null;
	}

	/* Si un image est modifiée, supprime l'image précédente trouvé via la fonction "findOne" (ID) et supprime l'image*/
	if (req.file) {
		Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// if (!sauce.imageUrl) {
				fs.unlinkSync(sauce.imageUrl.substring(22))
			// }
		});
	}
	
	/* Ternaire, si l'image est modifié, objet avec ajout de l'image et récupération des données, sinon objet avec récupération simple des données */
	const sauceObject = req.file ?
	{
		...JSON.parse(req.body.sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : { ...req.body };
	/* Update via "updateOne" pour actualisé la BDD de la sauce concernée */
	Sauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id } )
	.then(() => res.status(200).json({ message: 'Sauce modifié !'}))
	.catch(error => res.status(400).json({ error }));
};


/* Delete - Supprime l'objet sauce de la BDD et l'image sauvegardé*/
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
	.then((sauce) => {
		const filename = sauce.imageUrl.split('/images/')[1];
		/* On supprime l'image via "fs.unlink" et on utilise la fonction "deleteOne" de mongoose pour supprimer l'objet sauce concernée par l'ID */
		fs.unlink(`images/${filename}`, () => {
			Sauce.deleteOne({ _id: req.params.id })
			.then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
			.catch(error => res.status(400).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};


/*
CRUD - Create Read Update Delete
***********/



/***********
LIKE / DISLIKE
*/
exports.likeDislikeSauce = (req, res, next) => {
	const userId = req.body.userId;
	const sauceId = req.params.id;
	const like = req.body.like;
	const jwtUserId = parseJwt(req.headers.authorization.split(" ")[1]).userId;
	
	// Vérification de l'user ID correspond à celui connecté au token
	if (userId !== jwtUserId){
		res.status(403).json({ message: `utilisateur non autorisé` })
	}
	
	// Définit le statut de like (1, -1, 0, defaut)
	switch (like) {
		
		// Cas ou l'utilisateur change d'avis (il retire son like ou dislike), il clique sur un like ou dislike déjà actif
		case 0:
			Sauce.findOne({ _id: sauceId })
			.then((sauce) => {
				// Si l'user avait like, alors on le retire
				if (sauce.usersLiked.includes(userId)) {
					Sauce.updateOne(
						{ _id: sauceId },
						{
							// Décrémentation du like avec l'opérateur $inc
							$inc: { likes: -1 },
							// Suppression de l'user dans le tableau des dislike
							$pull: { usersLiked: userId }, 
						}
					)
					.then(() => { res.status(200).json({ message: `like supprimé` }); })
					.catch((error) => res.status(500).json({ error }));
				}
				// Si l'user avait dislike, alors on le retire
				if (sauce.usersDisliked.includes(userId)) {
					Sauce.updateOne(
						{ _id: sauceId },
						{
							// Décrémentation du dislike avec l'opérateur $inc
							$inc: { dislikes: -1 }, 
							// Suppression de l'user dans le tableau des like
							$pull: { usersDisliked: userId },
						}
					)
					.then(() =>res.status(200).json({ message: `dislike supprimé` }))
					.catch((error) => res.status(500).json({ error }));
				}
			})
			.catch((error) => res.status(500).json({ error }));
			break;
			
		// Cas ou l'utilisateur aime la sauce        
		case 1: 
			Sauce.updateOne(
				{ _id: sauceId },
				{
					// Incrémentation des likes avec l'opérateur $inc
					$inc: { likes: 1 },
					// Ajout de l'utilisateur qui a like au tableau
					$push: { usersLiked: userId }, 
				}
			)
			.then(() =>res.status(200).json({ message: `J'aime!` }))
			.catch((error) => res.status(500).json({ error }));
			break;
			
		// Cas ou l'utilisateur n'aime pas la sauce        
		case -1: 
			Sauce.updateOne(
				{ _id: sauceId },
				{
					// Invrémentation des dislikes avec l'opérateur $inc
					$inc: { dislikes: 1 }, 
					// Ajout de l'utilisateur qui a dislike au tableau 
					$push: { usersDisliked: userId }, 
				}
			)
			.then(() =>res.status(200).json({ message: `Je n'aime pas!` }))
			.catch((error) => res.status(500).json({ error }));
			break;
			
		default:
			return res.status(400).json({ message: "Bad request"});
	}
};
/*
LIKE / DISLIKE
***********/
