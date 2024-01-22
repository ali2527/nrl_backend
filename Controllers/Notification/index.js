//Models

const User = require("../../Models/User")
const Chat = require("../../Models/Chat")
const Notification = require("../../Models/Notification");
const {sendNotificationToUser, sendNotificationToAdmin} = require("../../Helpers/notification")
const mongoose = require("mongoose")
const moment = require("moment")
//Helpers
const { ApiResponse } = require("../../Helpers/index");

//libraries
const dayjs = require("dayjs");



exports.getAllNotifications = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let { keyword, from, to,type,status } = req.query;

    let finalAggregate = [{
      $sort:{
        createdAt:-1
      }
    }];


      if (keyword) {
        const regex = new RegExp(keyword.toLowerCase(), "i");
        finalAggregate.push({
          $match: {
            $or: [
              { title: { $regex: regex } },
              { content: { $regex: regex } },
            ],
          },
        });
      }
      

      if (status) {
        finalAggregate.push({
          $match: {
            isRead: req.query.status == "read" ? true : false,
          },
        });
      }
  
      if (from) {
        finalAggregate.push({
          $match: {
            createdAt: {
              $gte: moment(from).startOf("day").toDate(),
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

    const myAggregate =
      finalAggregate.length > 0
        ? Notification.aggregate(finalAggregate)
        : Notification.aggregate([]);

    Notification.aggregatePaginate(myAggregate, { page, limit }).then((notifications) => {
      res.json(ApiResponse(notifications));
    });
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};



// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.json(ApiResponse({}, "Notification not found", true));
    }

    return res.json(ApiResponse({ notification }, "", true));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};


exports.getAllUnreadNotifications = async (req, res) => {
  try {
    let finalAggregate = [];

    finalAggregate.push(
      {
        $match: {
          isRead: false, // Filter only unread notifications
        },
      },
    );

    const myAggregate =
      finalAggregate.length > 0
        ? Notification.aggregate(finalAggregate)
        : Notification.aggregate([]);

    const totalUnreadCount = await Notification.countDocuments({
      isRead: false,
    });

    const notifications = await myAggregate
      .sort({ createdAt: -1 })
      .limit(3) // Limit to the top 5 notifications
      .exec();

    res.json(ApiResponse({ totalUnreadCount, notifications }));
  } catch (error) {
    return res.json(ApiResponse({}, error.message, false));
  }
};




exports.toggleNotification = async (req, res) => {
  try {
   let notification = await Notification.findById(req.params.id)
    
    if(!notification){
        return res.json(ApiResponse({},"Notification not Found",false));
    }

    notification.isRead =  !notification.isRead;
    
    await notification.save()

      // Respond to the user with a success message
    return res.json(ApiResponse({}, "Notification Changed successfully", true));
  } catch (error) {
    // Handle errors and respond with an error message
    return res.json(ApiResponse({}, error.message, false));
  }
};
