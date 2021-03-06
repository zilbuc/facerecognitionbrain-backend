const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const morgan = require('morgan');
const knex = require('knex')({
  client: 'pg',
  // connection: {
  //   // connectionString: process.env.DATABASE_URL,
  //   // ssl: true
  //   // For localhost:
  //   // host: '127.0.0.1',
  //   // user: 'postgres',
  //   // password: DB_PASSWD,
  //   // database: 'skulldb'
  // }
  // For DOCKER:
  connection: process.env.POSTGRES_URI
});

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

/* First demo
const database = {
  users: [{
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'salle@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('success');
  } else {
    res.status(400).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const {
    email,
    name,
    password
  } = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
  const {
    id
  } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('not found');
  }
})

app.put('/image', (req, res) => {
  const {
    id
  } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('not found');
  }
})
*/

// app.get('/', (req, res) => {
//   res.send(database.users); // demo check
// })

app.get('/', (req, res) => {
  res.send(`it's alive, it's ALIVE!!! - weeeeee`)}
)

app.post('/signin', signin.signinAuthentication(knex, bcrypt)) // Signin and register have different syntax of passing function arguments

app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) }) //dependency injection

app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, knex) });
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, knex) });
app.put('/image', auth.requireAuth, (req, res) => { image.handleImagePut(req, res, knex) });
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) });

// process.env.PORT - for heroku
app.listen(process.env.PORT || 3000, () => {
  if (process.env.PORT) {
    console.log(`app is running on port ${process.env.PORT}`);
  } else {
    console.log(`app is running on port 3000`);
  }
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user/count

*/
