/**
 * 用户表
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UcSchema = Schema({
  nickname:String,  // 昵称
  email: {          // 邮箱 用户登陆
    type: String,
    lowercase: true
  },
  avatar: String,   // 头像
  password: String, // 密码 存储加密过后的
  role: {           // 角色，备用
    type : String ,
    default : 'user'
  },
  status:{          // 1 正常  0 删除
    type:Number,
    default:1
  },
  created: {        // 创建日期
    type: Date,
    default: Date.now
  },
  updated: {        // 更新日期
    type: Date,
    default: Date.now
  }
});

UcSchema
  .virtual('userInfo')
  .get(function() {
    return {
      'nickname': this.nickname,
      'role': this.role,
      'email': this.email,
      'status':this.status,
      'created':this.created
    };
  });


mongoose.model('Uc', UcSchema);
