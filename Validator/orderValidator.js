const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../Helpers")
const user = require("../Models/User")


//signup Validator
exports.addOrderValidator = [
  body('address').not().isEmpty().withMessage("Order address is Required"),
  body('state').not().isEmpty().withMessage("Order state is Required"),
  body('city').not().isEmpty().withMessage("Order city is Required"),
  body('phone').not().isEmpty().withMessage("Phone number is Required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
    }
    next()  
  }
]