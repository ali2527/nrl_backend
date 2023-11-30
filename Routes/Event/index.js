
const express = require("express")
const { addEvent,getAllEvents,getEventById,updateEvent,deleteEvent} = require("../../Controllers/Event");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addEventValidator} = require("../../Validator/eventValidator")
const {uploadFile} = require("../../Middlewares/upload")

router.post("/addEvent",authenticatedRoute,uploadFile,addEventValidator, addEvent);
router.get("/getAllEvents", authenticatedRoute,getAllEvents);
router.get("/getEventById/:id", authenticatedRoute,getEventById);
router.post("/updateEvent/:id", authenticatedRoute,uploadFile,updateEvent);
router.post("/deleteEvent/:id", authenticatedRoute,deleteEvent);

module.exports = router