import express from "express";
import { deleteUrl } from "../../controllers/url"

export const urlRouter = express.Router();

urlRouter.delete("/api/delete/:shortId", async (req, res) => {
	try {
		await deleteUrl(req, res);
	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}
});