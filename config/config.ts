export const config = {
    PORT: process.env.PORT || 4030,
    BASE_URL: process.env.BASE_URL || "http://localhost:4030",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || "1d",
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
}