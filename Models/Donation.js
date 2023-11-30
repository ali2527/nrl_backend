const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const donationSchema = new Schema(
  {
    donor: {
        type: String,
        required:true,
        default: "",
    },
    phone:{
        type: String,
        required:true,
    },
    amount:{
        type: Number,
        required:true,
        default: 0,
    },
  },
  { timestamps: true }
);

donationSchema.plugin(mongoosePaginate);
donationSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("donation", donationSchema);