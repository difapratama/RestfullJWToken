var express = require('express');
var router = express.Router();
const userController = require('../controller/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('main');
});

router.post('/', userController.authenticate);

router.get('/register', function(req, res, next) {
    res.render('register');
});

router.post('/register', userController.create);

router.get('/forgotpassword', function(req, res, next) {
    res.render('forgotpassword');
});

module.exports = router;