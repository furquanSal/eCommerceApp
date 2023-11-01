const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a User"],
  },
  products: [
    {
      name: {
        type: String,
        required: [true, "Product Name is Required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is Required"],
      },
      price: {
        type: Number,
        required: [true, "Price is Required"],
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile No is Required"],
    },
    houseNo: {
      type: String,
      required: [true, "House/Flat no is Required"],
    },
    street: {
      type: String,
      required: [true, "Street Name is Required"],
    },
    landmark: {
      type: String,
      required: [true, "Landmark is Required"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal Code is Required"],
    },
  },
  paymentMethod: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
