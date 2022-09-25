
/*
 * @Author: bigbang
 * @Date: 2021-05-08
 * @Description: 人员管理
 */

const Test_col = require('../models/test')
const Question_col = require('../models/question')
const setCtx = require('../utils/ctx')
const { getToday } = require('../utils/date')
const dataLimitHandler = require('../utils/dataLimitHandler')
const ObjectID = require('mongodb').ObjectID

const create = async (ctx) => {
  const createDate = getToday('dateTime')

  // 创建任务
  const questionList = await Question_col.aggregate([
    {
      $sample: {
        size: 10
      }
    },
    {
      $addFields: {
        'id': '$_id',
        'testAnswer': ''
      }
    },
    {
      $project: {
        _id: 0,
        answerNumber: 0,
        latestAnswerDate: 0,
        createDate: 0
      }
    },
  ]);
  
  // 创建任务
  const res = await Test_col.create({
    questionList,
    createDate,
  })

  // 返回创建结果
  setCtx(ctx, res? 200 : 201, res._id)
}

const getTestInfo = async (ctx) => {
  const req = ctx.request.body;
  const { id } = req

  if (!id) {
    return setCtx(ctx, 201, '缺少ID')
  }

  // 创建任务
  const res = await Test_col.findOne({
    _id: id
  })

  // 返回创建结果
  setCtx(ctx, res? 200 : 201, res)
}

// 答题
const answer = async (ctx) => {
  const req = ctx.request.body;
  const { id, questionId, answer } = req

  if (!id) {
    return setCtx(ctx, 201, '缺少ID')
  }
  if (!questionId) {
    return setCtx(ctx, 201, '缺少问题ID')
  }
  if (!answer) {
    return setCtx(ctx, 201, '缺少答案')
  }

  const res = await Test_col.findOneAndUpdate({
    _id: id,
    'questionList.id': ObjectID(questionId)
  }, {
    'questionList.$.testAnswer': answer
  })

  // 返回创建结果
  setCtx(ctx, res? 200 : 201, res)
}

// 打分
const mark = async (ctx) => {
  const req = ctx.request.body;
  const { id, questionId, status } = req

  if (!id) {
    return setCtx(ctx, 201, null,'缺少ID')
  }
  if (!questionId) {
    return setCtx(ctx, 201, null,'缺少问题ID')
  }
  if (status != 0 && status != 1) {
    return setCtx(ctx, 201, null,'状态枚举错误')
  }

  const res = await Test_col.findOneAndUpdate({
    _id: id,
    'questionList.id': ObjectID(questionId)
  }, {
    'questionList.$.status': Number(status)
  })

  // 返回创建结果
  setCtx(ctx, res? 200 : 201)
}

// 更新题目信息
const updateQuestionInfo = async (ctx) => {
  const req = ctx.request.body;
  const { id } = req

  if (!id) {
    return setCtx(ctx, 201, null,'缺少ID')
  }

  const test = await Test_col.findOne({
    _id: id,
  })

  const answerDate = getToday('dateTime')
  const total = test.questionList.length
  let correctNum = 0

  for (const item of test.questionList) {
    if (item.status) correctNum++

    await Question_col.update({
      _id: item.id
    }, {
      $inc: {
        correct: item.status? 1 : 0,
        error: item.status? 0 : 1,
        answerNumber: 1
      },
      latestAnswerDate: answerDate
    })
  }

  await Test_col.update({
    _id: id
  }, {
    throughRate: correctNum / total
  })

  // 返回创建结果
  setCtx(ctx, 200)
}

// 考试记录
const testList = async (ctx) => {
  const req = ctx.request.body;
  const { pageSize, currentPage } = req

  let dataParams = [
    { $skip: (Number(currentPage) - 1) * Number(pageSize) },
    { $limit: Number(pageSize) }
  ]

  const list = await Test_col.aggregate([
    {
      $addFields: {
        'id': '$_id',
      }
    },
    {
      $project: {
        _id: 0,
        questionList: 0
      }
    },
    {
      $sort: {
        createDate: -1
      }
    },
    {
      $facet:{
        "list": dataParams,
        "count":[
          { $group: { _id: null, total: { $sum: 1 } } },
          { $project:{ _id: 0, total: 1 } }
        ]
     }}
  ]);

  let newRes = dataLimitHandler(list)

  // 返回创建结果
  setCtx(ctx, list? 200 : 201, newRes)
}

module.exports = {
  create,
  getTestInfo,
  answer,
  mark,
  updateQuestionInfo,
  testList
}