const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const { productSchema } = require("../utils/validator/product");

// @desc    Create Product
exports.createProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    console.log('value :', value);
    let { productName, productDesc, productPrice, productCategory, productQty } = value;

    // TODO: Manage this error in better way
    if (error) return next(new ErrorResponse(error, 400));

    const imagePath = req.file ? req.file.path : '';

    const product = await Product.create({
      prd_name: productName,
      prd_desc: productDesc,
      prd_price:productPrice,
      prd_image:imagePath,
      prd_category:productCategory,
      prd_qty: productQty,
    });
    res.status(201).json(product);
  } catch (err) {
  console.log('err :', err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get All Products with filtering/search/pagination
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy, page, limit } = req.query;

    const query = { deleted_at: false };

    if (search) {
      query.prd_name = {
         $regex: search,
         $options: "i",
      } ;
    }
    

    // Category filter
    if (category) {
      query.prd_category = {
         $regex: category,
         $options: "i",
      } ;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.prd_price = {};
      if (minPrice) query.prd_price.$gte = Number(minPrice);
      if (maxPrice) query.prd_price.$lte = Number(maxPrice);
    }

    // Pagination
    const pageNum = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNum - 1) * pageSize;

    // Sort logic
    const sortOptions = {};
    if (sortBy === "priceAsc") sortOptions.prd_price = 1;
    else if (sortBy === "priceDesc") sortOptions.prd_price = -1;
    else if (sortBy === "newest") sortOptions.createdAt = -1;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, deleted_at: false });
    if (!product) return next(new ErrorResponse("Product not found", 404));
          
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    const {
      productName,
      productDesc,
      productPrice,
      productCategory,
      productQty,
    } = value;

    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorResponse("Product not found", 404));

    // Only update image if a new one is uploaded
    const imagePath = req.file ? req.file.path : product.prd_image;

    // Update fields
    product.prd_name = productName;
    product.prd_desc = productDesc;
    product.prd_price = productPrice;
    product.prd_image = imagePath;
    product.prd_category = productCategory;
    product.prd_qty = productQty;

    const updated = await product.save();
    res.json(updated);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Soft Delete Product
exports.softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deleted_at: true },
      { new: true }
    );
    res.json({ message: "Product soft-deleted", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
