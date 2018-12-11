const handleRegister = (req, res, knex, bcrypt) => {
  const { email, name, password } = req.body;
  // checking if submitted form is not empty
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  // Asynchronous method:
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   console.log(hash);
  // });
  // Synchronous method:
  const hash = bcrypt.hashSync(password);
  //Insert data into users and login table with transaction
  knex.transaction(trx => {
      trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};
