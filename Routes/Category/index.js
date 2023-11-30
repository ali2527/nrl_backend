
const express = require("express")
const { addCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory} = require("../../Controllers/Category");
const router = express.Router()
const { authenticatedRoute,adminRoute } = require("../../Middlewares/auth")
const {addCategoryValidator} = require("../../Validator/categoryValidator")

router.post("/addCategory",authenticatedRoute,addCategoryValidator, addCategory);
router.get("/getAllCategories", authenticatedRoute,getAllCategories);
router.get("/getCategoryById/:id", authenticatedRoute,getCategoryById);
router.post("/updateCategory/:id", authenticatedRoute,updateCategory);
router.post("/deleteCategory/:id", authenticatedRoute,deleteCategory);

module.exports = router