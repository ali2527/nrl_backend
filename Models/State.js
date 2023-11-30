const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const stateSchema = new Schema(
  {
    name: {
        type: String,
        required:true,
        default: "",
    },
    abbreviation:{
        type: String,
        required:true,
        default: "",
    },
    stateNo: {
        type: Number,
        required:false,
    },
    flag: {
      type: String,
      default: "",
  },
  },
  { timestamps: true }
);

stateSchema.plugin(mongoosePaginate);
stateSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("state", stateSchema);