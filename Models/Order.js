const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const {generateRandom6DigitID} = require("../Helpers")
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
          orderId:{
        type: String,
        required:false,
        default: generateRandom6DigitID("OR"),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, 
        quantity: Number,
        price: Number,
        variations:[{title:String,value:String}],
      },
    ],
    totalAmount: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum:["PENDING","PROCESSING","DISPATCHED","CANCELLED","COMPLETED"],
      default: "PENDING",
    },
    address: { 
      type: String,
      required: false,
    },
    city: { 
      type: String,
      required: false,
    },
    state: { 
        type: String,
        required: false,
      },
      zip: { 
        type: Number,
        required: false,
      },
    phone:{
        type: String,
        required: false,
    },
    isPaid:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

orderSchema.plugin(mongoosePaginate);
orderSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("order", orderSchema);