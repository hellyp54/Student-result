var express = require('express');
const { register, login, add_student, update_student, view_student, delete_student, add_result, view_result, update_result, delete_result, top3, logout } = require('../controller/user_controller');
var router = express.Router();

/* GET home page. */
router.post('/',register);
router.post('/login',login);

router.post('/add_student',add_student);
router.get("/view_student",view_student);
router.post('/update_student/:id',update_student);
router.get('/delete_student/:id',delete_student);

router.post('/add_result',add_result);
router.get('/view_result',view_result);
router.post('/update_result/:id',update_result);
router.post('/delete_result/:id',delete_result);
router.get('/top3',top3);
router.post('/logout',logout);

module.exports = router;
