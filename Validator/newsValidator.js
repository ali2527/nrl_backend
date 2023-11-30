
const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../Helpers")
const user = require("../Models/User")


//signup Validator
exports.addNewsValidator = [
  body('title').not().isEmpty().withMessage("News title is Required"),
  body('description').not().isEmpty().withMessage("Description is Required"),
  body('iframeID').not().isEmpty().withMessage("iframeID is Required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
    }
    next()  
  }
]