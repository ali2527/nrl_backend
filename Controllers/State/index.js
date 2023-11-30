//Models
const User = require("../../Models/User");
const State = require("../../Models/State");
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



//addState
exports.addState = async (req, res) => {
    const { name, abbreviation,image } = req.body;

  
    try {
      const state = new State({
        name,
        abbreviation,
        flag:image ? image : ""
      });
  
      await state.save();
  
      return res.status(200).json(
        ApiResponse(
          { State },
          
          "State Created Successfully",
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

exports.getAllStates  = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 50;

    let finalAggregate = [];

    if (req.query) {
      if (req.query.keyword) {
        finalAggregate.push({
          $match: {
            $or: [
              {
                name: {
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


finalAggregate.push({
    $sort:{
        name:1
    }
});

    const myAggregate = 
      finalAggregate.length > 0
        ? State.aggregate(finalAggregate)
        : State.aggregate([]);

    State.aggregatePaginate(myAggregate, { page, limit }).then(
      (states) => {
        res.json(ApiResponse(states));
      }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

// Get state by ID
exports.getStateById = async (req, res) => {
    try {
      const state = await State.findById(req.params.id);
  
      if (!state) {
        return res.json(ApiResponse({}, "State not found", true));
      }
  
      return res.json(ApiResponse({ state }, "", true));
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };
  
  
    //update event
exports.updateState = async (req, res) => {
  try {
    if (req.body.image) {
      let currentState = await State.findById(req.params.id);
      if (currentState.flag) {
        if (fs.existsSync(`./Uploads/${currentState.flag}`)) {
        fs.unlinkSync(`./Uploads/${currentState.flag}`);
      }
    }


    }
    
    let data = {...req.body, flag:req.body.image || ""}
    let state = await State.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!state) {
      return res.json(ApiResponse({}, "No state found", false));
    }
    return res.json(ApiResponse(state, "State updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};
  // Delete a state
  exports.deleteState = async (req, res) => {
    try {
      const state = await State.findByIdAndRemove(req.params.id);
            if (fs.existsSync(`./Uploads/${state.flag}`)) {
          fs.unlinkSync(`./Uploads/${state.flag}`);
        }   
    
      if (!state) {
        return res.json(ApiResponse({}, "State not found", false));
      }
  
      return res.json(ApiResponse({}, "State Deleted Successfully", true));
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
  
  
  


