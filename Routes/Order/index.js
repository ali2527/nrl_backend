
const express = require("express")
const { addOrder,getAllOrders,getMyOrders,getOrdertById,updateOrder,deleteOrder} = require("../../Controllers/Order");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addOrderValidator} = require("../../Validator/orderValidator")


router.post("/addOrder",authenticatedRoute,addOrderValidator, addOrder);
router.get("/getAllOrders", authenticatedRoute,getAllOrders);
router.get("/getMyOrders", authenticatedRoute,getMyOrders);
router.get("/getOrderById/:id", authenticatedRoute,getOrdertById);
router.post("/updateOrder/:id", authenticatedRoute,updateOrder);
router.post("/deleteOrder/:id", authenticatedRoute,deleteOrder);

module.exports = router