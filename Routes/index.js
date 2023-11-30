const express = require('express')
const router = express.Router() 


//user routes
router.use('/auth', require('./User/Auth'))
router.use('/profile',require("./User/Profile"))

//other routes
router.use('/state', require('./State'))
router.use('/position',require("./Position"))
router.use('/category',require("./Category"))
router.use('/product',require("./Product"))
router.use('/representative',require("./Representative"))
router.use('/event',require("./Event"))
router.use('/history',require("./History"))
router.use('/news',require("./News"))
router.use('/order',require("./Order"))
router.use('/donation',require("./Donation"))
router.use('/payment',require("./Payment"))
router.use('/product',require("./Product"))
router.use('/notification',require("./Notification"))

//admin routes
router.use('/admin/auth', require('./Admin/AdminAuth'))
router.use('/admin/user', require('./Admin/AdminUser'))



module.exports = router;