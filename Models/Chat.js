const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coach",
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
    status:{
        type:String,
        enum:["ACTIVE","INACTIVE"],
        default:"ACTIVE"
    }
  },
  { timestamps: true }
);

chatSchema.plugin(mongoosePaginate);
chatSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("chat", chatSchema);
