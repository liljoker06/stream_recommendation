import express from "express";
import { handleEvent } from "../controllers/eventsController.js";

const router = express.Router();

router.post("/", handleEvent);

export default router;
