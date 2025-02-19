module.exports.apiPort = '3000';
module.exports.apiURL = `http://api:${module.exports.apiPort}`;
module.exports.apiRoute = function(route) {
    return this.apiURL + route;
}
