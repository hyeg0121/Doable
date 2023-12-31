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
        req.body.group_option,
        req.body.creator_no,
        req.body.group_unit
    ];
    pool.query(
        `INSERT INTO todo_group (group_name, group_desc, group_search, group_todo, group_option, creator_no, group_unit)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        params,
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(400).json({error: '그룹을 추가할 수 없습니다.'});
            } else {
                pool.query(
                    `INSERT INTO membership (user_no, group_no, created_at)
                     VALUES (?, ?, now())`,
                    [params[5], result.insertId],
                    (err, result) => {
                        if (err) {
                            console.error('멤버 추가 오류:', err);
                            res.status(400).json({error: '멤버 추가 오류'});
                        } else {
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
        `SELECT *
         FROM todo_group`,
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
        `SELECT *
         FROM todo_group
         WHERE group_no = ?`,
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

router.post('/:group_no/users/:user_no', (req, res) => {
    const group_no = req.params.group_no;
    const user_no = req.params.user_no;

    pool.query(
        `INSERT INTO membership (user_no, group_no, created_at)
         VALUES (?, ?, now())`,
        [user_no, group_no],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json(err);
            } else {
                res.status(201).json({message: '그룹에 성공적으로 가입하였습니다.'});
            }
        }
    );
});

// 그룹 검색
router.get('/group/search', (req, res) => {
    const q = "%" + req.query.q + "%";
    pool.query(
        `SELECT *
         FROM todo_group
         WHERE group_name LIKE ?`,
        [q],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(400).json(err);
            } else {
                res.status(200).json(results);
            }
        }
    );
});

// 그룹 멤버인지 확인하기
router.get('/:group_no/membership/:user_no', (req, res) => {
    const groupNo = req.params.group_no;
    const userNo = req.params.user_no;

    pool.query(
        `SELECT *
         FROM membership
         WHERE group_no = ?
           AND user_no = ?`,
        [groupNo, userNo],
        (err, results) => {
            if (err) {
                res.status(400).json({error: '그룹 가입 여부를 확인할 수 없습니다.'});
            } else {
                if (results.length === 0)
                    res.status(200).json({result: false});
                else
                    res.status(200).json({result: true});

            }
        }
    )
});

// 그룹 멤버 수 조회하기
router.get('/:group_no/users', (req, res) => {
    const groupNo = req.params.group_no;

    pool.query(
        `SELECT *
         FROM membership
         WHERE group_no = ?`,
        [groupNo],
        (err, results) => {
            if (err) {
                res.status(400).json({error: '그룹 멤버를 조회하는데 실패했습니다.'});
            } else {
                res.status(200).json(results);
            }
        }
    )
});

router.patch('/:group_no/todos', (req, res) => {
    const groupNo = req.params.group_no;
    const params = [
        req.body.user_no,
        req.body.amount
    ];

    pool.query(
        `SELECT *
         FROM todo_group
         WHERE group_no = ?`,
        [groupNo],
        (err, results) => {
            if (err) res.status(400).json({error: '그룹 업데이트 중 실패하였습니다.1'});
            else {
                const result = results[0];
                console.log('result:', result);

                const option = parseInt(result.group_option);
                let amount = result.group_bestamount;
                let userNo = result.bestuser_no;

                if (option) {   // 덜하기
                    if (params[1] < amount || amount === null) {
                        userNo = params[0];
                        amount = params[1];
                    }
                } else {
                    if (amount < params[1] || amount === null) {
                        userNo = params[0];
                        amount = params[1];
                    }
                }

                const updateParams = [
                    userNo,
                    amount,
                    groupNo
                ];

                pool.query(
                    `UPDATE todo_group
                     SET bestuser_no = ?,
                         group_bestamount = ?
                     WHERE group_no = ?`,
                    updateParams,
                    (err, results) => {
                        if (err) {
                            console.error(err);
                            res.status(400).json({error: '그룹 업데이트 중 실패하였습니다.'});
                        } else {
                            res.status(200).json(results);
                        }
                    }
                )
            }
        }
    )
});

router.post('/:group_no/users/:user_no', (req, res) => {
    const groupNo = req.params.group_no;
    const userNo = req.params.user_no;

    pool.query(
        `INSERT INTO membership (user_no, group_no, created_at)
        VALUES (?, ?, now())`,
        [userNo, groupNo],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).json({error: '그룹 가입에 실패했습니다.'});
            } else {
                res.status(201).json(results);
            }
        }
    )
});

router.delete('/:group_no/users/:user_no', (req, res) => {
    const groupNo = req.params.group_no;
    const userNo = req.params.user_no;

    pool.query(
        `DELETE
         FROM membership
         WHERE group_no = ?
           AND user_no = ?`,
        [groupNo, userNo],
        (err, results) => {
            if (err) res.status(400).json({error: '그룹 탈퇴를 실패하였습니다.'});
            else res.status(200).json(results);
        }
    )
})


module.exports = router;
