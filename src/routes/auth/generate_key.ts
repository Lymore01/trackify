// generate token using uuid
import express from "express"
import { authenticateToken } from "../../middlewares/authenticate_token.ts"
import { generateApiKey } from "../../controllers/auth.ts";

export const tokenRouter = express.Router();

tokenRouter.use(authenticateToken);

tokenRouter.post("/generate-key", async (req, res) => {
    await generateApiKey(req, res)
})


