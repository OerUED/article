/**
 * 分类表
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ArticleSchema = Schema({
  author_id:{
    type: Schema.Types.ObjectId,
    ref: 'Uc'
  },
  title:String  // 标题
});

mongoose.model('Article', ArticleSchema);
