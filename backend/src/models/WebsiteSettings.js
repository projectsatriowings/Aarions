import mongoose from "mongoose";

const websiteSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: "Aarions",
    },
    logo: {
      type: String,
    },
    announcementText: {
      type: String,
      default: "Welcome to Aarions Organic Products! Free shipping on orders above ₹499.",
    },
    contactEmail: {
      type: String,
      default: "support@aarions.com",
    },
    contactPhone: {
      type: String,
      default: "+91 98765 43210",
    },
    address: {
      type: String,
      default: "Aarions Corporate Office, India",
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    seoTitle: {
      type: String,
      default: "Aarions - Premium Organic Products Honey, Ghee, Spices",
    },
    seoDescription: {
      type: String,
      default: "Aarions offers traditionally churned bilona A2 ghee, pure wild harvested forest honey, stone-ground organic spices and wellness products.",
    },
    seoKeywords: {
      type: String,
      default: "organic, honey, A2 ghee, bilona ghee, masalas, spices, pure wellness",
    },
    themeSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        primaryColor: "#5c3d2e",
        secondaryColor: "#e8c547",
        bgColor: "#fcf8f2",
      },
    },
    shippingFee: {
      type: Number,
      default: 60,
    },
    gstPercentage: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

const WebsiteSettings = mongoose.model("WebsiteSettings", websiteSettingsSchema);
export default WebsiteSettings;
