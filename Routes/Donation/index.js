
const express = require("express")
const { makeDonation,getAllDonations} = require("../../Controllers/Donation");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {uploadFile} = require("../../Middlewares/upload")

router.post("/makeDonation",authenticatedRoute,uploadFile, makeDonation);
router.get("/getAllDonations", authenticatedRoute,getAllDonations);

module.exports = router