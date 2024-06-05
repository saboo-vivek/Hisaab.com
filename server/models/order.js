const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
   paymentId: {
      type: String,
   },
   orderId: {
      type: String,
   },
   status: {
      type: String,
   },
   UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Order", orderSchema);
