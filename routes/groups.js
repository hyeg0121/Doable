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
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(400).json({ error: '그룹을 추가할 수 없습니다.' });
            } else {
                res.status(201).json({ message: '그룹이 성공적으로 추가되었습니다.'});
            }
        }
    )
});

module.exports = router;
