/* eslint-disable camelcase */
const { login_cellphone, logout, user_level, daily_signin, personalized, playlist_detail, scrobble } = require('NeteaseCloudMusicApi')

exports.login = async (req, res) => {
  if (!req.session.cookiedata || req.session.isLogin === false) {
    const data = req.body
    if (!data.phone || !data.password) {
      return res.error({
        code: 400,
        msg: '账号或密码为空'
      })
    }
    try {
      const result = await login_cellphone({
        phone: data.phone,
        md5_password: data.password,
        countrycode: data.countrycode || 86
      })
      if (result.body.code !== 200) return res.error(result.body)
      req.session.isLogin = true
      const result1 = await user_level({
        cookie: result.body.cookie
      })
      if (result1.body.code !== 200) return res.error(result.body)
      req.session.cookiedata = result.body.cookie
      req.session.userdata = {
        id: result.body.profile.userId,
        nickname: result.body.profile.nickname,
        avatarUrl: result.body.profile.avatarUrl,
        signature: result.body.profile.signature,
        playcount: result1.body.data.nextPlayCount - result1.body.data.nowPlayCount,
        logincount: result1.body.data.nextLoginCount - result1.body.data.nowLoginCount,
        level: result1.body.data.level
      }
      return res.success({
        code: 200,
        msg: '登录成功（切勿短时间重复登陆，容易账号异常）'
      })
    } catch (error) {
      console.log(error)
      return res.error(error.body.message ? error.body.message : '未知错误')
    }
  }
  return res.error({
    code: 500,
    msg: '你已经登陆过了，请手动注销登录或手动清除cookie（切勿短时间重复登陆，容易账号异常）'
  })
}

exports.logout = async (req, res) => {
  if (req.session.isLogin === true) {
    try {
      const lout = await logout({
        cookie: req.session.cookiedata
      })
      if (lout.body.code !== 200) {
        return res.error({
          code: 500,
          msg: '登出失败（请稍后重试）'
        })
      }
    } catch (err) {
      return res.error({
        code: 500,
        msg: err.body ? err.body : err
      })
    }
    res.clearCookie('zakiaatot')
    return res.success({
      code: 200,
      msg: '成功退出登录'
    })
  }
  return res.error({
    code: 500,
    msg: '你还没登陆，请登录'
  })
}

exports.checklog = (req, res) => {
  if (req.session.isLogin === true) {
    return res.success({
      code: 200,
      msg: '登录状态'
    })
  }
  return res.success({
    code: 200,
    msg: '未登录状态'
  })
}

exports.checkinfo = (req, res) => {
  if (req.session.isLogin === true) {
    return res.success({
      code: 200,
      msg: req.session
    })
  }
  return res.error({
    code: 500,
    msg: '你还没登陆，请登录'
  })
}

exports.signin = async (req, res) => {
  if (req.session.isLogin === true) {
    try {
      const result = await daily_signin({
        cookie: req.session.cookiedata
      })
      if (result.body.code === 200) {
        return res.success({
          code: 200,
          msg: {
            msg: '签到成功',
            point: result.body.point
          }
        })
      }
      if (result.body.code === -2) {
        return res.error({
          code: -2,
          msg: '请勿重复签到'
        })
      }
      return res.error({
        code: 500,
        msg: '未知错误，稍后再试'
      })
    } catch (err) {
      return res.error({
        code: 500,
        msg: err.body
      })
    }
  }
  return res.error({
    code: 500,
    msg: '你还没登陆，请登录'
  })
}

exports.daka = async (req, res) => {
  if (req.session.userdata && global.progess[req.session.userdata.id]) {
    return res.error({
      code: 500,
      msg: '请等待上一个任务结束'
    })
  } else if (req.session.isLogin === true) {
    try {
      const result1 = await personalized({
        limit: 350,
        cookie: req.session.cookiedata
      })
      if (result1.body.code !== 200) {
        return res.error({
          code: 500,
          msg: '推荐歌单获取失败'
        })
      }
      let count = 0
      const id = req.session.userdata.id

      for (const i in result1.body.result) {
        const listid = result1.body.result[i].id
        const result2 = await playlist_detail({
          id: listid,
          cookie: req.session.cookiedata
        })
        if (result2.body.code === 200) {
          for (let j = 0, len = result2.body.playlist.tracks.length; j < len; ++j) {
            const result3 = await scrobble({
              id: result2.body.playlist.tracks[j].id,
              sourceid: listid,
              time: 61,
              cookie: req.session.cookiedata
            })

            if (result3.body.code === 200) {
              ++count
              global.progess[id] = count
            }
          }
        }

        if (count > 350) break
      }

      const result = await user_level({
        cookie: req.session.cookiedata,
        timestamp: Date.now()
      })
      if (result.body.code === 200) {
        req.session.userdata.playcount = result.body.data.nextPlayCount - result.body.data.nowPlayCount
      }
      delete global.progess[id]

      if (count >= 350) {
        return res.success({
          code: 200,
          count
        })
      }
      return res.error({
        code: 500,
        msg: '未知错误，稍后重试'
      })
    } catch (err) {
      console.log(err)
      return res.error({
        code: 500,
        msg: err.body ? err.body : err
      })
    }
  }
  return res.error({
    code: 500,
    msg: '你还没登陆，请登录'
  })
}

exports.dakaprogress = (req, res) => {
  if (req.session.isLogin !== true) {
    return res.error({
      code: 500,
      msg: '你还没登陆，请登录'
    })
  }
  if (!global.progess[req.session.userdata.id]) {
    return res.error({
      code: 500,
      msg: '请先开始打卡任务'
    })
  }
  return res.success({
    code: 200,
    count: global.progess[req.session.userdata.id]
  })
}

exports.getversion = (req, res) => {
  res.success({
    code: 200,
    msg: global.progess.version
  })
}

exports.noFound = (req, res) => {
  return res.error({
    code: 404,
    msg: 'Not Found'
  })
}
