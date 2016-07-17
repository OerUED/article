var crypto = require('crypto');
var config = require('../config');
var uc = require('../proxy/uc');
var response = require('../tools/tool').callback;

exports.login = function(req, res) {
    var email = req.body.email,
        password = req.body.password;

    password = crypto.createHmac('sha256', config.secret)
        .update(password)
        .digest('hex');

    uc.find({
        email: email,
        password: password
    }, 1).then(function(data) {
        req.session.uc = data;
        response(req, res, null, data);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}

exports.logout = function(req, res) {
    req.session.uc = null;
    response(req, res, null, null);
}

exports.add = function(req, res, next) {
    var obj = req.body;
    var password = crypto.createHmac('sha256', config.secret)
        .update('123456')
        .digest('hex');

    Object.assign(obj, {
        'password': password
    });

    uc.save(obj).then(function(data) {
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
        query['email'] = new RegExp(keyword); //模糊查询参数
    }

    uc.list(query, options).then(function(data) {
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

    uc.get(id).then(function(_res) {
        _res = Object.assign(_res, obj);
        return uc.update(_res);
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
    uc.get(id).then(function(_res) {
        // 置非
        status = !_res.status;
        obj = Object.assign(obj, {
            'status': status
        });
        _res = Object.assign(_res, obj);
        return uc.update(_res);
    }).then(function(data) {
        response(req, res, null, status);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}

// 物理删除
exports.delete = function(req, res) {
    var id = req.params.id;

    uc.remove(id).then(function(data) {
        response(req, res, null, null);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}

exports.get = function(req, res) {
    var id = req.params.id;
    uc.get(id).then(function(data) {
        response(req, res, null, data);
    }).catch(function(err) {
        response(req, res, err, null);
    });
}





