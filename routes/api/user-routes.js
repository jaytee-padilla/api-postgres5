const router = require('express').Router();
const { User } = require('../../models');

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

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  // expects data modeled like --> {username: 'exampleUser', email: 'exampleUser@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, can just use `req.body` instead
  User.update(req.body, {
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