

const express = require("express")
const { addRepresentative,getAllRepresentatives,getRepresentativeById,getRepresentativeByPosition,updateRepresentative,deleteRepresentative} = require("../../Controllers/Representative");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addRepresentativeValidator} = require("../../Validator/representativeValidator")
const {uploadFile} = require("../../Middlewares/upload")

router.post("/addRepresentative",authenticatedRoute,uploadFile,addRepresentativeValidator, addRepresentative);
router.get("/getAllRepresentatives", authenticatedRoute,getAllRepresentatives);
router.get("/getRepresentativeById/:id", authenticatedRoute,getRepresentativeById);
router.get("/getRepresentativeByPosition", authenticatedRoute,getRepresentativeByPosition);
router.post("/updateRepresentative/:id",authenticatedRoute,uploadFile,updateRepresentative);
router.post("/deleteRepresentative/:id", authenticatedRoute,deleteRepresentative);

module.exports = router