const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

// GET /api/analytics/dashboard
router.get("/dashboard", verifyTokenAndAdmin, async (req, res) => {
  try {
    // 1. Total Counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // 2. Total Revenue
    // Aggregate total field from all orders
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // 3. Recent Orders (Last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    // 4. Sales Chart Data (Last 7 days)
    // We need to group orders by date and sum the total
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Note: createdAt in Order model is currently a String from the seed data/frontend
    // "2026-01-22T04:03:32.329Z"
    // We might need to handle string dates or convert them.
    // Ideally, we should use real Date objects in DB.
    // For now, let's try to aggregate assuming ISO strings or convert if possible.
    // Since we can't easily change all data types now, we might fetch last X orders and process in JS if dataset is small,
    // OR try to use $toDate in aggregation if MongoDB version supports it.
    // Let's try fetching recent orders (e.g. last 100) and processing in JS for safety/speed in this context.
    
    const lastOrders = await Order.find().sort({ createdAt: -1 }).limit(100);
    
    const salesMap = {};
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
        salesMap[dateStr] = 0;
    }

    lastOrders.forEach(order => {
        const d = new Date(order.createdAt);
        // Check if within last 7 days
        const diffTime = Math.abs(new Date() - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays <= 7) {
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
            if (salesMap[dateStr] !== undefined) {
                salesMap[dateStr] += order.total;
            }
        }
    });

    const salesChartData = Object.keys(salesMap).map(key => ({
        name: key,
        sales: salesMap[key]
    }));


    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders,
      salesChartData
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
