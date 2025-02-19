module.exports.apiPort = 9090
module.exports.apiURL = 'http://auth:' + this.apiPort
module.exports.authRoute = route => this.apiURL + route

module.exports.secretKey = 'EngWeb2024Grupo40'