const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

// GET /api/analytics/dashboard
router.get("/dashboard", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { range = '7d' } = req.query;

    // 0. Date Range Logic
    let startDate = new Date();
    let rangeDays = 7;

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
      rangeDays = 1;
    } else if (range === '7d') {
      startDate.setDate(startDate.getDate() - 7);
      rangeDays = 7;
    } else if (range === '30d') {
      startDate.setDate(startDate.getDate() - 30);
      rangeDays = 30;
    }

    // 1. Total Counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // 2. Total Revenue (within range)
    const revenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // 3. Recent Orders (Last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    // 4. Sales Chart Data
    const lastOrders = await Order.find({
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    const salesMap = {};
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const options = rangeDays === 1 ? { hour: '2-digit', minute: '2-digit' } : { weekday: 'short', month: 'short', day: 'numeric' };
      const dateStr = d.toLocaleDateString('en-US', options);
      salesMap[dateStr] = 0;
    }

    lastOrders.forEach(order => {
      const d = new Date(order.createdAt);
      const options = rangeDays === 1 ? { hour: '2-digit', minute: '2-digit' } : { weekday: 'short', month: 'short', day: 'numeric' };
      const dateStr = d.toLocaleDateString('en-US', options);
      if (salesMap[dateStr] !== undefined) {
        salesMap[dateStr] += order.total;
      }
    });

    const salesChartData = Object.keys(salesMap).map(key => ({
      name: key,
      sales: salesMap[key]
    }));

    // 5. Order Status Breakdown (within range)
    const statusMap = {};
    lastOrders.forEach(order => {
      const statusName = order.status?.name || 'Unknown';
      statusMap[statusName] = (statusMap[statusName] || 0) + 1;
    });
    const statusData = Object.keys(statusMap).map(key => ({
      name: key,
      value: statusMap[key]
    }));

    // 6. Top Selling Products (within range)
    const productsLookup = await Product.find({}, 'name price image');
    const productCache = {};
    productsLookup.forEach(p => {
      productCache[p._id.toString()] = p;
      if (p.id) productCache[p.id.toString()] = p;
    });

    const productSalesMap = {};
    lastOrders.forEach(order => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(p => {
          const productId = p.product_id || p.id || p._id;
          const dbProduct = productCache[productId?.toString()];

          const productName = p.name || dbProduct?.name || 'Unknown Product';
          const productPrice = p.price || dbProduct?.price || 0;
          const quantity = p.quantity || p.pivot?.order_quantity || 1;

          if (!productSalesMap[productName]) {
            productSalesMap[productName] = {
              name: productName,
              count: 0,
              revenue: 0,
              image: p.image?.thumbnail || p.image || dbProduct?.image?.thumbnail || dbProduct?.image || ''
            };
          }
          productSalesMap[productName].count += quantity;
          productSalesMap[productName].revenue += (productPrice * quantity);
        });
      }
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 7. Low Stock Alerts
    const lowStockProducts = await Product.find({ quantity: { $lt: 10 } })
      .select('name quantity image')
      .limit(5);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders,
      salesChartData,
      statusData,
      topProducts,
      lowStockProducts
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
