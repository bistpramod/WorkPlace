import "dotenv/config";
export const config = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/slotwise",
  jwtSecret:
    process.env.JWT_SECRET || "development-only-secret-change-before-deploying",
  timezone: process.env.BUSINESS_TZ || "Asia/Kathmandu",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  production: process.env.NODE_ENV === "production",
};
