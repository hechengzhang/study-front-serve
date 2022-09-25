const setCtx = (ctx, code = 200, data = {}, message = '操作成功') => {
  let _message = message
  let _data = code === 200? data : data || {
    error: true
  }

  if (code === 401) {
    ctx.response.status = 401
  } else {
    ctx.body = {
      code: code,
      data: _data,
      message: _message
    }
  }
}


module.exports = setCtx