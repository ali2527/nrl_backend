//Models
const User = require("../../Models/User");
const Representative = require("../../Models/Representative");
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



//addRepresentative
exports.addRepresentative = async (req, res) => {
    const { name,position,state,reportCard,image } = req.body;
      
    try {
      const representative = new Representative({
        name,
        position,
        state,
        reportCard:JSON.parse(req.body.reportCard),
        image: image ? image : "",
      });
  
      await representative.save();
  
      return res.status(200).json(
        ApiResponse(
          { Representative },
          
          "Representative Created Successfully",
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

exports.getAllRepresentatives  = async (req, res) => {
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
                name: {
                  $regex: ".*" + req.query.keyword.toLowerCase() + ".*",
                  $options: "i",
                },
              },   
            ],
          },
        });
      }
      if (req.query.state) {
        finalAggregate.push({
          $match: {
           state:req.query.state
          },
        });
      }
      if (req.query.position) {
        finalAggregate.push({
          $match: {
            position:req.query.position
          },
        });
      }
    }
    
     finalAggregate.push( {
          $lookup: {
            from: "states",
            localField: "state",
            foreignField: "_id",
            as: "state",
          },
        },
        {
          $unwind: "$state",
        }, {
          $lookup: {
            from: "positions",
            localField: "position",
            foreignField: "_id",
            as: "position",
          },
        },
        {
          $unwind: "$position",
        });

    const myAggregate = 
      finalAggregate.length > 0
        ? Representative.aggregate(finalAggregate)
        : Representative.aggregate([]);

    Representative.aggregatePaginate(myAggregate, { page, limit }).then(
      (representatives) => {
        res.json(ApiResponse(representatives));
      }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

// Get representative by ID
exports.getRepresentativeById = async (req, res) => {
    try {
      const representative = await Representative.findById(req.params.id).populate("state").populate("position");
  
      if (!representative) {
        return res.json(ApiResponse({}, "Representative not found", true));
      }
  
      return res.json(ApiResponse({ representative }, "", true));
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

  // Get representative by ID
exports.getRepresentativeByPosition = async (req, res) => {
  let {state,position} = req.query
  try {
    const representative = await Representative.findOne({state,position});

    if (!representative) {
      return res.json(ApiResponse({}, "Representative not found", true));
    }

    return res.json(ApiResponse({ representative }, "", true));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};
  

//update product
exports.updateRepresentative = async (req, res) => {
  try {
    if (req.body.image) {
      let currentUser = await Product.findById(req.params.id);
      if (currentUser.image) {
        fs.unlinkSync(`./Uploads/${currentUser.image}`);
      }
    }
    
    let reportCard = JSON.parse(req.body.reportCard);
    
    let data = {...req.body,reportCard}

    let representative = await Representative.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!representative) {
      return res.json(ApiResponse({}, "No representative found", false));
    }
    return res.json(ApiResponse(representative, "Representative updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

  // Delete a representative
  exports.deleteRepresentative = async (req, res) => {
    try {
      const representative = await Representative.findByIdAndRemove(req.params.id);
  
      if (!representative) {
        return res.json(ApiResponse({}, "Representative not found", false));
      }
  
      return res.json(ApiResponse({}, "Representative Deleted Successfully", true));
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



  