/*
 * @Author: hecz 
 * @Email: linkfind.hecz@gmail.com
 * @Date: 2020-07-01
 * @Description: 分页数据处理
 */

const dataLimitHandler = (data, type) => {
  let obj = {
    total: data[0].count.length > 0? data[0].count[0].total : 0
  }
  obj.list = obj.total === 0? [] : data[0].list

  return obj
}

module.exports = dataLimitHandler