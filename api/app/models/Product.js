const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    prd_name: {
      type: String,
      required: true,
      text: true,
    },
    prd_desc: {
      type: String,
      required: true,
    },
    prd_price: {
      type: Number,
      required: true,
    },
    prd_image: {
      type: String,
      default: "",
    },
    prd_category: {
      type: String,
    },
    prd_qty: {
       type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not a valid quantity'
      }
    },
    deleted_at: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true,
   }
);

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
