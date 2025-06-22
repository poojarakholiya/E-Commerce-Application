const Cart = require("../models/Cart");
const ErrorResponse = require("../utils/errorResponse");

// Add item to cart
exports.addToCart = async (req, res) => {
  let { productId, quantity, productPrice } = req.body;
  console.log('productPrice :', productPrice);
  const userId = req.user._id;

  quantity = Number(quantity);
  if (!quantity || isNaN(quantity)) {
    return next(new ErrorResponse("Invalid product quantity", 400));
  }

  try {
    let cart = await Cart.findOne({ usr_id: userId });

    if (!cart) {
      cart = new Cart({ usr_id : userId, items: [{ prd_id: productId , prd_qty: quantity, prd_price: productPrice, }] });
    } else {
      const itemIndex = cart.items.findIndex((item) =>
        item.prd_id.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].prd_qty += quantity;
      } else {
        cart.items.push({ prd_id: productId , prd_qty: quantity, prd_price: productPrice, });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usr_id: req.user._id }).populate("items.prd_id");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update prd_qty
exports.updateCartItem = async (req, res) => {
   let { productId, quantity } = req.body;

  quantity = Number(quantity);
  if (!quantity || isNaN(quantity)) {
    return next(new ErrorResponse("Invalid product quantity", 400));
  }

  try {
    const cart = await Cart.findOne({ usr_id: req.user._id });
    const item = cart.items.find((item) => item.prd_id.toString() === productId);

    if (item) {
      item.prd_qty = quantity;
      await cart.save();
      res.json(cart);
    } else {
      return next(new ErrorResponse("Product not found in cart", 404));
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item
exports.removeCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId : req.user._id });
    cart.items = cart.items.filter((item) => item.prd_id.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
