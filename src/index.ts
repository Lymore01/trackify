import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import bodyParser from "body-parser";
import { Middlewares, Routes } from "../index.ts";
import { config } from "../config/config.ts"
const PORT = config.PORT || 4030;
const app = express();

const routes: {
  path: string;
  router: express.Router;
}[] = [
  { path: "/api", router: Routes.userRouter },
  { path: "/api", router: Routes.shortenRouter },
  { path: "/", router: Routes.urlRouter },
  { path: "/", router: Routes.statsRouter },
  { path: "/auth", router: Routes.tokenRouter },
  { path: "/auth", router: Routes.loginRouter },
  { path: "/auth", router: Routes.registerRouter },
  { path: "/auth", router: Routes.getNewTokenRouter },
  { path: "/auth", router: Routes.logoutRouter },
  { path: "/webhook", router: Routes.webHookRouter },
];


app.use(bodyParser.json());
app.use(Middlewares.logger);
app.use(Middlewares.limiter);
app.use(Middlewares.corsOptions);

routes.forEach(({path, router})=>(
  app.use(path, router)
))

// global error handler
app.use(Middlewares.errorHandler);

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
