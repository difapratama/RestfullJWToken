const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    create: function (req, res, next) {
        userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        },
            function (err, result) {
                // console.log('kampangggg', result);

                if (err)
                    next(err)
                else
                    // res.json({ status: "success", message: "user addedd successfully!!", data: null })
                    res.redirect('/dashboard');
            })
    },
    authenticate: function (req, res, next) {
        userModel.findOne({
            email: req.body.email
        },
            function (err, userInfo) {
                console.log('user info gus', userInfo);

                if (err) {
                    next(err);
                } else {
                    if (bcrypt.compareSync(
                        req.body.password,
                        userInfo.password
                    )) {
                        const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });

                        // res.json({
                        //     status: "success",
                        //     message: "user found!!!",
                        //     data: {
                        //         user: userInfo,
                        //         token: token
                        //     }
                        // });
                        res.redirect('/dashboard');
                    } else {
                        // res.json({
                        //     status: "error",
                        //     message: "invalid email/password!!!",
                        //     data: null
                        // })
                        res.redirect('/');
                    }
                }
            })
    }
}