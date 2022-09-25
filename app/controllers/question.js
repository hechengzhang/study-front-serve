
/*
 * @Author: bigbang
 * @Date: 2021-05-08
 * @Description: 人员管理
 */

const Question_col = require('../models/question')
const setCtx = require('../utils/ctx')
const { getToday } = require('../utils/date')
const dataLimitHandler = require('../utils/dataLimitHandler')

const add = async (ctx) => {
  const req = ctx.request.body;

  const { question, answer } = req

  /**
   * 校验参数
   */
  if (typeof question !== 'string') {
    return setCtx(ctx, 201, '缺少题目')
  }
  if (typeof answer !== 'string') {
    return setCtx(ctx, 201, '缺少答案')
  }

  const createDate = getToday('dateTime')
  
  // 创建任务
  const res = await Question_col.create({
    question,
    answer,
    createDate,
  })

  // 返回创建结果
  setCtx(ctx, res? 200 : 201)
}


const list = async (ctx) => {
  const req = ctx.request.body;

  const { pageSize, currentPage } = req

  let dataParams = [
    { $skip: (Number(currentPage) - 1) * Number(pageSize) },
    { $limit: Number(pageSize) }
  ]

  

  const list = await Question_col.aggregate([
    {
      $addFields: {
          'id': '$_id',
      }
    },
    {
      $project: {
        _id: 0,
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

const deleteQuestion = async (ctx) => {
  const req = ctx.request.body;

  const { id } = req

  if (!id) {
    return setCtx(ctx, 201, '缺少ID')
  }

  const res = await Question_col.findOneAndRemove({
    _id: id
  });

  // 返回创建结果
  setCtx(ctx, res? 200 : 201)
}

const edit = async (ctx) => {
  const req = ctx.request.body;

  const { id, question, answer } = req

  if (!id) {
    return setCtx(ctx, 201, '缺少ID')
  }
  if (typeof question !== 'string') {
    return setCtx(ctx, 201, '缺少题目')
  }
  if (typeof answer !== 'string') {
    return setCtx(ctx, 201, '缺少答案')
  }

  const res = await Question_col.update({
    _id: id
  }, {
    question,
    answer
  });

  // 返回创建结果
  setCtx(ctx, res? 200 : 201)
}

module.exports = {
  add,
  list,
  deleteQuestion,
  edit
}