const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const {generateRandom6DigitID} = require("../Helpers")
const Schema = mongoose.Schema;


const variationSchema = new mongoose.Schema({
  title: {
    type: String,
    required:true,
    default:"" 
  },
  displayType:{
    type: String,
    enum:["RADIO","DROPDOWN","MULTISELECT"],
    default:"RADIO",
  },
  item: [{
    type:String,
    required:false,
  }],
});


const productSchema = new Schema(
  {
    sku:{
        type: String,
        required:false,
        default: generateRandom6DigitID("NRL"),
    },
    title: {
        type: String,
        required:true,
        default: "",
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    description:{
        type: String,
        required:true,
        default: "",
    },
    price:{
        type: Number,
        required:true,
        default: 0,
    },
    stock:{
        type: Number,
        required:false,
        default: 1,
    },
    variations:[variationSchema],
    coverImage:{
        type: String,
        required:false,
    },
    gallery:[
      {
        type: String,
        required:false,
    }
    ]
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);
productSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("product", productSchema);