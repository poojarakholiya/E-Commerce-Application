const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");

// Utils
const ErrorResponse = require("./app/utils/errorResponse");
const errorHandler = require("./app/middleware/error");
const { default: mongoose } = require("mongoose");
const router = require("./app/routes/authRoute");
const productRouter = require("./app/routes/productRoutes");
const cartRoutes = require("./app/routes/cartRoutes");
const orderRoutes = require("./app/routes/orderRoutes");

const PORT = process.env.PORT || 9002;
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log('path.join(__dirname, "uploads") :', path.join(__dirname, "uploads"));

const whiteList = [];

var corsOptions = {
  origin: process.env.NODE_ENV === "dev" ? "*" : whiteList,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "authorization",
    "x-payload-digest",
    "x-payload-digest-alg",
  ],
};


// Enable CORS (Cross-Origin Resource Sharing) to allow requests from other origins
app.use(cors(corsOptions));

// Middlewareuploads
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database connection & db sync
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// default route
app.get("/", (req, res, next) => {
  try {
    return res.json({
      status: "success",
      code: 200,
      message: "Welcome to Ghex-Money api.",
    });
  } catch (error) {
    next(error);
  }
});

//route config file
app.use("/api/auth", router)
app.use("/api/products", productRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


//unwanted route 404
app.all("*", (req, res, next) => {
  next(new ErrorResponse(`ENDPOINT NOT FOUND`, 404));
});

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
