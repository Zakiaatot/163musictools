const express = require('express')
const ev = require('express-validation')
const router = express.Router()
const apiHandler = require('../router-handler/api')
const { loginschema } = require('../schema/loginschema')

router.post('/login', ev.validate(loginschema, {}, {}), apiHandler.login)
router.post('/logout', apiHandler.logout)
router.post('/checklog', apiHandler.checklog)
router.post('/checkinfo', apiHandler.checkinfo)
router.post('/signin', apiHandler.signin)
router.post('/daka', apiHandler.daka)
router.post('/dakaprogress', apiHandler.dakaprogress)
router.post('/getversion', apiHandler.getversion)
router.post('*', apiHandler.noFound)

module.exports = router
