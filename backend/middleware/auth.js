/* Permet l'échange sécurisé de jetons entre plusieurs parties. Cette sécurité de l’échange se traduit par la vérification de l'intégrité et de l'authenticité des données. Elle s’effectue par l'algorithme HMAC ou RSA. */
const jwt = require('jsonwebtoken');

/* Middleware - Vérifier l'authentification */
module.exports = (req, res, next) => {
    try {
        /* On va chercher dans la requête, la partie header, puis la partie authorization, la slip via les espaces et prendre la seconde string */
        const token = req.headers.authorization.split(' ')[1];
        /* Décode le token à l'aide de la clé secrète (ici une string obvious). On récupère un objet JSON */
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        /* On va chercher l'userId dans l'objet JSON, throw si l'identification n'est pas bonne, et next si elle est valide */
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};