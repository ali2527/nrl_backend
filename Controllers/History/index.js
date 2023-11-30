//Models
const User = require("../../Models/User");
const History = require("../../Models/History");
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



//addHistory
exports.addHistory = async (req, res) => {
    const { title,description,date,iframeID } = req.body;
      
    try {
      const history = new History({ title,description,date,iframeID});
  
      await history.save();
  
      return res.status(200).json(
        ApiResponse(
          { History },
          
          "History Created Successfully",
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

exports.getAllHistorys  = async (req, res) => {
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
                title: {
                  $regex: ".*" + req.query.keyword.toLowerCase() + ".*",
                  $options: "i",
                },
              }, 
              {
                description: {
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
        ? History.aggregate(finalAggregate)
        : History.aggregate([]);

    History.aggregatePaginate(myAggregate, { page, limit }).then(
      (historys) => {
        res.json(ApiResponse(historys));
      }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

// Get history by ID
exports.getHistoryById = async (req, res) => {
    try {
      const history = await History.findById(req.params.id);
  
      if (!history) {
        return res.json(ApiResponse({}, "History not found", true));
      }
  
      return res.json(ApiResponse({ history }, "", true));
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

  //update history
exports.updateHistory = async (req, res) => {
  try {
    let history = await History.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!history) {
      return res.json(ApiResponse({}, "No history found", false));
    }
    return res.json(ApiResponse(history, "History updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

  
  // Delete a history
  exports.deleteHistory = async (req, res) => {
    try {
      const history = await History.findByIdAndRemove(req.params.id);
  
      if (!history) {
        return res.json(ApiResponse({}, "History not found", false));
      }
  
      return res.json(ApiResponse({}, "History Deleted Successfully", true));
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


  