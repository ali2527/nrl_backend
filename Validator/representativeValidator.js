const { body, validationResult, check } = require('express-validator');
const { ApiResponse } = require("../Helpers")

//add Query Validator
exports.addRepresentativeValidator = [
  body('name').not().isEmpty().withMessage("Name is Required"),
  body('position').not().isEmpty().withMessage("Position is Required"),
  body('state').not().isEmpty().withMessage("State is Required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
    }
    next()  
  }
]