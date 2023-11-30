
const express = require("express")
const { addPosition,getAllPositions,getPositionById,updatePosition,deletePosition} = require("../../Controllers/Position");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addPositionValidator} = require("../../Validator/positionValidator")

router.post("/addPosition",authenticatedRoute,addPositionValidator, addPosition);
router.get("/getAllPositions", authenticatedRoute,getAllPositions);
router.get("/getPositionById/:id", authenticatedRoute,getPositionById);
router.post("/updatePosition/:id", authenticatedRoute,updatePosition);
router.post("/deletePosition/:id", authenticatedRoute,deletePosition);



module.exports = router