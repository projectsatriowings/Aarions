import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

// @desc    Get dashboard metrics (KPIs + Chart data)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardMetrics = async (req, res, next) => {
  try {
    // 1. KPI cards data
    const totalOrders = await Order.countDocuments({ status: { $ne: "Pending" } });
    const totalUsers = await User.countDocuments({ role: "customer" });
    const lowStockProducts = await Product.countDocuments({ inventory: { $lt: 10 } });

    // Sum of successful order revenue
    const revenueStats = await Order.aggregate([
      { $match: { status: { $nin: ["Cancelled", "Pending"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // 2. Sales analytics chart data (Grouped by Month)
    const salesOverTime = await Order.aggregate([
      { $match: { status: { $nin: ["Cancelled", "Pending"] } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    // Format chart data for Recharts (e.g. { name: "2026-06", revenue: 5000, orders: 12 })
    const chartData = salesOverTime.map((item) => ({
      name: item._id,
      revenue: item.revenue,
      orders: item.orders,
    }));

    // 3. Category distribution (Revenue by category)
    const categoryStats = await Order.aggregate([
      { $match: { status: { $nin: ["Cancelled", "Pending"] } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.categoryLabel",
          value: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ]);

    const categoryChartData = categoryStats.map((item) => ({
      name: item._id || "Other",
      value: item.value,
    }));

    // 4. Popular products (top 5 sold)
    const popularProductsStats = await Order.aggregate([
      { $match: { status: { $nin: ["Cancelled", "Pending"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          image: { $first: "$items.image" },
          unitsSold: { $sum: "$items.quantity" },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
    ]);

    // 5. Recent orders
    const recentOrders = await Order.find({ status: { $ne: "Pending" } })
      .populate("user", "name email")
      .sort("-createdAt")
      .limit(5);

    // 6. Recent audit logs
    const recentLogs = await AuditLog.find()
      .populate("adminUser", "name email")
      .sort("-createdAt")
      .limit(5);

    res.status(200).json({
      success: true,
      kpis: {
        totalRevenue,
        totalOrders,
        totalUsers,
        lowStockProducts,
      },
      salesChart: chartData,
      categoryChart: categoryChartData,
      popularProducts: popularProductsStats,
      recentOrders,
      recentLogs,
    });
  } catch (error) {
    next(error);
  }
};
