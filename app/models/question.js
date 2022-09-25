/*
 * @Author: bigbang 
 * @Date: 2021-05-07
 * @Description: 人员信息表
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const newSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  correct: {
    type: Number,
    default: 0
  },
  error: {
    type: Number,
    default: 0
  },
  answerNumber: {
    type: Number,
    default: 0
  },
  createDate: {
    type: String
  },
  latestAnswerDate: {
    type: String,
    default: ''
  } 
}, { collection: 'question', versionKey: false});

module.exports = mongoose.model('question', newSchema);
