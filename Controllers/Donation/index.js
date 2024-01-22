//Models
const User = require("../../Models/User");
const Donation = require("../../Models/Donation");
const fs = require("fs")

//Helpers
const { generateToken } = require("../../Helpers/index");
const { ApiResponse } = require("../../Helpers/index");
const { validateToken } = require("../../Helpers/index");
const { generateString } = require("../../Helpers/index");
const { errorHandler } = require("../../Helpers/errorHandler");
const { generateEmail } = require("../../Helpers/email");
const sanitizeUser = require("../../Helpers/sanitizeUser");
const { sendNotificationToAdmin} = require('../../Helpers/notification')
const {
  createResetToken,
  validateResetToken,
} = require("../../Helpers/verification");



//addDonation
exports.makeDonation = async (req, res) => {
    const { donor,phone,amount } = req.body;
        
    try {
      const donation = new Donation({
        donor : donor ? donor : "anonymous",
        phone,
        amount
      });
  
      await donation.save();
  

     
      return res.status(200).json(
        ApiResponse(
          { donation },
          "Thankyou for your Donation",
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

exports.getAllDonations  = async (req, res) => {
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
                donor: {
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
        ? Donation.aggregate(finalAggregate)
        : Donation.aggregate([]);

    Donation.aggregatePaginate(myAggregate, { page, limit }).then(
      (donations) => {
        res.json(ApiResponse(donations));
      }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};
