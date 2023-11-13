const express = require('express');
const pool = require('../db/db');
const bodyParser = require('body-parser');
const corsMiddleware = require('../middlewares/cors');
const session = require('../middlewares/session');
const router = express.Router();

router.use(bodyParser.json());
router.use(corsMiddleware);
session.configureSession(router);

router.post('/', (req, res) => {
    const params = [
        req.body.user_no,
        req.body.category_no,
        req.body.todo_name
    ];

    pool.query(
        `INSERT INTO todo (user_no, category_no, todo_name, todo_completed) 
        VALUES (?, ?, ?, 0)`,
        params,
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json({error: '투두 추가가 실패했습니다.'});
            } else {
                res.status(201).json({message: '투두가 성공적으로 추가되었습니다.'});
            }

        }
    )
});

router.get('/', (req, res) => {
    pool.query(
        'SELECT * FROM todo',
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

router.get('/:todo_no', (req, res) => {
    const todo_no = req.params.todo_no;

    pool.query(
        'SELECT * FROM todo WHERE todo_no = ? ',
        [todo_no],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json(err);
            } else if (results.length === 0) {
                res.status(404).json({message: '데이터가 존재하지 않습니다.'})
            } else {
                res.status(400).json(results[0]);
            }
        }
    )
});


module.exports = router;
