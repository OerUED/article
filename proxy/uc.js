"use strict";

var Uc = require('../models').Uc;
var promiseAct = require('../tools/tool').promiseAct;


var UcDAO = function() {};
//保存用户
UcDAO.prototype.save = function(obj) {
    var instance = new Uc(obj);
    return new Promise(function(resolve, reject) {
        instance.save(function(err,data) {
            promiseAct(resolve, reject, err,data);
        });
    });
}

//更新用户
UcDAO.prototype.update = function(query) {
    return new Promise(function(resolve, reject) {
        Uc.findByIdAndUpdate(query._id, query, {}, function(err, data) {
            promiseAct(resolve, reject, err, data);
        });
    });
}

//获取数量
UcDAO.prototype.count = function(query) {
    return new Promise(function(resolve, reject) {
        Uc.count(query, function(err, count) {
            promiseAct(resolve, reject, err, count);
        });
    });
}

//获取用户列表
UcDAO.prototype.list = function(query, opt) {
    return new Promise(function(resolve, reject) {
        Promise.all([
            new UcDAO().count(query),
            new Promise(function(resolve, reject) {
                Uc.find(query, {}, opt)
                .select('-password')
                .exec(function(err, data) {
                    promiseAct(resolve, reject, err, data);
                });
            })
        ]).then(function(res) {
            var data = {};
            data.count = res[0];
            data.list = res[1];
            resolve(data);
        }).catch(function(err) {
            reject(err);
        });
    })
}

//根据id获取用户
UcDAO.prototype.get = function(id) {
    return new Promise(function(resolve, reject) {
        Uc.findOne({
            _id: id
        })
        .select('-password')
        .exec(function(err, data) {
            promiseAct(resolve, reject, err, data);
        });
    });
}

//根据query获取用户
UcDAO.prototype.find = function(query,needPass) {
    let queryPass = needPass ? '' : '-password';
    return new Promise(function(resolve, reject) {
        Uc.findOne(query)
        .select(queryPass)
        .exec(function(err, data) {
            if(data){
                resolve(data);
            }else{
                reject(new Error('用户没有找到'));
            }
        });
    });
}

//删除用户
UcDAO.prototype.remove = function(id) {
    return new Promise(function(resolve, reject) {
        Uc.remove({
            _id: id
        }, function(err, data) {
            promiseAct(resolve, reject, err);
        });
    });
}

module.exports = new UcDAO();