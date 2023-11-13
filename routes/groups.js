const express = require('express');
const pool = require('../db/db');
const bodyParser = require('body-parser');
const corsMiddleware = require('../middlewares/cors');
const session = require('../middlewares/session');
const router = express.Router();

router.use(bodyParser.json());
router.use(corsMiddleware);
session.configureSession(router);

// post
router.post('/', (req, res) => {
    const params = [
        req.body.group_name,
        req.body.group_desc,
        req.body.group_search,
        req.body.group_todo,
        req.body.creator_no,
        req.body.group_unit,
    ];
    pool.query(
        `INSERT INTO todo_group (group_name, group_desc, group_search, group_todo, creator_no, group_unit)
        VALUES (?, ?, ?, ?, ?, ?)`,
        params,
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(400).json({error: '그룹을 추가할 수 없습니다.'});
            } else {
                pool.query(
                    `INSERT INTO membership (user_no, group_no, created_at) VALUES (? ,?, now())`,
                    [params[4], result.insertId],
                    (err, result) => {
                        if (err) {
                            console.error('멤버 추가 오류:', err);
                            res.status(400).json({error: '멤버 추가 오류'});
                        } else {
                            console.log('멤버 추가 성공');
                            res.status(201).json({message: '그룹이 성공적으로 추가되었습니다.'});
                        }
                    }
                )
            }
        }
    )
});

router.get('/', (req, res) => {
    pool.query(
        `SELECT * FROM todo_group`,
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json(err);
            } else if (results.length === 0) {
                res.status(404).json({message: '데이터가 존재하지 않습니다.'});
            } else {
                res.status(400).json(results);
            }
        }
    );
});

router.get('/:group_no', (req, res) => {
    const group_no = req.params.group_no;

    pool.query(
        `SELECT * FROM todo_group WHERE group_no = ?`,
        [group_no],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json(err);
            } else if (results.length === 0) {
                res.status(404).json({message: '데이터가 존재하지 않습니다.'})
            } else {
                res.status(200).json(results[0]);
            }
        }
    )
});

module.exports = router;
