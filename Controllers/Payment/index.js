//Models
const User = require("../../Models/User");
const Payment = require("../../Models/Payment");
const Order = require("../../Models/Order");
const Donation = require("../../Models/Donation")
const fs = require("fs")

//Helpers
const { generateToken } = require("../../Helpers/index");
const { ApiResponse } = require("../../Helpers/index");
const { validateToken } = require("../../Helpers/index");
const { generateString } = require("../../Helpers/index");
const { errorHandler } = require("../../Helpers/errorHandler");
const { generateEmail } = require("../../Helpers/email");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const sanitizeUser = require("../../Helpers/sanitizeUser");
const {
  createResetToken,
  validateResetToken,
} = require("../../Helpers/verification");


  exports.getAllPayments = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;


      let { type, isPaid, from, to } = req.query;
      let finalAggregate = [];
  
      if (req.query) {
        if (type) {
          finalAggregate.push({
            $match: {
              type: req.query.type,
            },
          });
        }

        if (isPaid) {
            finalAggregate.push({
              $match: {
                isPaid: req.query.isPaid,
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
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $lookup: {
          from: "donations",
          localField: "donation",
          foreignField: "_id",
          as: "donation",
        },
      });
  
      const myAggregate =
        finalAggregate.length > 0
          ? Payment.aggregate(finalAggregate)
          : Payment.aggregate([]);
  
      Payment.aggregatePaginate(myAggregate, { page, limit }).then((payments) => {
        res.json(ApiResponse(payments));
      });
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

  exports.getAllMyPayments = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;


      let { type, isPaid, from, to } = req.query;
      let finalAggregate = [{
        $match:{
            user: new mongoose.Types.ObjectId(req.user._id),
        }
      }];
  
      if (req.query) {
        if (type) {
          finalAggregate.push({
            $match: {
              type: req.query.type,
            },
          });
        }

        if (isPaid) {
            finalAggregate.push({
              $match: {
                isPaid: req.query.isPaid,
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
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $lookup: {
          from: "donations",
          localField: "donation",
          foreignField: "_id",
          as: "donation",
        },
      });
  
      const myAggregate =
        finalAggregate.length > 0
          ? Payment.aggregate(finalAggregate)
          : Payment.aggregate([]);
  
      Payment.aggregatePaginate(myAggregate, { page, limit }).then((payments) => {
        res.json(ApiResponse(payments));
      });
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

  exports.getAllDonations = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;


      let { isPaid, from, to } = req.query;
      let finalAggregate = [];
  
      if (req.query) {
        if (type) {
          finalAggregate.push({
            $match: {
              type: "DONATION",
            },
          });
        }

        if (isPaid) {
            finalAggregate.push({
              $match: {
                isPaid: req.query.isPaid,
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
  
      finalAggregate.push(
      {
        $lookup: {
          from: "donations",
          localField: "donation",
          foreignField: "_id",
          as: "donation",
        },
      });
  
      const myAggregate =
        finalAggregate.length > 0
          ? Payment.aggregate(finalAggregate)
          : Payment.aggregate([]);
  
      Payment.aggregatePaginate(myAggregate, { page, limit }).then((payments) => {
        res.json(ApiResponse(payments));
      });
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };

  exports.getAllOrderPayments = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;


      let {type, isPaid, from, to } = req.query;
      let finalAggregate = [];
  
          finalAggregate.push({
            $match: {
              paymentType: "ORDER",
            },
          });
          
          
      if (req.query) {
           if (isPaid) {
            finalAggregate.push({
              $match: {
                isPaid: req.query.isPaid,
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
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "order",
        },
      },{
        $unwind: "$order",
      });
 
 
 console.log(finalAggregate)
 
 
  
      const myAggregate =
        finalAggregate.length > 0
          ? Payment.aggregate(finalAggregate)
          : Payment.aggregate([]);
  
      Payment.aggregatePaginate(myAggregate, { page, limit }).then((payments) => {
        res.json(ApiResponse(payments));
      });
    } catch (error) {
      return res.json(ApiResponse({}, error.message, false));
    }
  };
 
  // Delete a payment
  exports.deletePayment = async (req, res) => {
    try {
      const payment = await Payment.findByIdAndRemove(req.params.id);
  
      if (!payment) {
        return res.json(ApiResponse({}, "Payment not found", false));
      }
  
      return res.json(ApiResponse({}, "Payment Deleted Successfully", true));
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


  exports.orderPayment = async (req,res) => {
    try {
      const {
        orderId,
        stripeToken
      } = req.body;

      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.json(ApiResponse({}, "Order not found", true));
      }

 

      if(order.isPaid){
        return res.json(ApiResponse({}, "Order already Paid", true));
      }

      let charge = await stripe.charges.create({
        amount: order.totalAmount * 100,
        description: "National Reparations League",
        currency: "usd",
        source: stripeToken.id,
      });

      order.isPaid = true;

      await order.save()

      const payment = new Payment({
        paymentType:"ORDER",
        amount:order.totalAmount,
        order:orderId,
        isPaid:true,
        chargeId:charge.id
      })

      await payment.save()

      return res.json(ApiResponse({}, "Payment Successful", true));

    } catch (error) {
      console.log(error)
      return res.json(
        ApiResponse(
          {},
          error.message,
          false
        )
      );
    }
  }


  
  exports.donationPayment = async (req,res) => {
    try {
      const {
        donor,
        phone,
        email,
        amount,
        stripeToken
      } = req.body;

      let charge = await stripe.charges.create({
        amount: amount * 100,
        description: "National Reparations League",
        currency: "usd",
        source: stripeToken.id,
      });

     
      const donation = new Donation({
        donor,
        phone,
        email,
        amount,
      })

      await donation.save()

      const payment = new Payment({
        paymentType:"DONATION",
        amount:amount,
        donation:donation._id,
        isPaid:true,
        chargeId:charge.id
      })

      await payment.save()

      return res.json(ApiResponse({}, "Thankyou for Your Donation", true));

    } catch (error) {
      console.log(error)
      return res.json(
        ApiResponse(
          {},
          error.message,
          false
        )
      );
    }
  }
  
    exports.deleteAllPayment = async (req,res) => {
    try {

const payment = Payment.deleteMany()

      return res.json(ApiResponse({}, "Thankyou for Your Donation", true));

    } catch (error) {
      console.log(error)
      return res.json(
        ApiResponse(
          {},
          error.message,
          false
        )
      );
    }
  }
  
  

  exports.getToken= async (req,res) => {
    try {

      const token = await stripe.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 9,
          exp_year: 2024,
          cvc: '314',
        },
      });


      return res.json(
        ApiResponse(
          {token},
          "",
          true
        )
      );

    } catch (error) {
      console.log(error)
      return res.json(
        ApiResponse(
          {},
          error.message,
          false
        )
      );
    }
  }


  