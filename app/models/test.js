/*
 * @Author: bigbang 
 * @Date: 2021-05-07
 * @Description: 人员信息表
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const newSchema = new Schema({
  throughRate: {
    type: Number,
    default: 0
  },
  createDate: {
    type: String,
    default: ''
  },
  questionList: {
    type: Array,
    default: []
  }
}, { collection: 'test', versionKey: false});

module.exports = mongoose.model('test', newSchema);
