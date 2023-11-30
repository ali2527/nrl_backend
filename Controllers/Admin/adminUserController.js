//Models
const User = require("../../Models/User");
const Product = require("../../Models/Product");
const Order = require("../../Models/Order");
const Donation = require("../../Models/Donation");
const mongoose = require("mongoose");

//Helpers
const { generateToken } = require("../../Helpers/index");
const { ApiResponse } = require("../../Helpers/index");
const { validateToken } = require("../../Helpers/index");
const { generateString } = require("../../Helpers/index");
const { errorHandler } = require("../../Helpers/errorHandler");
const { generateEmail } = require("../../Helpers/email");
const  sanitizeUser = require("../../Helpers/sanitizeUser");
const fs = require("fs");
const {
  createResetToken,
  validateResetToken,
} = require("../../Helpers/verification");

//libraries
const dayjs = require("dayjs");

//modules
const moment = require("moment");


//get user
exports.getAdmin = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.json(ApiResponse({}, "No admin found", false));
    }

    return res
      .status(200)
      .json(ApiResponse(sanitizeUser(user), "Found Admin Details", true));
  } catch (error) {
    return res.status(500).json(ApiResponse({}, error.message,false));
  }
};

    
//get all users with pagination
exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, status, from, to, keyword } = req.query;
  try {
    let finalAggregate = [];
    
     finalAggregate.push({
        $match: {
          isAdmin: false,
        },
      });

    if (keyword) {
      finalAggregate.push({
        $match: {
          $or: [
            {
              firstName: {
                $regex: ".*" + keyword.toLowerCase() + ".*",
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: ".*" + keyword.toLowerCase() + ".*",
                $options: "i",
              },
            },
            {
              email: {
                $regex: ".*" + keyword.toLowerCase() + ".*",
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (status) {
      finalAggregate.push({
        $match: {
          status: req.query.status,
        },
      });
    }

    if (from) {
      finalAggregate.push({
        $match: {
          createdAt: {
            $gte: moment(from).startOf("day").toDate(),
            $lte: moment(new Date()).endOf("day").toDate(),
          },
        },
      });
    }

    if (to) {
      finalAggregate.push({
        $match: {
          createdAt: {
            $lte: moment(to).endOf("day").toDate(),
          },
        },
      });
    }

    finalAggregate.push({
      $project: {
        salt: 0,
        hashed_password: 0,
      },
    });

    const myAggregate =

      finalAggregate.length > 0
        ? User.aggregate(finalAggregate).sort({ firstName: 1 })
        : User.aggregate([]);

    User.aggregatePaginate(myAggregate, { page, limit }, (err, users) => {
      if (err) {
        return res.json(
          ApiResponse(
            {},
            errorHandler(err) ? errorHandler(err) : err.message,
            false
          )
        );
      }
      if (!users || users.docs.length == 0){
        return res.json(ApiResponse({}, "No users found", false));
      }

      return res.json(ApiResponse(users));
    }
    );
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};



//get user by id
exports.getUserById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
      return res.json(ApiResponse({}, "No user found", false));
      }
      return res.json(ApiResponse(user));
  } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
  }
  }

 //toggleStatus
exports.toggleStatus = async (req, res) => {
  try {
    
    let user = await User.findById(req.params.id);

      user.status = user.status == "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await user.save();


      return res.json(ApiResponse(user, "User Status Changed"));
 
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};


 //deleteUser
exports.deleteUser = async (req, res) => {
  try {
    
    let user = await User.findByIdAndRemove(req.params.id);

      return res.json(ApiResponse({}, "User Deleted Successfully"));
 
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

//update admin
exports.updateUser = async (req, res) => {
  try {
    if (req.body.image) {
        let currentUser = await User.findById(req.params.id);
          if (currentUser.image) {
            if (fs.existsSync(`./Uploads/${currentUser.image}`)) {
            fs.unlinkSync(`./Uploads/${currentUser.image}`);
          }
        }
      }


    let user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.json(ApiResponse({}, "No uses found", false));
    }
    return res.json(ApiResponse(user, "User updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};


exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ isAdmin: false });
    const productCount = await Product.countDocuments();
    const donationSum = await Donation.aggregate([{ $group: { _id: null,total: {$sum: '$amount'  } } }]);
    const orderSum = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);

 return res.json(ApiResponse({
      userCount,
      productCount,
      donationSum: donationSum.length > 0 ? donationSum[0].total : 0,
      orderSum: orderSum.length > 0 ? orderSum[0].total : 0,
    }, "", true));
  } catch (error) {
    console.error(error);
     return res.json(ApiResponse({}, error.message, false));
  }
};


exports.getDonationChart = async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setUTCMonth(twelveMonthsAgo.getUTCMonth() - 12);

    const donationsByMonth = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt',
            },
          },
          totalAmount: { $sum: '$amount'},
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Create a map with months as keys and donations as values
    const donationsMap = new Map();
    donationsByMonth.forEach((entry) => {
      donationsMap.set(entry._id, { totalAmount: entry.totalAmount, count: entry.count });
    });

    // Generate an array with 0 for months without donations
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 2; // Months are zero-based

    const monthsArray = [];
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const targetMonth = new Date(thisYear, thisMonth - monthOffset - 1, 1);
      const monthKey = targetMonth.toISOString().slice(0, 7);
      const donationEntry = donationsMap.get(monthKey) || { totalAmount: 0, count: 0 };
      monthsArray.push({
        month: monthKey,
        totalAmount: donationEntry.totalAmount,
        count: donationEntry.count,
      });
    }

 return res.json(ApiResponse(monthsArray.reverse(),"",true));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

exports.getOrdersChart = async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setUTCMonth(twelveMonthsAgo.getUTCMonth() - 12);

    const orderByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt',
            },
          },
          totalAmount: { $sum: '$totalAmount'},
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Create a map with months as keys and donations as values
    const ordersMap = new Map();
    orderByMonth.forEach((entry) => {
      ordersMap.set(entry._id, { totalAmount: entry.totalAmount, count: entry.count });
    });

    // Generate an array with 0 for months without donations
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 2; // Months are zero-based

    const monthsArray = [];
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const targetMonth = new Date(thisYear, thisMonth - monthOffset - 1, 1);
      const monthKey = targetMonth.toISOString().slice(0, 7);
      const orderEntry = ordersMap.get(monthKey) || { totalAmount: 0, count: 0 };
      monthsArray.push({
        month: monthKey,
        totalAmount: orderEntry.totalAmount,
        count: orderEntry.count,
      });
    }

 return res.json(ApiResponse(monthsArray.reverse(),"",true));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};






