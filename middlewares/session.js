const session = require('express-session');

const sec = 1000
const hour = 60 * 60 * sec

const configureSession = (router) => {

    router.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: hour
        }
    }));
};

const loginRequired = (req, res, next) => {

    console.log(session.user)
    if (req.session.user) {
        next();
    } else {
        res.status(440).json({ result: '현재 로그인 상태가 아닙니다.' });
    }
};

module.exports = { configureSession, loginRequired };