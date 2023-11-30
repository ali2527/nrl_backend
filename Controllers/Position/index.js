//Models
const User = require("../../Models/User");
const Position = require("../../Models/Position");
const fs = require("fs")

//Helpers
const { generateToken } = require("../../Helpers/index");
const { ApiResponse } = require("../../Helpers/index");
const { validateToken } = require("../../Helpers/index");
const { generateString } = require("../../Helpers/index");
const { errorHandler } = require("../../Helpers/errorHandler");
const { generateEmail } = require("../../Helpers/email");
const sanitizeUser = require("../../Helpers/sanitizeUser");
const {
  createResetToken,
  validateResetToken,
} = require("../../Helpers/verification");



//addPosition
exports.addPosition = async (req, res) => {
    const { type } = req.body;
      
    try {
      const position = new Position({
        type,
      });
  
      await position.save();
  
      return res.status(200).json(
        ApiResponse(
          { Position },
          
          "Position Created Successfully",
          true
        )
      );
    } catch (error) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(error) ? errorHandler(error) : error.message,
          false
        )
      );
    }
  };

exports.getAllPositions  = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let finalAggregate = [];

    if (req.query) {
      if (req.query.keyword) {
        finalAggregate.push({
          $match: {
            $or: [
              {
                type: {
                  $regex: ".*" + req.query.keyword.toLowerCase() + ".*",
                  $options: "i",
                },
              },           
            ],
          },
        });
      }
    }

    const myAggregate = 
      finalAggregate.length > 0
        ? Position.aggregate(finalAggregate)
        : Position.aggregate([]);

    Position.aggregatePaginate(myAggregate, { page, limit }).then(
      (positions) => {
        res.json(ApiResponse(positions));
      }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};


exports.updatePosition = async (req, res) => {
  try {
    
    let position = await Position.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!position) {
      return res.json(ApiResponse({}, "No position found", false));
    }
    return res.json(ApiResponse(position, "Position updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};



// Get position by ID
exports.getPositionById = async (req, res) => {
    try {
      const position = await Position.findById(req.params.id);
  
      if (!position) {
        return res.json(ApiResponse({}, "Position not found", true));
      }
  
      return res.json(ApiResponse({ position }, "", true));
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };
  
  // Delete a position
  exports.deletePosition = async (req, res) => {
    try {
      const position = await Position.findByIdAndRemove(req.params.id);
  
      if (!position) {
        return res.json(ApiResponse({}, "Position not found", false));
      }
  
      return res.json(ApiResponse({}, "Position Deleted Successfully", true));
    } catch (error) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(error) ? errorHandler(error) : error.message,
          false
        )
      );
    }
  };


