import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //window frame 15 mins
    max: 100, // limit to 100 request per ip
    message: "Too many requests, please try again later",
});
