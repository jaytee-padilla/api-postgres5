const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
  // Access User model and run .findAll() method
  User.findAll()
    .then(dbUserData => res.status(200).json(dbUserData))
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  User.findOne({
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
router.post('/', (req, res) => {});

// PUT /api/users/:id
router.put('/:id', (req, res) => {});

// DELETE /api/users/:id
router.put('/:id', (req, res) => {});

module.exports = router;