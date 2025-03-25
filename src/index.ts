import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import bodyParser from "body-parser";
import { logger } from "./middlewares/logger.ts";
import { limiter } from "./middlewares/rate_limiter.ts";
import { corsOptions } from "./middlewares/cors.ts";
import { errorHandler } from "./middlewares/error_handler.ts";
import { userRouter } from "./routes/users/user.ts"
import { urlRouter } from "./routes/url/url.ts"
import { shortenRouter } from "./routes/url/shorten.ts"
import { statsRouter } from "./routes/stats/stats.ts"
import { tokenRouter } from "./routes/auth/generate_key.ts"
import { loginRouter } from "./routes/auth/login.ts"
import { registerRouter } from "./routes/auth/register.ts"
import swaggerDocs from "../docs/swagger.ts";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(logger);
app.use(limiter);
app.use(corsOptions);

// routes
app.use("/api", userRouter);
app.use("/", urlRouter);
app.use("/api", shortenRouter);
app.use("/", statsRouter);
app.use("/auth", tokenRouter);
app.use("/auth", loginRouter);
app.use("/auth", registerRouter);


// global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
  swaggerDocs(app, Number(PORT));
});
