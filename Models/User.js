const mongoose = require("mongoose");
const { createHmac } = require('node:crypto');
const mongoosePaginate = require('mongoose-paginate');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const { token } = require("morgan");
const { v4: uuidv4 } = require('uuid');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 3,
      required: true,
    },
    gender: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      minlength: 3,
      required: true,
      unique: true,
      dropDups: true,
    },
   
    salt: String,
   
    image: {
      type: String,
    },
    hashed_password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isMember: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
   
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

  userSchema.methods = {
    encryptPassword: function (password) {
      if (!password) return "";

         try {
        
        return crypto
          .createHmac("sha1", this.salt)
          .update(password)
          .digest("hex");
      } catch (err) {
        console.log(err.message);
        return "";
      }
    },
    authenticate: function (plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },
  };

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("user", userSchema);
