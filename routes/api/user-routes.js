const router = require('express').Router();
const { User } = require('../../models');
const { bulkCreate } = require('../../models/User');
const bcrypt = require('bcrypt');

// GET /api/users
router.get('/', (req, res) => {
  // Access User model and run .findAll() method
  User.findAll({
    attributes: {
      exclude: ['password']
    }
  })
    .then(dbUserData => res.status(200).json(dbUserData))
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: {
      exclude: ['password']
    },
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({message: 'No user found with this id'});
        return;
      }

      res.status(200).json(dbUserData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
  // expects data modeled like --> {username: 'exampleUser', email: 'exampleUser@gmail.com', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => {
      res.status(201).json(dbUserData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// POST /api/users/login
// there is a reason why a POST method is the standard for the login that's in process
// A GET method carries the request parameter appended in the URL string, whereas a POST method carries the request parameter in req.body, which makes it a more secure way of transferring data from the client to the server. The password is still in plain text, which makes this transmission process a vulnerable link in the chain
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({message: 'No user with that email address found'});
        return;
      }

      // verify user password
      // every instance of the User class has a .checkPassword() method that returns a promise
      // that promise will either be true or false
      const validPassword = dbUserData.checkPassword(req.body.password);
      
      // calling .then() on the validPassword promise allows the promise to be resolved asynchronously (aka, properly process the value stored in the promise)
      validPassword.then(function(result) {
        if (!result) {
          res.status(400).json({message: 'Incorrect Password'});
          return;
        }

        res.status(200).json({user: dbUserData, message: 'You are now logged in'});
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  // expects data modeled like --> {username: 'exampleUser', email: 'exampleUser@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, can just use `req.body` instead
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({message: 'No user found with this id'});
        return;
      }

      res.status(200).json(dbUserData);
    })
    .catch(err => {
      console.error(err);
      json.status(500).json(err);
    });
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({message: 'No user found with this id'});
        return;
      }

      res.status(200).json(dbUserData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

module.exports = router;