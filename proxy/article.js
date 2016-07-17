"use strict";

var Article = require('../models').Article;
var promiseAct = require('../tools/tool').promiseAct;

let populateAuthor = {path: 'author_id', select: 'nickname -_id'};

var ArticleDAO = function() {};
//保存文章
ArticleDAO.prototype.save = function(obj) {
    var instance = new Article(obj);
    return new Promise(function(resolve, reject) {
        instance.save(function(err,data) {
            promiseAct(resolve, reject, err,data);
        });
    });
}

//更新文章
ArticleDAO.prototype.update = function(query) {
    return new Promise(function(resolve, reject) {
        Article.findByIdAndUpdate(query._id, query, {}, function(err, data) {
            promiseAct(resolve, reject, err, data);
        });
    });
}

//获取数量
ArticleDAO.prototype.count = function(query) {
    return new Promise(function(resolve, reject) {
        Article.count(query, function(err, count) {
            promiseAct(resolve, reject, err, count);
        });
    });
}

//获取文章列表
ArticleDAO.prototype.list = function(query, opt) {
    return new Promise(function(resolve, reject) {
        Promise.all([
            new ArticleDAO().count(query),
            new Promise(function(resolve, reject) {
                Article.find(query, {}, opt)
                .populate(populateAuthor)
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

//根据id获取文章
ArticleDAO.prototype.get = function(id) {
    return new Promise(function(resolve, reject) {
        Article.findOne({
            _id: id
        })
        .populate(populateAuthor)
        .select('-password')
        .exec(function(err, data) {
            promiseAct(resolve, reject, err, data);
        });
    });
}

//根据query获取文章
ArticleDAO.prototype.find = function(query,needPass) {
    let queryPass = needPass ? '' : '-password';
    return new Promise(function(resolve, reject) {
        Article.findOne(query)
        .populate(populateAuthor)
        .select(queryPass)
        .exec(function(err, data) {
            if(data){
                resolve(data);
            }else{
                reject(new Error('文章没有找到'));
            }
        });
    });
}

//删除文章
ArticleDAO.prototype.remove = function(id) {
    return new Promise(function(resolve, reject) {
        Article.remove({
            _id: id
        }, function(err, data) {
            promiseAct(resolve, reject, err);
        });
    });
}

module.exports = new ArticleDAO();