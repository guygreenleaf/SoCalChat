const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const cookieToken = req.cookies.token

  if (token == null && cookieToken == null) return res.sendStatus(401)

  if(token != null){
  jwt.verify(token, process.env.jwtSecret, (err, user) => {

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}
else if (cookieToken != null){
    jwt.verify(cookieToken, process.env.jwtSecret, (err, user) => {
    
        if (err) return res.sendStatus(403)
    
        req.user = user
    
        next()
      })
}
};


module.exports = {
    authenticateToken
}