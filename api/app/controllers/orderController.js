const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, deliveryDate } = req.body;

    const cart = await Cart.findOne({ usr_id: userId }).populate("items.prd_id");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const items = cart.items.map((item) => ({
      prd_id: item.prd_id._id,
      prd_qty: item.prd_qty,
      prd_price: item.prd_id.prd_price,
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.prd_price, 0);

    const order = await Order.create({
      usr_id,
      items,
      shippingAddress,
      deliveryDate,
      totalAmount,
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, usr_id: req.user._id });

    if (!order) return res.status(404).json({ message: "Order not found" });

    const now = new Date();
    if (now > new Date(order.deliveryDate)) {
      return res.status(400).json({ message: "Cannot cancel after delivery date" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ usr_id: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTotalExpenses = async (req, res) => {
  try {
    const orders = await Order.find({ usr_id: req.user._id, status: { $ne: "Cancelled" } });
    const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
