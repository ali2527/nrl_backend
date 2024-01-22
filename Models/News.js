const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    thumbnail: {
      type: String,
      required: false,
      default: "",
    },
    channel: {
      type: String,
      required: false,
      default: "",
    },
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    videoID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

newsSchema.plugin(mongoosePaginate);
newsSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("news", newsSchema);
