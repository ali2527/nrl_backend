//Models
const User = require("../../Models/User");
const News = require("../../Models/News");
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



//addNews
exports.addNews = async (req, res) => {
    const { title,description,date,iframeID } = req.body;

      
    try {
      const news = new News({ title,description,date,iframeID});
  
      await news.save();
  
      return res.status(200).json(
        ApiResponse(
          { News },
          
          "News Created Successfully",
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

exports.getAllNews  = async (req, res) => {
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
        ? News.aggregate(finalAggregate)
        : News.aggregate([]);

    News.aggregatePaginate(myAggregate, { page, limit }).then(
      (newss) => {
        res.json(ApiResponse(newss));
      }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
  
      if (!news) {
        return res.json(ApiResponse({}, "News not found", true));
      }
  
      return res.json(ApiResponse({ news }, "", true));
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

  //update news
exports.updateNews = async (req, res) => {
  try {
    let news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!news) {
      return res.json(ApiResponse({}, "No news found", false));
    }
    return res.json(ApiResponse(news, "News updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

  
  // Delete a news
  exports.deleteNews = async (req, res) => {
    try {
      const news = await News.findByIdAndRemove(req.params.id);
  
      if (!news) {
        return res.json(ApiResponse({}, "News not found", false));
      }
  
      return res.json(ApiResponse({}, "News Deleted Successfully", true));
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


  