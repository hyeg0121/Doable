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
        'SELECT * FROM user',
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

router.get('/:user_no', (req, res) => {
    const user_no = req.params.user_no;

    pool.query(
        'SELECT * FROM user WHERE user_no = ?',
        [user_no],
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

router.get('/:user_no/groups', (req, res) => {
    const user_no = req.params.user_no;

    pool.query(
        `SELECT todo_group.*
        FROM membership
        INNER JOIN todo_group ON membership.group_no = todo_group.group_no
        WHERE membership.user_no = ?`,
        [user_no],
        (err, results) => {
            if (err) {
                console.error('검색 오류: ', err);
                res.status(500).json({message: '데이터를 찾을 수 없음'});
            }else {
                res.status(200).json(results);
            }
        });
});

router.get('/:user_no/categories', (req, res) => {
    const user_no = req.params.user_no;

    pool.query(
        `SELECT * FROM category WHERE user_no = ?`,
        [user_no],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).json({error: '유저의 카테고리를 조회하는데 실패했습니다.'})
            } else {
                res.status(200).json(results);
            }
        }
    )
});

router.get('/:user_no/todos', (req, res) => {
    const user_no = req.params.user_no;

    pool.query(
        `SELECT todo.*, category.* FROM todo 
        INNER JOIN category ON todo.category_no = category.category_no
        WHERE todo.user_no = ?
        ORDER BY todo.todo_completed`,
        [user_no],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).json({error: '유저의 투두를 조회하는데 실패했습니다.'})
            } else {
                const editedResult = results.map(result => {
                    return {
                        todo_no: result.todo_no,
                        todo_name: result.todo_name,
                        todo_completed: result.todo_completed,
                        category: {
                            category_no: result.category_no,
                            category_name: result.category_name,
                            category_color: result.category_color
                        }
                    }
                })
                res.status(200).json(editedResult);
            }
        }
    )
});


module.exports = router;
