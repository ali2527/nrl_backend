const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../Helpers")
const user = require("../Models/User")


//signup Validator
exports.addEventValidator = [
  body('title').not().isEmpty().withMessage("Event title is Required"),
  body('description').not().isEmpty().withMessage("Event description is Required"),
  body('date').not().isEmpty().withMessage("Event date is Required"),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
    }
    next()  
  }
]