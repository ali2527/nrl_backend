const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    title: {
        type: String,
        required:true,
        default: "",
    },
    description:{
        type: String,
        required:true,
        default: "",
    },
  },
  { timestamps: true }
);

categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(aggregatePaginate);
module.exports = mongoose.model("category", categorySchema);