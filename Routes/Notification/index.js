const express = require("express")
const {getAllNotifications,getAllUnreadNotifications,toggleNotification,getNotificationById} = require("../../Controllers/Notification");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")


router.get("/getAllNotifications",authenticatedRoute,getAllNotifications);
router.get("/getAllUnreadNotifications",authenticatedRoute,getAllUnreadNotifications)
router.get("/getNotificationById/:id",authenticatedRoute, getNotificationById);
router.post("/toggleNotification/:id",authenticatedRoute, toggleNotification);

module.exports = router