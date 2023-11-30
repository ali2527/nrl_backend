
const express = require("express")
const { addState,getAllStates,getStateById,deleteState,updateState} = require("../../Controllers/State");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addStateValidator} = require("../../Validator/stateValidator")
const {uploadFile} = require("../../Middlewares/upload")

router.post("/addState",authenticatedRoute,uploadFile, addState);
router.get("/getAllStates", authenticatedRoute,getAllStates);
router.get("/getStateById/:id", authenticatedRoute,getStateById);
router.post("/updateState/:id", authenticatedRoute,uploadFile,updateState);
router.post("/deleteState/:id", authenticatedRoute,deleteState);

module.exports = router