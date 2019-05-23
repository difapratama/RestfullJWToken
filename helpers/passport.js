'use strict'

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    });

    // LOGIN

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase();
            User.findOne({ 'local-email': email }, function (err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'no user found'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'wrong password'));
                else
                    return done(null, user);
            });
        }
    ));

    // SIGN UP / REGISTER

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            if (!req.user) {
                user.findOne({ 'local-.email': email }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user)
                        return done(null, false, req.flash('SignupMessage', 'email sudah di gunakan'));
                    else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                return done(err);
                            return done(null, newUser);
                        })
                    }
                })
            } else {
                return done(null, req.user);
            }
        }));
}