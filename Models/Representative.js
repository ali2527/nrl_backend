const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "",
  },
  code: {
    type: String,
    required: false,
  },
  grade: {
    type: String,
    required: false,
  },
});

const reportCardSchema = new Schema({
  teacher: {
    type: String,
    required: true,
    default: "",
  },
  term: {
    type: String,
    required: true,
    default: "",
  },
  grade: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
    date: {
    type: Date,
    default: new Date(),
  },
  comment: {
    type: String,
    required: false,
  },
  courses: [courseSchema],
});

const representativeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "position",
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "state",
    },
    image: {
      type: String,
      required: false,
    },
    reportCard: reportCardSchema,
  },
  { timestamps: true }
);

representativeSchema.plugin(mongoosePaginate);
representativeSchema.plugin(aggregatePaginate); 
module.exports = mongoose.model("representative", representativeSchema);
