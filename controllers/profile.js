const handleProfileGet = (req, res, knex) => {
  const { id } = req.params;                 // because /profile/:id !!!
  knex.select('*').from('users').where({ id })
      .then(user => {
        if (user.length) { //checking if user is not empty array
          res.json(user[0]);
        } else {
          res.status(400).json('Not found')
        }
      })
      .catch(err => res.status(400).json('Error getting user'))
}

const handleProfileUpdate = (req, res, knex) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  knex('users')
    .where({ id })
    .update({ name })
    .then(response => {
      if (response) {
        res.json('Success')
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => res.status(400).json('Error updating user'))
}

module.exports = {
  handleProfileGet, //ES6
  handleProfileUpdate
}
