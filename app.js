/*
 * @Author: hecz
 * @Date: 2021-04-14
 * @Description: 入口文件
 */

const Koa = require("koa");
const config = require("./config");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const app = new Koa();

mongoose.connect(config.db, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.error("连接数据库失败");
  } else {
    console.log("连接数据库成功");
  }
});

// 设置静态文件目录
const path = require("path");

app.use(cors());
app.use(bodyParser());

/**
 * 自动引入所有接口路由
 * require.context(directory, useSubdirectories = false, regExp = /^.//);
 * @param {String} directory 读取文件的路径
 * @param {Boolean} directory 匹配文件的正则表达式
 * @param {regExp} regExp 读取文件的路径
 */

const requireContext = require("require-context");
const routerFiles = requireContext(
  path.join(__dirname, "./routes"),
  false,
  /.js$/
);
routerFiles.keys().forEach((key) => {
  let router = require(`./routes/${key}`);
  app.use(router.routes()).use(router.allowedMethods());
});

app.listen(config.port);
