const express = require('express');
const usersArr = require('./usersArr');

const usersRouter = express.Router();


usersRouter.get('/getAll', (req, res) => {
    res.send({usersArr: usersArr.filter((user) => {
        return user.id !== req.query.except; 
    })})
});

module.exports = usersRouter;