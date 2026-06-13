import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import { products } from "../../../user/src/data/products.js";
import { blogs } from "../../../user/src/data/blogs.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import AdminUser from "../models/AdminUser.js";
import WebsiteSettings from "../models/WebsiteSettings.js";
import Coupon from "../models/Coupon.js";
import Blog from "../models/Blog.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Review from "../models/Review.js";
import Wishlist from "../models/Wishlist.js";
import Address from "../models/Address.js";
import Notification from "../models/Notification.js";
import Payment from "../models/Payment.js";
import AuditLog from "../models/AuditLog.js";
import ContactQuery from "../models/ContactQuery.js";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

dotenv.config();

const seedDB = async () => {
  try {
    // Set DNS servers to Google and Cloudflare to resolve SRV records on Windows reliably
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (dnsErr) {
      console.warn("Could not set custom DNS servers:", dnsErr.message);
    }

    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aarions";
    await mongoose.connect(mongoUri);
    console.log("Seeding started. Connected to database:", mongoUri);

    // 1. Clean Database
    console.log("Cleaning existing collections...");
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await AdminUser.deleteMany();
    await WebsiteSettings.deleteMany();
    await Coupon.deleteMany();
    await Blog.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Review.deleteMany();
    await Wishlist.deleteMany();
    await Address.deleteMany();
    await Notification.deleteMany();
    await Payment.deleteMany();
    await AuditLog.deleteMany();
    await ContactQuery.deleteMany();
    await NewsletterSubscriber.deleteMany();

    // 2. Extract and create Categories
    console.log("Extracting categories...");
    const categoriesMap = new Map();

    products.forEach((prod) => {
      if (!categoriesMap.has(prod.category)) {
        categoriesMap.set(prod.category, {
          name: prod.categoryLabel,
          slug: prod.category,
          description: `Premium organic ${prod.categoryLabel.toLowerCase()} sourced traditionally.`,
          image: prod.image,
        });
      }
    });

    const categoriesArray = Array.from(categoriesMap.values());
    const dbCategories = await Category.insertMany(categoriesArray);
    console.log(`Successfully seeded ${dbCategories.length} categories.`);

    // 3. Seed Products
    console.log("Mapping and inserting products...");
    const mappedProducts = products.map((prod) => {
      // Find category object reference
      const categoryObj = dbCategories.find((cat) => cat.slug === prod.category);

      // Map nutrient keys
      const nutrientsMap = new Map();
      if (prod.nutrients) {
        Object.entries(prod.nutrients).forEach(([key, val]) => {
          nutrientsMap.set(key, val);
        });
      }

      // Map variant prices
      const variantPricesMap = new Map();
      if (prod.variantPrices) {
        Object.entries(prod.variantPrices).forEach(([key, val]) => {
          variantPricesMap.set(key, val);
        });
      }

      return {
        name: prod.name,
        slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        category: prod.category,
        categoryRef: categoryObj ? categoryObj._id : null,
        categoryLabel: prod.categoryLabel,
        price: prod.price,
        originalPrice: prod.originalPrice || prod.price,
        rating: prod.rating || 0,
        reviewsCount: prod.reviewsCount || 0,
        badge: prod.badge || "",
        isBestSeller: !!prod.isBestSeller,
        isNew: !!prod.isNew,
        description: prod.description,
        details: prod.details || prod.description,
        features: prod.features || [],
        usage: prod.usage || "",
        benefits: prod.benefits || [],
        ingredients: prod.ingredients || "",
        weight: prod.weight || "100g",
        image: prod.image,
        images: prod.images || [prod.image],
        inStock: prod.inStock !== undefined ? prod.inStock : true,
        variants: prod.variants || [],
        variantPrices: variantPricesMap,
        nutrients: nutrientsMap,
        inventory: 150, // default inventory amount
        sku: `AAR-${prod.category.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "active",
      };
    });

    const dbProducts = await Product.insertMany(mappedProducts);
    console.log(`Successfully seeded ${dbProducts.length} products.`);

    // 4. Create default Customer testing account
    console.log("Creating default customer profile...");
    const defaultCustomer = await User.create({
      name: "Aarion Customer",
      email: "customer@aarions.com",
      password: "password123", // Pre-save hook hashes this
      phoneNumber: "+91 99999 99999",
      verified: true,
    });
    console.log("Default customer account created: customer@aarions.com / password123");

    // 5. Create default Admin account
    console.log("Creating default administrator profile...");
    const defaultAdmin = await AdminUser.create({
      name: "Aarions Super Admin",
      email: "admin@aarions.com",
      password: "password123", // Pre-save hook hashes this
      role: "superadmin",
      permissions: ["all"],
      status: "active",
    });
    console.log("Default admin account created: admin@aarions.com / password123");

    // 5.5 Seed Blog posts
    console.log("Mapping and inserting blog posts...");
    const mappedBlogs = blogs.map((blog) => ({
      title: blog.title,
      slug: blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      category: blog.category,
      summary: blog.summary || blog.excerpt,
      content: blog.content,
      image: blog.image,
      readingTime: blog.readTime || "3 min read",
      author: defaultAdmin._id,
      isPublished: true,
      publishedAt: new Date(),
    }));
    await Blog.insertMany(mappedBlogs);
    console.log("Blog articles seeded successfully!");

    // 6. Create default WebsiteSettings
    console.log("Creating default site settings...");
    await WebsiteSettings.create({
      brandName: "Aarions",
      announcementText: "Welcome to Aarions! Pure organic honey, ghee, and stone-ground masalas.",
      shippingFee: 60,
      gstPercentage: 5,
    });

    // 7. Create a couple default Coupons
    console.log("Creating sample coupon codes...");
    await Coupon.create({
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 200,
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days expiry
    });
    await Coupon.create({
      code: "AARIONS50",
      discountType: "fixed",
      discountValue: 50,
      minOrderAmount: 499,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
    });

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
