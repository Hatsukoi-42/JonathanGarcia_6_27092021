/* Décode une chaîne de données qui a été codée en utilisant le codage en base 64 */
const atob = require('atob');

/* Fonction prise sur StackOverflow pour decode un Token Jwt sans utiliser de librairie */
module.exports = function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};