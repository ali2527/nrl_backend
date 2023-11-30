
const express = require("express")
const { addProduct,getAllProducts,getProductById,getProductByCategory,updateProduct,deleteProduct,purchaseProduct} = require("../../Controllers/Product");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addProductValidator} = require("../../Validator/productValidator")
const {uploadProduct} = require("../../Middlewares/upload")

router.post("/addProduct",authenticatedRoute,uploadProduct,addProductValidator, addProduct);
router.get("/getAllProducts", authenticatedRoute,getAllProducts);
router.get("/getProductById/:id", authenticatedRoute,getProductById);
router.get("/getProductByCategory/:id", authenticatedRoute,getProductByCategory);
router.post("/updateProduct/:id", authenticatedRoute,uploadProduct,updateProduct);
router.post("/deleteProduct/:id", authenticatedRoute,deleteProduct);

module.exports = router 