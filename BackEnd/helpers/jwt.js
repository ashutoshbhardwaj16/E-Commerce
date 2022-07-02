const {expressjwt} = require('express-jwt');


function authJwt(){
    const secret = 'secret this should be unique '
    return expressjwt({ 
        secret, 
        algorithms: ["HS256"] ,
        isRevoked: isRevoked
}).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods : ['GET', 'OPTIONS']},
            { url: /\/api\/v1\/categories(.*)/, methods : ['GET', 'OPTIONS']},
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    }) 
}

async function isRevoked(req, payload, done){
    if (!payload.isAdmin){
        done(null, true)
    }

    done();
}

module.exports = authJwt;

//  /\/api\/v1\/products(.*)/  === regular expression for /api/v1/procucts/anything..

 // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmJmZjJmOTFjY2Y5YTg3ZjA4ODgxZDEiLCJpYXQiOjE2NTY3NjcwMDcsImV4cCI6MTY1Njg1MzQwN30.5BE6XO5ZwN6N_HZbSsoQ8fNSE0BKq5sck4CANDCpQ7s"
