const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/login', userController.logIn);

// ENDPOINT PROTETTI

router.get('/activities/:id', isAuth, userController.getActivities);

router.post('/activities/:id', isAuth, userController.postActivities);

router.patch('/activities/:id/:activityId', isAuth, userController.editActivity);

router.delete('/activities/:id/:activityId', isAuth, userController.deleteActivity);

module.exports = router;