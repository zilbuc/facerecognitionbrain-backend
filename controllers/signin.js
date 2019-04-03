const jwt = require('jsonwebtoken');
const redis = require('redis');
const { JWT_SECRET } = require('constants');

// Redis setup:
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (knex, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return knex.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return knex.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('Unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized'); //@TODO - move res to signinAuthentication?
    }
    return res.json({id: reply})
  })
}

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, `${JWT_SECRET}`, { expiresIn: '2 days' });
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = user => {
  // Create JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token }
    })
    .catch(console.log)
}

const signinAuthentication = (knex, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) :
    handleSignin(knex, bcrypt, req, res)
      .then(data => {
        console.log(data);
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => {
        console.log(session);
        res.json(session)
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err)
      });
}

module.exports = {
  signinAuthentication,
  redisClient
};
