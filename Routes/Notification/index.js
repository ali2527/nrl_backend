const express = require("express")
const {getAllAdminNotifications,getUnreadAdminNotifications,toggleNotification,getNotificationById} = require("../../Controllers/Notification");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")


router.post("/toggleNotification/:id",authenticatedRoute, toggleNotification);
router.get("/getNotificationById/:id",authenticatedRoute, getNotificationById);
router.get("/getAllAdminNotifications",authenticatedRoute,getAllAdminNotifications);
router.get("/getUnreadAdminNotifications",authenticatedRoute,getUnreadAdminNotifications)

module.exports = router