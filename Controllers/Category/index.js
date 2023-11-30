//Models
const User = require("../../Models/User");
const Category = require("../../Models/Category");
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



//addCategory
exports.addCategory = async (req, res) => {
    const { title,description } = req.body;
      
    try {
      const category = new Category({
        title,description
      });
  
      await category.save();
  
      return res.status(200).json(
        ApiResponse(
          { Category },
          
          "Category Created Successfully",
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

exports.getAllCategories  = async (req, res) => {
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
        ? Category.aggregate(finalAggregate)
        : Category.aggregate([]);

    Category.aggregatePaginate(myAggregate, { page, limit }).then(
      (categorys) => {
        res.json(ApiResponse(categorys));
      }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
  
      if (!category) {
        return res.json(ApiResponse({}, "Category not found", true));
      }
  
      return res.json(ApiResponse({ category }, "", true));
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };
  
    // Delete a category
  exports.updateCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id,req.body);
  
      if (!category) {
        return res.json(ApiResponse({}, "Category not found", false));
      }
  
      return res.json(ApiResponse(category, "Category Updated Successfully", true));
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
  
  // Delete a category
  exports.deleteCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndRemove(req.params.id);
  
      if (!category) {
        return res.json(ApiResponse({}, "Category not found", false));
      }
  
      return res.json(ApiResponse({}, "Category Deleted Successfully", true));
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


