
const express = require("express")
const { addNews,getAllNews,getNewsById,updateNews,deleteNews} = require("../../Controllers/News");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addNewsValidator} = require("../../Validator/newsValidator")


router.post("/addNews",authenticatedRoute,addNewsValidator, addNews);
router.get("/getAllNews", authenticatedRoute,getAllNews);
router.get("/getNewsById/:id", authenticatedRoute,getNewsById);
router.post("/updateNews/:id", authenticatedRoute,updateNews);
router.post("/deleteNews/:id", authenticatedRoute,deleteNews);

module.exports = router