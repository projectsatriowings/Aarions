import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "../utils/emailHelper.js";

// @desc    Place new order (Customer)
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountPrice,
    totalAmount,
    couponApplied,
  } = req.body;

  try {
    if (!items || items.length === 0) {
      return next(new ErrorResponse("No order items provided", 400));
    }

    // 1. Verify stock levels for each item
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new ErrorResponse(`Product not found: ${item.name}`, 404));
      }
      if (product.inventory < item.quantity) {
        return next(new ErrorResponse(`Insufficient stock for "${item.name}". Available: ${product.inventory}`, 400));
      }
    }

    // 2. Reduce stock ONLY if the order is confirmed immediately (COD)
    if (paymentMethod === "cod") {
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.inventory -= item.quantity;
          if (product.inventory === 0) {
            product.inStock = false;
          }
          await product.save();
        }
      }
    }

    // 2. Create the order
    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountPrice,
      totalAmount,
      couponApplied,
      status: paymentMethod === "cod" ? "Confirmed" : "Pending",
    });

    // 3. Clear user's cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } });

    if (paymentMethod === "cod") {
      sendOrderConfirmationEmail(order, req.user);
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

    if (!order) {
      return next(new ErrorResponse("Order not found", 404));
    }

    if (["Shipped", "Out For Delivery", "Delivered", "Cancelled"].includes(order.status)) {
      return next(new ErrorResponse(`Order cannot be cancelled at this stage: ${order.status}`, 400));
    }

    // Restore stock levels
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inventory += item.quantity;
        product.inStock = true;
        await product.save();
      }
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id, status: { $ne: "Pending" } }).sort("-createdAt");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate("items.product");

    if (!order) {
      return next(new ErrorResponse("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = { status: { $ne: "Pending" } };

    if (status) {
      query.status = status;
    }

    // Search by Order ID, coupon or tracking code
    if (search) {
      if (search.match(/^[0-9a-fA-F]{24}$/)) {
        query._id = search;
      } else {
        query.$or = [
          { trackingNumber: { $regex: search, $options: "i" } },
          { couponApplied: { $regex: search, $options: "i" } },
        ];
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Order Status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  const { status, trackingNumber, carrier, expectedDeliveryDate, comment } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse("Order not found", 404));
    }

    if (status) {
      order.status = status;
    }

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (carrier !== undefined) order.carrier = carrier;
    if (expectedDeliveryDate !== undefined) order.expectedDeliveryDate = expectedDeliveryDate;

    // Save triggers status tracking history push in order model
    await order.save();

    // Send status update email to customer asynchronously in the background
    order.populate("user", "name email")
      .then((populatedOrder) => {
        if (populatedOrder.user) {
          sendOrderStatusUpdateEmail(populatedOrder, populatedOrder.user).catch((emailErr) => {
            console.error("Failed to send status update email:", emailErr.message);
          });
        } else {
          console.warn(`Cannot send status update email: no user reference found for order #${order._id}`);
        }
      })
      .catch((err) => {
        console.error("Failed to populate user for email:", err.message);
      });

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "update_order_status",
      targetModel: "Order",
      targetId: order._id,
      details: `Updated order #${order._id} status to: "${status}". Tracking: ${trackingNumber || "N/A"}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
