const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../Helpers")
const user = require("../Models/User")


//signup Validator
exports.addProductValidator = [
  body('title').not().isEmpty().withMessage("Product type is Required"),
  body('description').not().isEmpty().withMessage("Product description is Required"),
  body('price').not().isEmpty().withMessage("Product price is Required"),
  body('category').not().isEmpty().withMessage("Product category is Required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
    }
    next()  
  }
]