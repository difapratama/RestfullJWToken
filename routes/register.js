var express = require('express');
var router = express.Router();
const userController = require('../controller/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('register');
});

router.post('/', userController.create);
router.post('/authenticate', userController.authenticate);

module.exports = router;