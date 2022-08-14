const { Joi } = require('express-validation')

// 注册和登录表单的验证规则对象
exports.loginschema = {
  body: Joi.object({
    phone:
            Joi.string()
              .regex(/[0-9]{7,11}/), // 手机号是7到11位的数字
    password:
            Joi.string()
              .regex(/.{32,32}/),
    countrycode:
            Joi.string()
              .regex(/[0-9]{1,3}/)
  })
}
