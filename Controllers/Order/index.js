//Models
const User = require("../../Models/User");
const Order = require("../../Models/Order");
const fs = require("fs")

//Helpers
const { generateToken } = require("../../Helpers/index");
const { ApiResponse } = require("../../Helpers/index");
const { validateToken } = require("../../Helpers/index");
const { generateString } = require("../../Helpers/index");
const { errorHandler } = require("../../Helpers/errorHandler");
const { generateEmail } = require("../../Helpers/email");
const mongoose = require("mongoose")
const { sendNotificationToAdmin} = require('../../Helpers/notification')

const sanitizeUser = require("../../Helpers/sanitizeUser");
const {
  createResetToken,
  validateResetToken,
} = require("../../Helpers/verification");


//addOrder
exports.addOrder = async (req, res) => {
    const { user,items,totalAmount,address,city,state,zip,phone } = req.body;
      
    try {
      const order = new Order({
        user:req.user._id,items,totalAmount,address,city,state,zip,phone
      });
  
      await order.save();

      const title = "New Order Placed";
      const content = `A new order of $ ${totalAmount} has been made`;
      sendNotificationToAdmin(title, content);
  
      return res.status(200).json(
        ApiResponse(
          { order },
          
          "Order Created Successfully",
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

  exports.getAllOrders = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      let { keyword, status, from, to } = req.query;
      let finalAggregate = [];
  
      if (req.query) {
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
      }
  
//          finalAggregate.push({
//         $lookup: {
//           from: "products",
//           localField: "items.product",
//           foreignField: "_id",
//           as: "populatedProducts",
//         },
//       },
//       {
//       $addFields: {
//         items: {
//           $map: {
//             input: "$items",
//             as: "item",
//             in: {
//               $mergeObjects: [
//                 "$$item",
//                 {
//                   $arrayElemAt: [
//                     {
//                       $filter: {
//                         input: "$populatedProducts",
//                         cond: {
//                           $eq: ["$$this._id", "$$item.product"],
//                         },
//                       },
//                     },
//                     0,
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//       },
//     },
//   );
   
  finalAggregate.push({
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "populatedProducts",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              $mergeObjects: [
                "$$item",
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$populatedProducts",
                        cond: {
                          $eq: ["$$this._id", "$$item.product"],
                        },
                      },
                    },
                    0,
                  ],
                },
              ],
            },
          },
        },
      },
    },{
        $unwind: "$user"
    });
    
    
    
      const myAggregate =
        finalAggregate.length > 0
          ? Order.aggregate(finalAggregate)
          : Order.aggregate([]);
  
      Order.aggregatePaginate(myAggregate, { page, limit }).then((orders) => {
        res.json(ApiResponse(orders));
      });
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

  exports.getMyOrders = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      let { keyword, status, from, to } = req.query;
      let finalAggregate = [{   $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },}];
  
      if (req.query) {
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
      }
  
      finalAggregate.push({
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "populatedProducts",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              $mergeObjects: [
                "$$item",
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$populatedProducts",
                        cond: {
                          $eq: ["$$this._id", "$$item.product"],
                        },
                      },
                    },
                    0,
                  ],
                },
              ],
            },
          },
        },
      },
    });
  
      const myAggregate =
        finalAggregate.length > 0
          ? Order.aggregate(finalAggregate)
          : Order.aggregate([]);
  
      Order.aggregatePaginate(myAggregate, { page, limit }).then((orders) => {
        res.json(ApiResponse(orders));
      });
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

// Get order by ID
exports.getOrdertById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('user').populate({
      path: 'items.product',
      model: 'product',
    });
  
      if (!order) {
        return res.json(ApiResponse({}, "Order not found", true));
      }
  
      return res.json(ApiResponse({ order }, "", true));
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

  //update order
exports.updateOrder = async (req, res) => {
  try {
       let order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) {
      return res.json(ApiResponse({}, "No order found", false));
    }
    return res.json(ApiResponse(order, "Order updated successfully"));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};

  
  // Delete a order
  exports.deleteOrder = async (req, res) => {
    try {
      const order = await Order.findByIdAndRemove(req.params.id);
  
      if (!order) {
        return res.json(ApiResponse({}, "Order not found", false));
      }
  
      return res.json(ApiResponse({}, "Order Deleted Successfully", true));
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

  exports.deleteAll = async (req, res) => {
    try {
      const order = await Order.deleteMany();
  
      return res.json(ApiResponse({}, "Order Deleted Successfully", true));
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
  