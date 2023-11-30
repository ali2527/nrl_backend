const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    paymentType:{
        type:String,
        enum:["ORDER","DONATION"],
        default:"ORDER"
    },
    amount: {
      type: Number,
      required: false,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "donation",
      },
    isPaid:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

paymentSchema.plugin(mongoosePaginate);
paymentSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("payment", paymentSchema);