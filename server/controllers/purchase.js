const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateToken = (userId, ispremiumuser) => {
  return jwt.sign({ _id: userId, ispremiumuser }, process.env.TOKEN_KEY);
};

exports.purchasepremium = async (req, res) => {
  try {
    console.log("Purchase premium Api called..")
    const amount = 1000;
    const order = await razorpayInstance.orders.create({ amount, currency: "INR" });
    const newOrder = new Order({ orderId: order.id, status: "PENDING" });
    await newOrder.save();
    console.log(res)
    res.status(201).json({ order, key_id: razorpayInstance.key_id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.updatetransactionstatus = async (req, res) => {
  const { payment_id, order_id } = req.body;
  const userId = req.user._id;

  try {
    const order = await Order.findOne({ orderId: order_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!payment_id) {
      await updateTransactionStatus(order_id, userId, false);
      const token = generateToken(userId, false);
      res.status(200).json({ success: false, message: "Transaction Failed", token });
    } else {
      await updateTransactionStatus(order_id, userId, true, payment_id);
      const token = generateToken(userId, true);
      res.status(200).json({ success: true, message: "Transaction Successful", token });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const updateTransactionStatus = async (order_id, userId, isSuccess, payment_id = null) => {
  const orderUpdate = { status: isSuccess ? "SUCCESSFUL" : "FAILED" };
  if (payment_id) orderUpdate.paymentId = payment_id;

  const userUpdate = { ispremiumuser: isSuccess };

  await Promise.all([
    Order.updateOne({ orderId: order_id }, orderUpdate),
    User.updateOne({ _id: userId }, userUpdate)
  ]);
};
