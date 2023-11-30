const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const positionSchema = new Schema(
  {
    type: {
        type: String,
        required:true,
        default: "",
    },
  },
  { timestamps: true }
);

positionSchema.plugin(mongoosePaginate);
positionSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("position", positionSchema);