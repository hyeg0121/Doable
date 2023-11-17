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

router.post('/daily', (req, res) => {
    const params1 = [
        req.body.user_no,
        req.body.category_no,
        req.body.todo_name
    ];

    pool.query(
        `INSERT INTO todo (user_no, category_no, todo_name, todo_completed)
         VALUES (?, ?, ?, 0)`,
        params1,
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json({error: '투두 추가가 실패했습니다.'});
            } else {
                const params2 = [
                    results.insertId,
                    req.body.todo_startdate,
                    req.body.todo_enddate
                ];

                console.log(params2);

                pool.query(
                    `INSERT INTO daily_todo (todo_no, todo_startdate, todo_enddate)
                     VALUES (?, ?, ?)`,
                    params2,
                    (err, results) => {
                        if (err) {
                            console.error(err);
                            res.status(400).json({error: '투두 추가가 실패했습니다.'});
                        } else {
                            res.status(201).json({message: '투두가 성공적으로 추가되었습니다.'})
                        }
                    }
                )
            }

        }
    )
});

router.post('/daily/increase', (req, res) => {
    const params1 = [
        req.body.user_no,
        req.body.category_no,
        req.body.todo_name
    ];

    pool.query(
        `INSERT INTO todo (user_no, category_no, todo_name, todo_completed)
         VALUES (?, ?, ?, 0)`,
        params1,
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json({error: '투두 추가가 실패했습니다.'});
            } else {
                const params2 = [
                    results.insertId,
                    req.body.todo_startdate,
                    req.body.todo_enddate,
                    req.body.todo_option,
                    req.body.todo_startvalue,
                    req.body.todo_amount,
                    req.body.todo_unit
                ];

                pool.query(
                    `INSERT INTO increase_todo (todo_no, todo_startdate, todo_enddate, todo_option, todo_startvalue,
                                                todo_amount, todo_unit)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    params2,
                    (err, results) => {
                        if (err) {
                            console.error(err);
                            res.status(400).json({error: '투두 추가가 실패했습니다.'});
                        } else {
                            res.status(201).json({message: '투두가 성공적으로 추가되었습니다.'})
                        }
                    }
                )
            }

        }
    )
})

router.get('/', (req, res) => {
    pool.query(
        `SELECT todo.*, category.*
         FROM todo
                  INNER JOIN category ON todo.category_no = category.category_no`,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).json({error: '데이터가 존재하지 않습니다.'})
            } else {
                const editedResult = results.map(result => {
                    return {
                        todo_no: result.todo_no,
                        todo_name: result.todo_name,
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

router.patch('/:todo_no/complete', (req, res) => {
    const todo_no = req.params.todo_no;
    pool.query(
        `UPDATE todo
         SET todo_completed = 1
         WHERE todo_no = ?`,
        [todo_no],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json({error: '투두를 수정하지 못했습니다.'});
            } else {
                res.status(200).json({message: '투두를 성공적으로 수정하였습니다.'});
            }
        }
    )
})

router.delete('/:todo_no', (req, res) => {
    const todo_no = req.params.todo_no;
    pool.query(
        'DELETE FROM todo WHERE todo_no = ? ',
        [todo_no],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json({message: '투두를 삭제하지 못했습니다.'});
            } else {
                res.status(400).json(results);
            }
        }
    )
});

router.get('/:todo_no/daily', (req, res) => {
    const todo_no = req.params.todo_no;
    pool.query(
        `SELECT * FROM daily_todo WHERE todo_no = ?`,
        [todo_no],
        (err, results) => {
            if (err) res.status(400).json({error: '투두를 조회할 수 없습니다.'});
            else if (results.length === 0) res.status(200).json(results);
            else res.status(200).json(results[0]);
        }
    );
});


module.exports = router;
