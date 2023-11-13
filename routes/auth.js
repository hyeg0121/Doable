const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const bodyParser = require('body-parser');
const corsMiddleware = require('../middlewares/cors');
const bcrypt = require('bcrypt')
const session = require('../middlewares/session');

const SALT_ROUNDS = 10;

router.use(bodyParser.json())
router.use(corsMiddleware);
session.configureSession(router);

router.post('/login', (req, res) => {
    const {user_id, user_pw} = req.body
    pool.query(
        'SELECT * FROM user WHERE user_id = ?',
        [user_id],
        function (err, rows, fields) {
            if (rows.length === 0) {
                res.status(404).json({result: '로그인 실패 (사용자 없음)'})
            } else {
                const user = rows[0]
                bcrypt.compare(user_pw, rows[0].user_pw, function (err, result) {
                    if (result) {
                        req.session.user = {
                            user_email: user.user_email,
                            user_id: user.user_id
                        }
                        req.session.save()
                        console.log(req.session)
                        console.log(req.session.user)
                        res.json({result: rows[0].user_no})
                    } else {
                        res.status(401).json({result: '로그인 실패 (비밀번호 불일치)'})
                    }
                })
            }
        })
})

router.post('/join', (req, res) => {
    bcrypt.hash(req.body.user_pw, SALT_ROUNDS, function (err, hash) {
        pool.query('INSERT INTO user(user_name, user_id, user_pw, user_email) VALUES(?, ?, ?, ?)',
            [req.body.user_name, req.body.user_id, hash, req.body.user_email],
            function (err, rows, fields) {
                if (err) {
                    res.json({result: err})
                } else {
                    res.json({result: 'ok'})
                }
            })
    })
})


module.exports = router;