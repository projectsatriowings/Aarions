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
      default: "info@aarions.in",
    },
    contactPhone: {
      type: String,
      default: "+91 98432 70810",
    },
    address: {
      type: String,
      default: "No.1A, G1, Ground Floor, Gurudev Complex, 57th St, Venkatraman Nagar, Korattur, Chennai, Tamil Nadu 600080",
    },
    footerAboutText: {
      type: String,
      default: "Bringing nature's finest products to your family. Pure honey, ghee, masalas, and spices — crafted with tradition, tested with science.",
    },
    footerCopyright: {
      type: String,
      default: "Designed & Developed by Yakobu Business Solutions",
    },
    certifications: {
      type: String,
      default: "FSSAI, ISO 22000, Organic India, Non-GMO",
    },
    developerName: {
      type: String,
      default: "Yakobu Business Solutions",
    },
    developerUrl: {
      type: String,
      default: "https://www.myyakobu.com/",
    },
    paymentMethods: {
      type: String,
      default: "Visa, Mastercard, UPI, Razorpay, PhonePe",
    },
    // Homepage toggles
    showCertifications: { type: Boolean, default: true },
    showCategories: { type: Boolean, default: true },
    showFeaturedProducts: { type: Boolean, default: true },
    showWhyChooseUs: { type: Boolean, default: true },
    showBenefits: { type: Boolean, default: true },
    showBestSellers: { type: Boolean, default: true },
    showTestimonials: { type: Boolean, default: true },
    showBlogs: { type: Boolean, default: true },
    showNewsletter: { type: Boolean, default: true },
    homepageSectionOrder: {
      type: String,
      default: "certifications,categories,featuredProducts,whyChooseUs,benefits,bestSellers,testimonials,blogs,newsletter",
    },
    // Hero banner text & slides
    heroBadgeText: { type: String, default: "Premium Natural Products Since 2020" },
    heroTitleLine1: { type: String, default: "Pure Ingredients." },
    heroTitleLine2: { type: String, default: "Authentic" },
    heroTitleLine2Suffix: { type: String, default: " Flavors." },
    heroTitleLine3: { type: String, default: "Healthy Living." },
    heroSubtitle: { type: String, default: "Bringing nature's finest honey, ghee, masalas, and spices directly from farm to your family's kitchen." },
    heroButtonText: { type: String, default: "Shop Collection" },
    heroImages: { type: String, default: "/bg-ghee.png, /bg-honey.png, /bg-spices.png, /bg-masala.png, /auth-honey.jpg, /auth-spices-dark.jpg" },
    // About Page configurations
    aboutHeroTitleLine1: { type: String, default: "Purity Sourced From" },
    aboutHeroTitleLine2: { type: String, default: "Traditional Roots." },
    aboutHeroSubtitle: { type: String, default: "Our Story & Heritage" },
    aboutParagraph1: { type: String, default: "Aarions was born out of a simple, personal quest: the search for real, unadulterated food. In a market flooded with chemically polished spices, syrup-diluted honey, and hydrogenated fats, we wanted to create a brand that acts as an honest gateway to ancient dietary wellness." },
    aboutParagraph2: { type: String, default: "Our search took us from urban shelves to deep forest hives and rural cow sheds. We realized that the secret to health isn't in laboratories, but in preserving the slow, wise techniques developed by our grandparents." },
    aboutHeroImage: { type: String, default: "/about_hero_ghee_honey.png" },
    // Contact Page configurations
    contactHeroTitle: { type: String, default: "Contact Aarions" },
    contactHeroSubtitle: { type: String, default: "Get In Touch" },
    contactDescription: { type: String, default: "Have questions about our traditional processing, customized wellness honey, or bulk orders? Reach out to us." },
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
