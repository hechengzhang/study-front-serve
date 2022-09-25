/*
 * @Author: hecz 
 * @Date: 2021-04-22
 * @Description: config file 
 */

const Router = require('koa-router');
const router = new Router();
const controller = require('../app/controllers/question');

for (let item in controller) {
  router.post(`/question/${item}`, controller[item]);
}

module.exports = router;