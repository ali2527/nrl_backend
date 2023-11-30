
const express = require("express")
const { getAllPayments,getAllMyPayments,getAllDonations,deletePayment,getToken,orderPayment,donationPayment,deleteAllPayment} = require("../../Controllers/Payment");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {uploadFile} = require("../../Middlewares/upload");
const { getAllOrderPayments } = require("../../Controllers/Payment");


router.post("/orderPayment", authenticatedRoute,orderPayment);
router.post("/donationPayment", authenticatedRoute,donationPayment);
router.get("/getToken", authenticatedRoute,getToken);
router.get("/getAllPayments", authenticatedRoute,getAllPayments);
router.get("/getAllMyPayments", authenticatedRoute,getAllMyPayments);
router.get("/getAllDonations", authenticatedRoute,getAllDonations);
router.get("/getAllOrderPayments", authenticatedRoute,getAllOrderPayments);
router.post("/deletePayment/:id", authenticatedRoute,deletePayment);
router.get("/deleteAllPayment", deleteAllPayment);


module.exports = router