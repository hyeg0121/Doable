const express = require('express');
const pool = require('../db/db');
const bodyParser = require('body-parser');
const corsMiddleware = require('../middlewares/cors');
const session = require('../middlewares/session');
const router = express.Router();

router.use(bodyParser.json());
router.use(corsMiddleware);
session.configureSession(router);

router.get('/', (req, res) => {
    pool.query(
        'SELECT * FROM category',
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json(err);
            } else if (results.length === 0) {
                res.status(404).json({message: '데이터가 존재하지 않습니다.'})
            } else {
                res.status(400).json(results);
            }
        }
    )
});

router.get('/:category_no', (req, res) => {
   const categoruyNo = req.params.category_no;
   pool.query(
       `SELECT * FROM category WHERE category_no = ?`,
       [categoruyNo],
       (err, results) => {
           if (err) res.status(400).json({error: '카테고리 조회에 실패하였습니다.'});
           else if (results.length === 0) res.status(404).json({error: '카테고리가 존재하지 않습니다.'});
           else res.status(200).json(results[0]);
       }
   )
});

router.post('/', (req, res) => {
    const params = [
        req.body.user_no,
        req.body.category_name,
        req.body.category_color
    ];

    pool.query(
        `INSERT INTO category (user_no, category_name, category_color) VALUES (?, ?, ?)`,
        params,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).json({error: '카테고리 추가하는데 실패했습니다.'});
            } else {
                res.status(201).json({message: '카테고리가 성공적으로 추가되었습니다.'})
            }
        }
    );

});


module.exports = router;
