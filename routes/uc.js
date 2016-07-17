'use strict';
// 用户中心
var express = require('express');
var auth = require('../auth');
var controller = require('../controllers/uc');

var router = express.Router();

// 登陆
router.post('/login',controller.login);
// 登出
router.get('/logout',controller.logout);
// 新增加用户
router.post('',auth.hasRole,controller.add);
// 获取用户列表
router.get('/list',auth.hasRole,controller.list);
// 更新某个用户
router.put('/:id', auth.hasRole, controller.update);
// 删除某个用户（逻辑删除）
router.delete('/:id', auth.hasRole, controller.delete);
// 获取某个用户的信息
router.get('/:id', auth.hasRole, controller.get);

module.exports = router;