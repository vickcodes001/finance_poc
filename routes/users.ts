const express = require('express');
const router = express.Router();

// interface request {
//     req: string
// }

// get all users
router.get('/', (req, res) => {
  res.send('User List');
});

// create a user
router.post('/', (req, res) => {
  res.send('Create User');
});

function logger(req, res, next) {
    console.log(req.originalUrl);
    next()
}

// creating a dynamic url
router
    .route(":/id")
    .get((req, res) => {
        res.send(`Get user with the id ${req.params.id}`)
    })
    .put((req, res) => {
        res.send(`Update user with the id ${req.params.id}`)
    })
    .delete((req, res) => {
        res.send(`Delete user with the id ${req.params.id}`)
    })

    module.exports = router;
