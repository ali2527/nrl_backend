
const express = require("express")
const { addHistory,getAllHistorys,getHistoryById,updateHistory,deleteHistory} = require("../../Controllers/History");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addHistoryValidator} = require("../../Validator/historyValidator")


router.post("/addHistory",authenticatedRoute,addHistoryValidator, addHistory);
router.get("/getAllHistorys", authenticatedRoute,getAllHistorys);
router.get("/getHistoryById/:id", authenticatedRoute,getHistoryById);
router.post("/updateHistory/:id", authenticatedRoute,updateHistory);
router.post("/deleteHistory/:id", authenticatedRoute,deleteHistory);

module.exports = router