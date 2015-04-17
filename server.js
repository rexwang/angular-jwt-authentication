var express     = require('express');
var faker       = require('faker');
var cors        = require('cors');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var expressJwt  = require('express-jwt');

// This is used to encode a json object(token),
// the server sends this token to client when client
// authenticates, and then client sends the token back
// on every request. The server will decode the token
// using secret key to identify the authenticated client.
// Normally we need to store this token in some config file.
var jwtSecret = 'faskzxcjvjasdf/323fas/4uk';

var app = express();

var user = {
  username: 'Rex',
  password: 'p'
};

app.use(cors());
app.use(bodyParser.json());

// protect the endpoint with jwt, every request to our endpoints
// will check whether there is an authetication token in request
// header, except for login endpoint.
app.use(expressJwt({
  secret: jwtSecret
}).unless({
  path: ['/login']
}));

app.get('/random-user', function(req, res) {
  var user = faker.helpers.userCard();
  user.avatar = faker.image.avatar();
  res.json(user);
});

app.post('/login', authenticate, function(req, res) {
  // create a token if user exists
  var token = jwt.sign({
    username: user.username
  }, jwtSecret);

  res.send({
    token: token,
    user: user
  });
});

app.get('/me', function(req, res) {
  // with jwt, when an request comes in, jwt will decode the token
  // based on jwtSecret, if the signature is verified, it will add
  // 'user' to the request object
  res.send(req.user);
});

app.listen(3000, function() {
  console.log('App is listening on localhost:3000');
});

function authenticate(req, res, next) {
  var body = req.body;
  if (!body.username || !body.password) {
    res.status(400).end('Must provide username or password to login');
  }
  if (body.username !== user.username || body.password !== user.password) {
    res.status(401).end('Username or password incorrect');
  }
  next();
}
