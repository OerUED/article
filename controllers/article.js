'use strict';

var crypto = require('crypto');
var config = require('../config');
var article = require('../proxy/article');
var response = require('../tools/tool').callback;

exports.add = function(req, res, next) {
    var obj = req.body;

    var errorMsg = '';

    if (obj.title === undefined) {
        errorMsg = '标题';
        return response(req, res, errorMsg, null);
    }

    if (!req.session.uc) {
        errorMsg = '未登录';
        return response(req, res, errorMsg, null);
    }

    Object.assign(obj, {
        author_id: req.session.uc._id
    });

    console.log(obj);

    article.save(obj).then(function(data) {
        response(req, res, null, null);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}

exports.list = function(req, res) {
    var size = parseInt(req.query.size) || 20;
    var page = parseInt(req.query.page) || 1;
    page = page > 0 ? page : 1;
    var keyword = req.query.keyword ? req.query.keyword : '';

    var options = {
        skip: (page - 1) * size,
        limit: size,
        sort: '-_id'
    };

    var query = {
        // status: 1
    };

    if (keyword) {
        query['title'] = new RegExp(keyword); //模糊查询参数
    }

    article.list(query, options).then(function(data) {
        response(req, res, null, data);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}

exports.update = function(req, res) {
    var id = req.params.id;
    var obj = req.body;
    obj = Object.assign(obj, {
        'updated': Date.now
    });

    article.get(id).then(function(_res) {
        _res = Object.assign(_res, obj);
        return article.update(_res);
    }).then(function(data) {
        response(req, res, null, data);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}

// 逻辑删除
exports.remove = function(req, res) {
    var id = req.params.id;
    var obj = req.body;
    var status;
    article.get(id).then(function(_res) {
        // 置非
        status = !_res.status;
        obj = Object.assign(obj, {
            'status': status
        });
        _res = Object.assign(_res, obj);
        return article.update(_res);
    }).then(function(data) {
        response(req, res, null, status);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}

// 物理删除
exports.delete = function(req, res) {
    var id = req.params.id;

    article.remove(id).then(function(data) {
        response(req, res, null, null);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}

exports.get = function(req, res) {
    var id = req.params.id;
    article.get(id).then(function(data) {
        console.log(data.author_id.email);
        response(req, res, null, data);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}
