'use strict';
// 文章中心
var express = require('express');
var auth = require('../auth');
var controller = require('../controllers/article');

var router = express.Router();

// 新增加文章
router.post('',auth.hasRole,controller.add);
// 获取文章列表
router.get('',auth.hasRole,controller.list);
// 更新某个文章
router.put('/:id', auth.hasRole, controller.update);
// 删除某个文章（逻辑删除）
router.delete('/:id', auth.hasRole, controller.remove);
// 删除某个文章（逻辑删除）
router.delete('/:id/delete', auth.hasRole, controller.delete);
// 获取某个文章的信息
router.get('/:id', auth.hasRole, controller.get);

module.exports = router;